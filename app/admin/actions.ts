"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@/lib/types";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return { supabase, userId: user.id };
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: true };
}

export async function updateAgreedPrice(projectId: string, price: number) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("projects")
    .update({ agreed_price: price })
    .eq("id", projectId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: true };
}

export async function addTask(projectId: string, title: string) {
  const { supabase } = await assertAdmin();
  const { data: max } = await supabase
    .from("project_tasks")
    .select("position")
    .eq("project_id", projectId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (max?.position ?? -1) + 1;

  const { error } = await supabase
    .from("project_tasks")
    .insert({ project_id: projectId, title, position });
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: true };
}

export async function updateTaskStatus(taskId: string, status: "todo" | "doing" | "done") {
  const { supabase } = await assertAdmin();
  const { data, error } = await supabase
    .from("project_tasks")
    .update({ status })
    .eq("id", taskId)
    .select("project_id")
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${data.project_id}`);
  return { ok: true };
}

export async function deleteTask(taskId: string) {
  const { supabase } = await assertAdmin();
  const { data, error } = await supabase
    .from("project_tasks")
    .delete()
    .eq("id", taskId)
    .select("project_id")
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${data.project_id}`);
  return { ok: true };
}

export async function addPayment(projectId: string, amount: number, note: string, clientId: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase
    .from("payments")
    .insert({ project_id: projectId, client_id: clientId, amount, note });
  if (error) return { error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: true };
}
