"use server";

import { createClient } from "@/lib/supabase/server";
import { proposalSchema, type ProposalDraft } from "@/lib/schemas/proposal";
import { sendProjectAlert } from "@/lib/notifications/sendProjectAlert";
import type { ServiceType } from "@/lib/types";

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

  // Send alert email directly — no internal HTTP hop. Visible in Vercel logs.
  console.log(`[notify] sending project alert · projectId=${project.id} · admin=${process.env.ADMIN_EMAIL}`);
  try {
    const result = await sendProjectAlert({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        service_type: project.service_type as ServiceType,
        budget_min: Number(project.budget_min ?? 0),
        budget_max: Number(project.budget_max ?? 0),
        timeline_weeks: project.timeline_weeks ?? 0,
        preferred_contact: project.preferred_contact ?? "",
      },
      contact: d.contact_value,
      clientName: profile?.full_name,
    });
    console.log(`[notify] result`, result);
  } catch (e) {
    console.error("[notify] failed", e);
    // Don't block the user — project was saved, alert just failed.
  }

  return { success: true, projectId: project.id };
}
