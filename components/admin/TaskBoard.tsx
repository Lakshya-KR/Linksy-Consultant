"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addTask, updateTaskStatus, deleteTask } from "@/app/admin/actions";
import type { ProjectTask } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NEXT: Record<ProjectTask["status"], ProjectTask["status"]> = {
  todo: "doing",
  doing: "done",
  done: "todo",
};

const COLORS: Record<ProjectTask["status"], string> = {
  todo: "border-white/15 text-muted-foreground",
  doing: "border-amber-500/40 text-amber-300 bg-amber-500/5",
  done: "border-emerald-500/40 text-emerald-300 bg-emerald-500/5",
};

export function TaskBoard({
  projectId,
  initial,
}: {
  projectId: string;
  initial: ProjectTask[];
}) {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");
  const [pending, start] = useTransition();

  function add() {
    const t = title.trim();
    if (!t) return;
    start(async () => {
      const r = await addTask(projectId, t);
      if (r.error) toast.error(r.error);
      else {
        setTitle("");
        // optimistic add
        setTasks((prev) => [
          ...prev,
          {
            id: `optimistic-${Date.now()}`,
            project_id: projectId,
            title: t,
            description: null,
            status: "todo",
            position: prev.length,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    });
  }

  function cycle(t: ProjectTask) {
    const next = NEXT[t.status];
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    start(async () => {
      const r = await updateTaskStatus(t.id, next);
      if (r.error) toast.error(r.error);
    });
  }

  function remove(t: ProjectTask) {
    setTasks((prev) => prev.filter((x) => x.id !== t.id));
    start(async () => {
      const r = await deleteTask(t.id);
      if (r.error) toast.error(r.error);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="New task title…"
        />
        <Button onClick={add} disabled={pending || !title.trim()}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
          Add
        </Button>
      </div>
      <div className="space-y-1.5">
        {tasks.length === 0 && (
          <div className="text-sm text-muted-foreground p-3">No tasks yet.</div>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <button
              onClick={() => cycle(t)}
              className={cn(
                "shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer",
                COLORS[t.status]
              )}
            >
              {t.status}
            </button>
            <span className={cn("flex-1 text-sm", t.status === "done" && "text-muted-foreground line-through")}>
              {t.title}
            </span>
            <button
              onClick={() => remove(t)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
