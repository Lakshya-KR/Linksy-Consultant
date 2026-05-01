"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-spotlight">
      <div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
          <AlertTriangle className="size-6 text-destructive" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl tracking-tight font-display">
            Something went sideways
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve logged the error. Try the page again — most things resolve on a second go.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/50 pt-1">
              ref: {error.digest}
            </p>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-3.5" /> Home
            </Link>
          </Button>
          <Button onClick={reset}>
            <RefreshCw className="size-3.5" /> Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
