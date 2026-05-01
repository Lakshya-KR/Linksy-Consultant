"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addPayment } from "@/app/admin/actions";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

export function PaymentForm({
  projectId,
  clientId,
}: {
  projectId: string;
  clientId: string;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    start(async () => {
      const r = await addPayment(projectId, n, note, clientId);
      if (r.error) toast.error(r.error);
      else {
        toast.success("Payment logged");
        setAmount(""); setNote("");
      }
    });
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (INR)"
        className="w-40"
      />
      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (e.g. milestone 1, kickoff)"
        className="flex-1 min-w-40"
      />
      <Button onClick={submit} disabled={pending} variant="secondary">
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        Log payment
      </Button>
    </div>
  );
}
