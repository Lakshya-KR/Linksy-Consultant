"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [pending, setPending] = useState(false);

  async function handle(formData: FormData) {
    setPending(true);
    const res = await signIn(formData);
    if (res?.error) {
      toast.error(res.error);
      setPending(false);
    }
  }

  return (
    <form action={handle} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl tracking-tight font-display">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to track your projects and message your studio lead.
          </p>
        </div>
        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>
        <p className="text-sm text-muted-foreground text-center">
          New here?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
