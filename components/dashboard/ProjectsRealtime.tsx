"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "./StatusBadge";
import {
  SERVICE_LABELS,
  type Project,
  type ProjectTask,
  type ServiceType,
} from "@/lib/types";
import { timeAgo, formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Calendar, ListChecks } from "lucide-react";

interface Props {
  initialProjects: Project[];
  tasksByProject: Record<string, ProjectTask[]>;
  userId: string;
}

export function ProjectsRealtime({ initialProjects, tasksByProject, userId }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(tasksByProject);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("client-projects")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `client_id=eq.${userId}`,
        },
        (payload) => {
          setProjects((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as Project, ...prev];
            if (payload.eventType === "UPDATE")
              return prev.map((p) => (p.id === (payload.new as Project).id ? (payload.new as Project) : p));
            if (payload.eventType === "DELETE")
              return prev.filter((p) => p.id !== (payload.old as Project).id);
            return prev;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_tasks",
        },
        (payload) => {
          const projId = (payload.new as ProjectTask)?.project_id || (payload.old as ProjectTask)?.project_id;
          if (!projId) return;
          setTasks((prev) => {
            const next = { ...prev };
            const list = [...(next[projId] || [])];
            if (payload.eventType === "INSERT") list.push(payload.new as ProjectTask);
            if (payload.eventType === "UPDATE") {
              const i = list.findIndex((t) => t.id === (payload.new as ProjectTask).id);
              if (i >= 0) list[i] = payload.new as ProjectTask;
            }
            if (payload.eventType === "DELETE") {
              const idx = list.findIndex((t) => t.id === (payload.old as ProjectTask).id);
              if (idx >= 0) list.splice(idx, 1);
            }
            next[projId] = list;
            return next;
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
        <p className="text-muted-foreground">No active projects yet.</p>
        <Link
          href="/propose"
          className="inline-flex items-center gap-1 mt-4 text-sm text-foreground hover:underline"
        >
          Submit your first proposal <ArrowUpRight className="size-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((p) => {
        const t = tasks[p.id] || [];
        const done = t.filter((x) => x.status === "done").length;
        const pct = t.length === 0 ? 0 : Math.round((done / t.length) * 100);
        return (
          <div
            key={p.id}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all p-5 md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  {SERVICE_LABELS[p.service_type as ServiceType]}
                </div>
                <h3 className="text-lg md:text-xl font-semibold tracking-tight truncate">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>

            {/* Task progress */}
            {t.length > 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1.5"><ListChecks className="size-3" /> Tasks</span>
                  <span>{done} / {t.length}</span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Calendar className="size-3" /> {p.timeline_weeks ?? "—"}w</span>
                {p.agreed_price && (
                  <span className="font-mono">{formatCurrency(Number(p.agreed_price))}</span>
                )}
              </div>
              <span>Updated {timeAgo(p.updated_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
