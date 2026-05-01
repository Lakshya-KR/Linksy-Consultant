"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const full_name = String(formData.get("full_name"));
  const phone = String(formData.get("phone") || "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone, whatsapp_number: phone },
    },
  });

  if (error) return { error: error.message };

  // If a session was returned, the user is logged in immediately (email confirmation off)
  if (data.session) {
    redirect("/dashboard");
  }

  // Otherwise, Supabase requires email confirmation — surface this to the UI
  return {
    needsConfirmation: true,
    email,
  };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const next = String(formData.get("next") || "/dashboard");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
