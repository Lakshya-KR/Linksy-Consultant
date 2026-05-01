"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { StepShell } from "@/components/form/StepShell";
import { useProposal } from "@/components/form/ProposalContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { budgetSchema } from "@/lib/schemas/proposal";
import { type ContactMethod } from "@/lib/types";
import { ArrowRight, ArrowLeft, MessageCircle, Phone, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const CONTACT_OPTIONS: Array<{
  value: ContactMethod;
  label: string;
  icon: typeof MessageCircle;
  hint: string;
  placeholder: string;
}> = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, hint: "Fastest", placeholder: "+91 98765 43210" },
  { value: "call", label: "Call", icon: Phone, hint: "Decisive", placeholder: "+91 98765 43210" },
  { value: "meeting", label: "Meeting", icon: Calendar, hint: "Detailed", placeholder: "Email for invite" },
  { value: "email", label: "Email", icon: Mail, hint: "Async", placeholder: "you@company.com" },
];

export default function BudgetStep() {
  const { draft, update } = useProposal();
  const router = useRouter();

  const min = draft.budget_min ?? 30000;
  const max = draft.budget_max ?? 80000;

  function handleNext() {
    const parsed = budgetSchema.safeParse({
      budget_min: draft.budget_min,
      budget_max: draft.budget_max,
      preferred_contact: draft.preferred_contact,
      contact_value: draft.contact_value,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (max < min) {
      toast.error("Max budget must be ≥ min");
      return;
    }
    router.push("/propose/review");
  }

  const selected = CONTACT_OPTIONS.find((o) => o.value === draft.preferred_contact);

  return (
    <StepShell
      eyebrow="03 / Budget & contact"
      title={<>What&apos;s the <span className="italic">range</span>?</>}
      subtitle="A real number — even a wide range — saves us both time. Negotiable."
    >
      {/* Budget range */}
      <div className="space-y-5">
        <Label>Budget range (INR)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Min</div>
            <div className="font-display text-2xl tracking-tight">{formatCurrency(min)}</div>
            <input
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={min}
              onChange={(e) => update({ budget_min: parseInt(e.target.value) })}
              className="w-full mt-3 h-1 rounded-full appearance-none bg-white/10 accent-white cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
            />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Max</div>
            <div className="font-display text-2xl tracking-tight">{formatCurrency(max)}</div>
            <input
              type="range"
              min={5000}
              max={2000000}
              step={5000}
              value={max}
              onChange={(e) => update({ budget_max: parseInt(e.target.value) })}
              className="w-full mt-3 h-1 rounded-full appearance-none bg-white/10 accent-white cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          We&apos;ll send a fixed-price quote within your range, or come back with a counter-offer.
        </p>
      </div>

      {/* Contact method */}
      <div className="space-y-3">
        <Label>Preferred way to reach you</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CONTACT_OPTIONS.map(({ value, label, icon: Icon, hint }) => {
            const active = draft.preferred_contact === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => update({ preferred_contact: value })}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  active
                    ? "border-foreground/60 bg-white/[0.05]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <Icon className="size-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact value */}
      <div className="space-y-2">
        <Label htmlFor="contact_value">
          {selected?.label === "Email" ? "Email address" : selected?.label === "Meeting" ? "Email (for invite)" : "Phone number"}
        </Label>
        <Input
          id="contact_value"
          value={draft.contact_value ?? ""}
          onChange={(e) => update({ contact_value: e.target.value })}
          placeholder={selected?.placeholder ?? ""}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4">
        <Button asChild variant="ghost" size="lg">
          <Link href="/propose/timeline"><ArrowLeft className="size-4" /> Back</Link>
        </Button>
        <Button size="lg" onClick={handleNext} className="group">
          Review <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </StepShell>
  );
}
