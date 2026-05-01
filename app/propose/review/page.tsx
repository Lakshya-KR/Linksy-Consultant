"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { StepShell } from "@/components/form/StepShell";
import { useProposal } from "@/components/form/ProposalContext";
import { Button } from "@/components/ui/button";
import { proposalSchema, type ProposalDraft } from "@/lib/schemas/proposal";
import { SERVICE_LABELS, type ServiceType, type ContactMethod } from "@/lib/types";
import { ArrowLeft, Send, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { submitProposal } from "../actions";
import { formatCurrency } from "@/lib/utils";

const CONTACT_LABELS: Record<ContactMethod, string> = {
  whatsapp: "WhatsApp",
  call: "Call",
  meeting: "Meeting",
  email: "Email",
};

export default function ReviewStep() {
  const { draft, reset } = useProposal();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const parsed = proposalSchema.safeParse(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const res = await submitProposal(parsed.data as ProposalDraft);
    if (res.error) {
      toast.error(res.error);
      setSubmitting(false);
      return;
    }
    reset();
    toast.success("Proposal sent. We'll be in touch within 24h.");
    router.push("/dashboard");
  }

  const rows: Array<[string, React.ReactNode]> = [
    ["Service", SERVICE_LABELS[draft.service_type as ServiceType] ?? "—"],
    ["Project", draft.title || "—"],
    ["Timeline", draft.timeline_weeks ? `${draft.timeline_weeks} weeks` : "—"],
    ["Start", draft.start_date || "—"],
    ["Budget", `${formatCurrency(draft.budget_min ?? 0)} – ${formatCurrency(draft.budget_max ?? 0)}`],
    ["Contact", `${CONTACT_LABELS[draft.preferred_contact as ContactMethod] ?? "—"} · ${draft.contact_value ?? "—"}`],
  ];

  return (
    <StepShell
      eyebrow="04 / Review"
      title={<>Looks <span className="italic">right</span>?</>}
      subtitle="One last look. We'll get an email the moment you submit, and reply on your preferred channel."
    >
      {/* Summary */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 p-4 md:p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="col-span-2 text-sm">{v}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      {draft.description && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 md:p-5 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Brief</div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{draft.description}</p>
          {(draft.features?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {draft.features!.map((f) => (
                <span key={f} className="text-[11px] rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* What happens next */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 md:p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Check className="size-4 text-emerald-400" /> What happens after you submit
        </div>
        <ol className="text-xs text-muted-foreground space-y-1.5 pl-6 list-decimal">
          <li>Admin gets an email with one-tap reply buttons instantly.</li>
          <li>We reply on your preferred channel within 24 hours.</li>
          <li>You can track progress live on your dashboard.</li>
        </ol>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4">
        <Button asChild variant="ghost" size="lg">
          <Link href="/propose/budget"><ArrowLeft className="size-4" /> Back</Link>
        </Button>
        <Button size="lg" onClick={handleSubmit} disabled={submitting} className="group">
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {submitting ? "Sending…" : "Submit & notify admin"}
        </Button>
      </div>
    </StepShell>
  );
}
