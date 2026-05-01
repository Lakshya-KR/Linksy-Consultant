"use server";

import { createClient } from "@/lib/supabase/server";
import { proposalSchema, type ProposalDraft } from "@/lib/schemas/proposal";
import { getSiteUrl } from "@/lib/utils";

export async function submitProposal(draft: ProposalDraft) {
  const parsed = proposalSchema.safeParse(draft);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // If contact_value was a phone, sync to profile.whatsapp_number for convenience
  if (d.preferred_contact === "whatsapp" || d.preferred_contact === "call") {
    await supabase
      .from("profiles")
      .update({ whatsapp_number: d.contact_value, phone: d.contact_value })
      .eq("id", user.id);
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      client_id: user.id,
      title: d.title,
      description: d.description,
      service_type: d.service_type,
      scope_details: { features: d.features },
      timeline_weeks: d.timeline_weeks,
      start_date: d.start_date,
      budget_min: d.budget_min,
      budget_max: d.budget_max,
      preferred_contact: d.preferred_contact,
      status: "pending",
    })
    .select("id, title, description, service_type, budget_min, budget_max, timeline_weeks, preferred_contact")
    .single();

  if (error || !project) return { error: error?.message || "Failed to submit" };

  // Fire-and-forget notifications. Don't block user if they fail.
  try {
    await fetch(`${getSiteUrl()}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project,
        contact: d.contact_value,
        clientName: profile?.full_name,
      }),
    });
  } catch (e) {
    console.error("Notify dispatch failed", e);
  }

  return { success: true, projectId: project.id };
}
