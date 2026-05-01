import Link from "next/link";
import { getSession, createClient } from "@/lib/supabase/server";
import { ProjectsRealtime } from "@/components/dashboard/ProjectsRealtime";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Project, ProjectTask } from "@/lib/types";

export default async function DashboardPage() {
  const session = await getSession();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", session!.user.id)
    .neq("status", "completed")
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  const ids = (projects ?? []).map((p) => p.id);
  let tasks: ProjectTask[] = [];
  if (ids.length) {
    const { data: t } = await supabase
      .from("project_tasks")
      .select("*")
      .in("project_id", ids);
    tasks = t ?? [];
  }

  const tasksByProject: Record<string, ProjectTask[]> = {};
  for (const t of tasks) {
    (tasksByProject[t.project_id] ??= []).push(t);
  }

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Welcome back
          </div>
          <h1 className="text-4xl md:text-5xl font-display tracking-tight">
            {session?.profile?.full_name?.split(" ")[0] ?? "Friend"}.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s what&apos;s in motion right now.
          </p>
        </div>
        <Button asChild>
          <Link href="/propose">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      </div>

      <ProjectsRealtime
        initialProjects={(projects ?? []) as Project[]}
        tasksByProject={tasksByProject}
        userId={session!.user.id}
      />
    </div>
  );
}
