"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { StepShell } from "@/components/form/StepShell";
import { useProposal } from "@/components/form/ProposalContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { timelineSchema } from "@/lib/schemas/proposal";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function TimelineStep() {
  const { draft, update } = useProposal();
  const router = useRouter();

  const weeks = draft.timeline_weeks ?? 8;

  function handleNext() {
    const result = timelineSchema.safeParse({
      timeline_weeks: draft.timeline_weeks,
      start_date: draft.start_date,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    router.push("/propose/budget");
  }

  return (
    <StepShell
      eyebrow="02 / Timeline"
      title={<>How <span className="italic">soon</span>?</>}
      subtitle="Be honest. Realistic timelines ship better products."
    >
      {/* Weeks slider */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <Label>Estimated build time</Label>
          <div className="font-display text-4xl tracking-tight">
            {weeks}
            <span className="text-muted-foreground text-base ml-1.5">
              {weeks === 1 ? "week" : "weeks"}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={26}
          step={1}
          value={weeks}
          onChange={(e) => update({ timeline_weeks: parseInt(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-white cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground
            [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,0.1)]
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:border-0"
        />
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          <span>1 wk · sprint</span>
          <span>13 wk · standard</span>
          <span>26 wk · ambitious</span>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="start_date">Preferred start date</Label>
        <Input
          id="start_date"
          type="date"
          value={draft.start_date ?? ""}
          onChange={(e) => update({ start_date: e.target.value })}
          className="[color-scheme:dark]"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4">
        <Button asChild variant="ghost" size="lg">
          <Link href="/propose/scope"><ArrowLeft className="size-4" /> Back</Link>
        </Button>
        <Button size="lg" onClick={handleNext} className="group">
          Continue <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </StepShell>
  );
}
