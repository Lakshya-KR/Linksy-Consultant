"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "../actions";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

export default function SignupPage() {
  const [pending, setPending] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  async function handle(formData: FormData) {
    setPending(true);
    const res = await signUp(formData);
    setPending(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    if (res?.needsConfirmation && res.email) {
      setConfirmEmail(res.email);
    }
  }

  if (confirmEmail) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <MailCheck className="size-6 text-emerald-300" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl tracking-tight font-display">
              Check your inbox
            </h1>
            <p className="text-sm text-muted-foreground">
              We sent a confirmation link to{" "}
              <span className="text-foreground font-medium">{confirmEmail}</span>.
              Click the link to finish signing in.
            </p>
          </div>
          <p className="text-xs text-muted-foreground/70 pt-2">
            Wrong email or didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setConfirmEmail(null)}
              className="text-foreground hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl tracking-tight font-display">Start a project</h1>
          <p className="text-sm text-muted-foreground">
            One account. Track every build, every conversation, every milestone.
          </p>
        </div>
        <form action={handle} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp number (with country code)</Label>
            <Input id="phone" name="phone" placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Create account
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center">
          Already have one?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
