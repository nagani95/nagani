CREATE OR REPLACE FUNCTION public.advance_six_animal_room(p_room_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_round public.six_animal_rounds%rowtype;
  v_animals text[] := array['tiger', 'dragon', 'rooster', 'fish', 'crab', 'elephant'];
  v_result text[];
  v_now timestamptz := now();
  v_settlement json;
begin
  select *
  into v_round
  from public.six_animal_rounds
  where room_id = p_room_id
    and status = 'active'
  order by created_at desc
  limit 1
  for update;

  if v_round.id is null then
    return public.rotate_six_animal_round(p_room_id);
  end if;

  if v_round.phase = 'betting'
    and v_round.betting_ends_at is not null
    and v_round.betting_ends_at <= v_now
  then
    v_result := public.pick_six_animal_festival_result(v_round.id);

    if v_result is null or array_length(v_result, 1) <> 3 then
      v_result := array[
        v_animals[floor(random() * 6 + 1)],
        v_animals[floor(random() * 6 + 1)],
        v_animals[floor(random() * 6 + 1)]
      ];
    end if;

    update public.six_animal_rounds
    set
      phase = 'closed',
      rolling_starts_at = v_now + interval '3 seconds',
      result_animals = v_result,
      updated_at = v_now
    where id = v_round.id;

    return json_build_object(
      'success', true,
      'action', 'closed_bets_preloaded_result',
      'result_mode', 'festival_balance_v2',
      'round_id', v_round.id,
      'phase', 'closed',
      'rolling_starts_at', v_now + interval '3 seconds',
      'result_animals', v_result
    );
  end if;

  if v_round.phase = 'closed'
    and v_round.rolling_starts_at is not null
    and v_round.rolling_starts_at <= v_now
  then
    v_result := v_round.result_animals;

    if v_result is null or array_length(v_result, 1) is null then
      v_result := array[
        v_animals[floor(random() * 6 + 1)],
        v_animals[floor(random() * 6 + 1)],
        v_animals[floor(random() * 6 + 1)]
      ];
    end if;

    update public.six_animal_rounds
    set
      phase = 'rolling',
      result_animals = v_result,
      updated_at = v_now
    where id = v_round.id;

    return json_build_object(
      'success', true,
      'action', 'started_rolling_with_preloaded_result',
      'round_id', v_round.id,
      'phase', 'rolling',
      'result_animals', v_result
    );
  end if;

  if v_round.phase = 'rolling'
    and v_round.updated_at is not null
    and v_round.updated_at + interval '34 seconds' <= v_now
  then
    v_result := v_round.result_animals;

    if v_result is null or array_length(v_result, 1) is null then
      v_result := array[
        v_animals[floor(random() * 6 + 1)],
        v_animals[floor(random() * 6 + 1)],
        v_animals[floor(random() * 6 + 1)]
      ];
    end if;

    v_settlement := public.settle_six_animal_round(v_round.id, v_result);

    update public.six_animal_rounds
    set
      phase = 'result',
      result_animals = v_result,
      result_revealed_at = coalesce(result_revealed_at, v_now),
      next_round_starts_at = v_now + interval '8 seconds',
      updated_at = v_now
    where id = v_round.id;

    return json_build_object(
      'success', true,
      'action', 'revealed_and_settled_result',
      'round_id', v_round.id,
      'phase', 'result',
      'result_animals', v_result,
      'settlement', v_settlement
    );
  end if;

  if v_round.phase = 'result'
    and v_round.next_round_starts_at is not null
    and v_round.next_round_starts_at <= v_now
  then
    return public.rotate_six_animal_round(p_room_id);
  end if;

  return json_build_object(
    'success', true,
    'action', 'no_change',
    'round_id', v_round.id,
    'phase', v_round.phase
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.rotate_six_animal_round(p_room_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_existing_betting public.six_animal_rounds%rowtype;
  v_new_round_id uuid;
  v_next_round_number integer;
  v_now timestamptz := now();
begin
  select *
  into v_existing_betting
  from public.six_animal_rounds
  where room_id = p_room_id
    and status = 'active'
    and phase = 'betting'
    and betting_ends_at is not null
    and betting_ends_at > v_now
  order by created_at desc
  limit 1;

  if v_existing_betting.id is not null then
    return json_build_object(
      'success', true,
      'new_round_id', v_existing_betting.id,
      'round_number', v_existing_betting.round_number,
      'phase', v_existing_betting.phase,
      'betting_ends_at', v_existing_betting.betting_ends_at,
      'reused', true
    );
  end if;

  update public.six_animal_rounds
  set
    status = 'archived',
    updated_at = v_now
  where room_id = p_room_id
    and status = 'active';

  select coalesce(max(round_number), 1207) + 1
  into v_next_round_number
  from public.six_animal_rounds
  where room_id = p_room_id;

  insert into public.six_animal_rounds (
    room_id,
    round_number,
    phase,
    status,
    betting_starts_at,
    betting_ends_at,
    rolling_starts_at,
    result_revealed_at,
    next_round_starts_at,
    result_animals,
    match_count,
    created_at,
    updated_at
  )
  values (
    p_room_id,
    v_next_round_number,
    'betting',
    'active',
    v_now,
    v_now + interval '20 seconds',
    v_now + interval '23 seconds',
    null,
    null,
    null,
    0,
    v_now,
    v_now
  )
  returning id into v_new_round_id;

  return json_build_object(
    'success', true,
    'new_round_id', v_new_round_id,
    'round_number', v_next_round_number,
    'phase', 'betting',
    'betting_starts_at', v_now,
    'betting_ends_at', v_now + interval '20 seconds',
    'rolling_starts_at', v_now + interval '23 seconds',
    'reused', false
  );
end;
$function$;