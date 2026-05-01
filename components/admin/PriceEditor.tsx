"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAgreedPrice } from "@/app/admin/actions";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

export function PriceEditor({
  projectId,
  initial,
}: {
  projectId: string;
  initial: number | null;
}) {
  const [v, setV] = useState(initial?.toString() ?? "");
  const [pending, start] = useTransition();

  function save() {
    const num = parseFloat(v);
    if (Number.isNaN(num) || num < 0) {
      toast.error("Enter a valid amount");
      return;
    }
    start(async () => {
      const r = await updateAgreedPrice(projectId, num);
      if (r.error) toast.error(r.error);
      else toast.success("Price updated");
    });
  }

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        value={v}
        placeholder="Agreed price (INR)"
        onChange={(e) => setV(e.target.value)}
      />
      <Button onClick={save} disabled={pending} variant="secondary">
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
        Save
      </Button>
    </div>
  );
}
