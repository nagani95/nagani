"use server";

import { redirect } from "next/navigation";

import { createClient } from "./server";

const SIX_ANIMAL_ROOM_UUID = "11111111-1111-1111-1111-111111111111";

const VALID_SIX_ANIMAL_KEYS = [
  "tiger",
  "dragon",
  "rooster",
  "fish",
  "crab",
  "elephant",
] as const;

type SixAnimalResultKey = (typeof VALID_SIX_ANIMAL_KEYS)[number];

type SixAnimalControlResponse = {
  success?: boolean;
  error?: string;
  action?: string;
  room_id?: string;
  pending_result_animals?: string[];
};

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function redirectWithAdminSixAnimalMessage(message: string): never {
  redirect(`/admin/six-animal?message=${encodeURIComponent(message)}`);
}

function redirectWithAdminSixAnimalError(message: string): never {
  redirect(`/admin/six-animal?error=${encodeURIComponent(message)}`);
}

function isSixAnimalResultKey(value: string): value is SixAnimalResultKey {
  return VALID_SIX_ANIMAL_KEYS.includes(value as SixAnimalResultKey);
}

export async function setSixAnimalNextResult(formData: FormData) {
  const resultAnimals = [
    getFormString(formData, "result1"),
    getFormString(formData, "result2"),
    getFormString(formData, "result3"),
  ];

  if (
    resultAnimals.length !== 3 ||
    resultAnimals.some((animal) => !isSixAnimalResultKey(animal))
  ) {
    redirectWithAdminSixAnimalError("Invalid Six Animal result selection.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "admin_set_six_animal_next_result",
    {
      p_room_id: SIX_ANIMAL_ROOM_UUID,
      p_result_animals: resultAnimals,
    }
  );

  if (error) {
    console.error("Six Animal set next result RPC error:", error.message);
    redirectWithAdminSixAnimalError("Could not set next Six Animal result.");
  }

  const response = data as SixAnimalControlResponse | null;

  if (!response?.success) {
    console.error("Six Animal set next result rejected:", response?.error);
    redirectWithAdminSixAnimalError(
      response?.error || "Set next Six Animal result failed."
    );
  }

  redirectWithAdminSixAnimalMessage("Next Six Animal result has been set.");
}

export async function clearSixAnimalNextResult() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "admin_clear_six_animal_next_result",
    {
      p_room_id: SIX_ANIMAL_ROOM_UUID,
    }
  );

  if (error) {
    console.error("Six Animal clear next result RPC error:", error.message);
    redirectWithAdminSixAnimalError("Could not clear next Six Animal result.");
  }

  const response = data as SixAnimalControlResponse | null;

  if (!response?.success) {
    console.error("Six Animal clear next result rejected:", response?.error);
    redirectWithAdminSixAnimalError(
      response?.error || "Clear next Six Animal result failed."
    );
  }

  redirectWithAdminSixAnimalMessage("Next Six Animal result has been cleared.");
}