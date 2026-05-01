import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-spotlight">
      <div className="text-center space-y-6 max-w-md">
        <div className="font-display text-8xl md:text-9xl tracking-tighter italic text-gradient leading-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl tracking-tight font-display">
            This page doesn&apos;t exist.
          </h1>
          <p className="text-sm text-muted-foreground">
            Either the URL is mistyped, or we never built it. Both are fixable.
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-3.5" /> Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              <Compass className="size-3.5" /> Start a project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
