"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepShell } from "@/components/form/StepShell";
import { useProposal } from "@/components/form/ProposalContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { scopeSchema } from "@/lib/schemas/proposal";
import { SERVICE_LABELS, type ServiceType } from "@/lib/types";
import { Globe, Cpu, Bot, LayoutGrid, Database, Wrench, Sparkles, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

const SERVICE_ICONS: Record<ServiceType, typeof Globe> = {
  website: Globe,
  ml_model: Cpu,
  ai_agent: Bot,
  system_design: LayoutGrid,
  scraping: Database,
  website_fix: Wrench,
  custom: Sparkles,
};

export default function ScopeStep() {
  const { draft, update } = useProposal();
  const router = useRouter();
  const [featureInput, setFeatureInput] = useState("");

  const features = draft.features ?? [];

  function addFeature() {
    const trimmed = featureInput.trim();
    if (!trimmed || features.length >= 15) return;
    update({ features: [...features, trimmed] });
    setFeatureInput("");
  }

  function removeFeature(i: number) {
    update({ features: features.filter((_, idx) => idx !== i) });
  }

  function handleNext() {
    const result = scopeSchema.safeParse({
      service_type: draft.service_type,
      title: draft.title,
      description: draft.description,
      features,
    });
    if (!result.success) {
      const first = result.error.issues[0];
      toast.error(first.message);
      return;
    }
    router.push("/propose/timeline");
  }

  return (
    <StepShell
      eyebrow="01 / Scope"
      title={<>What are we <span className="italic">building</span>?</>}
      subtitle="Pick a service, give it a name, tell us what it has to do."
    >
      {/* Service picker */}
      <div className="space-y-3">
        <Label>Service</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => {
            const Icon = SERVICE_ICONS[s];
            const active = draft.service_type === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => update({ service_type: s })}
                className={`group flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  active
                    ? "border-foreground/60 bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                <span className="text-sm">{SERVICE_LABELS[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Project name</Label>
        <Input
          id="title"
          value={draft.title ?? ""}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g. Acme marketing site rebuild"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">What does it need to do?</Label>
        <Textarea
          id="description"
          rows={6}
          value={draft.description ?? ""}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Tell us about the goal, audience, and any constraints. The more, the better."
        />
        <div className="text-[10px] text-muted-foreground/60 font-mono">
          {(draft.description ?? "").length} / 2000
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Key features (optional)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {features.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs"
            >
              {f}
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="Press Enter to add (auth, dashboard, payments…)"
          />
          <Button type="button" variant="outline" onClick={addFeature}>
            Add
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleNext} className="group">
          Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </StepShell>
  );
}
