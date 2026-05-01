import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { PriceEditor } from "@/components/admin/PriceEditor";
import { TaskBoard } from "@/components/admin/TaskBoard";
import { PaymentForm } from "@/components/admin/PaymentForm";
import {
  SERVICE_LABELS,
  type Project,
  type ProjectTask,
  type Payment,
  type Profile,
  type ScopeDetails,
  type ServiceType,
} from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, MessageCircle, Phone, Mail } from "lucide-react";

export default async function AdminProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, profile:profiles!projects_client_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const [{ data: tasks }, { data: payments }] = await Promise.all([
    supabase.from("project_tasks").select("*").eq("project_id", id).order("position"),
    supabase.from("payments").select("*").eq("project_id", id).order("paid_at", { ascending: false }),
  ]);

  const p = project as Project & { profile: Profile };
  const scope = (p.scope_details as ScopeDetails | null) ?? null;

  const phoneClean = (p.profile?.whatsapp_number || p.profile?.phone || "").replace(/[^\d]/g, "");
  const waLink = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hi ${p.profile.full_name}, regarding your project "${p.title}"…`)}` : "#";

  return (
    <div className="space-y-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-3.5" /> Inbox
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {SERVICE_LABELS[p.service_type as ServiceType]}
          </div>
          <span className="text-muted-foreground">·</span>
          <StatusBadge status={p.status} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display tracking-tight leading-tight">
          {p.title}
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left — main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Brief */}
          <Card className="p-6 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Brief</div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.description}</p>
            {scope?.features && scope.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {scope.features.map((f, i) => (
                  <span key={i} className="text-[11px] rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Tasks */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Tasks</div>
              <div className="text-[10px] text-muted-foreground">
                {(tasks ?? []).filter((t) => t.status === "done").length} / {(tasks ?? []).length} done
              </div>
            </div>
            <TaskBoard projectId={p.id} initial={(tasks ?? []) as ProjectTask[]} />
          </Card>

          {/* Payments */}
          <Card className="p-6 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Payments</div>
            <PaymentForm projectId={p.id} clientId={p.client_id} />
            {(payments ?? []).length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                {(payments as Payment[]).map((pay) => (
                  <div key={pay.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <div className="font-mono">{formatCurrency(Number(pay.amount))}</div>
                      {pay.note && <div className="text-xs text-muted-foreground">{pay.note}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDate(pay.paid_at)}</div>
                  </div>
                ))}
                <div className="pt-3 mt-2 border-t border-white/5 flex justify-between text-sm">
                  <span className="text-muted-foreground">Total received</span>
                  <span className="font-mono font-medium">
                    {formatCurrency((payments as Payment[]).reduce((s, p) => s + Number(p.amount), 0))}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right — controls */}
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Status</div>
            <StatusSelect projectId={p.id} current={p.status} />
          </Card>

          <Card className="p-6 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Pricing</div>
            <div className="text-xs text-muted-foreground">
              Range: {formatCurrency(Number(p.budget_min ?? 0))} – {formatCurrency(Number(p.budget_max ?? 0))}
            </div>
            <PriceEditor projectId={p.id} initial={p.agreed_price ? Number(p.agreed_price) : null} />
          </Card>

          <Card className="p-6 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Client</div>
            <div>
              <div className="font-medium">{p.profile.full_name}</div>
              <div className="text-xs text-muted-foreground">{p.profile.email}</div>
              {p.profile.whatsapp_number && (
                <div className="text-xs text-muted-foreground font-mono">{p.profile.whatsapp_number}</div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-colors text-[10px] uppercase tracking-wider font-mono text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="size-3.5" /> WhatsApp
              </a>
              <a
                href={phoneClean ? `tel:+${phoneClean}` : "#"}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-colors text-[10px] uppercase tracking-wider font-mono text-muted-foreground hover:text-foreground"
              >
                <Phone className="size-3.5" /> Call
              </a>
              <a
                href={`mailto:${p.profile.email}`}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-colors text-[10px] uppercase tracking-wider font-mono text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-3.5" /> Email
              </a>
            </div>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Brief facts</div>
            <div className="text-sm flex justify-between"><span className="text-muted-foreground">Timeline</span><span>{p.timeline_weeks ?? "—"}w</span></div>
            <div className="text-sm flex justify-between"><span className="text-muted-foreground">Start</span><span>{p.start_date ? formatDate(p.start_date) : "—"}</span></div>
            <div className="text-sm flex justify-between"><span className="text-muted-foreground">Created</span><span>{formatDate(p.created_at)}</span></div>
            <div className="text-sm flex justify-between"><span className="text-muted-foreground">Updated</span><span>{formatDate(p.updated_at)}</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
