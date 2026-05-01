"use client";

import { useTransition } from "react";
import { updateProjectStatus } from "@/app/admin/actions";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ALL: ProjectStatus[] = [
  "pending",
  "negotiating",
  "accepted",
  "in_progress",
  "review",
  "completed",
  "cancelled",
];

export function StatusSelect({
  projectId,
  current,
}: {
  projectId: string;
  current: ProjectStatus;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="relative inline-flex items-center">
      <select
        defaultValue={current}
        disabled={pending}
        onChange={(e) => {
          const s = e.target.value as ProjectStatus;
          start(async () => {
            const r = await updateProjectStatus(projectId, s);
            if (r.error) toast.error(r.error);
            else toast.success(`Status → ${STATUS_LABELS[s]}`);
          });
        }}
        className="appearance-none pr-10 pl-4 h-10 rounded-full border border-white/15 bg-white/[0.04] text-sm focus:border-white/30 focus:outline-none cursor-pointer"
      >
        {ALL.map((s) => (
          <option key={s} value={s} className="bg-background">
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 text-muted-foreground">
        {pending ? <Loader2 className="size-3 animate-spin" /> : "▾"}
      </div>
    </div>
  );
}
