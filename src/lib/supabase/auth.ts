// src/lib/supabase/auth.ts
'use server'

import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function signInAnonymously(formData: FormData) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInAnonymously()

  if (error) {
    console.error('Error signing in anonymously:', error.message)
    throw new Error(error.message)
  }

  // Once signed in, redirect the player to the game room
  redirect('/six-animal')
}