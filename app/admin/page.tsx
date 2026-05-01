import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SERVICE_LABELS, type Project, type ServiceType, type Profile } from "@/lib/types";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { ArrowUpRight, Inbox } from "lucide-react";

export default async function AdminInbox() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("projects")
    .select("*, profile:profiles!projects_client_id_fkey(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: active } = await supabase
    .from("projects")
    .select("*, profile:profiles!projects_client_id_fkey(*)")
    .in("status", ["negotiating", "accepted", "in_progress", "review"])
    .order("updated_at", { ascending: false })
    .limit(8);

  return (
    <div className="space-y-12">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Inbox
        </div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight">
          New requests.
        </h1>
        <p className="mt-2 text-muted-foreground">
          {(pending ?? []).length} pending · {(active ?? []).length} active
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Inbox className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase tracking-widest font-mono text-muted-foreground">
            Pending
          </h2>
          <Badge variant="warning">{(pending ?? []).length}</Badge>
        </div>
        {(pending ?? []).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-muted-foreground text-sm">
            All caught up. ✦
          </div>
        ) : (
          <div className="space-y-3">
            {(pending as (Project & { profile: Profile })[]).map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="block group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      {SERVICE_LABELS[p.service_type as ServiceType]} · {p.profile?.full_name}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight truncate">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatCurrency(Number(p.budget_min ?? 0))} – {formatCurrency(Number(p.budget_max ?? 0))}</span>
                  <span>·</span>
                  <span>{p.timeline_weeks}w</span>
                  <span>·</span>
                  <span>{p.preferred_contact}</span>
                  <span className="ml-auto">{timeAgo(p.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {(active ?? []).length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium uppercase tracking-widest font-mono text-muted-foreground">
              Active
            </h2>
          </div>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-white/10">
                  <tr>
                    <th className="text-left py-3 px-5 font-normal">Project</th>
                    <th className="text-left py-3 px-5 font-normal">Client</th>
                    <th className="text-left py-3 px-5 font-normal">Status</th>
                    <th className="text-right py-3 px-5 font-normal">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(active as (Project & { profile: Profile })[]).map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5">
                        <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                          {p.title}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground">{p.profile?.full_name}</td>
                      <td className="py-4 px-5"><StatusBadge status={p.status} /></td>
                      <td className="py-4 px-5 text-right text-muted-foreground">{timeAgo(p.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
