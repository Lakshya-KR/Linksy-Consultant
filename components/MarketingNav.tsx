"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";
import type { Profile } from "@/lib/types";

interface Props {
  session: { profile?: Profile | null } | null;
}

export function MarketingNav({ session }: Props) {
  const { scrollY } = useScroll();

  // Direction signal (-1 = up, 1 = down) tracked as a motion value, NOT React state.
  // Updating React state on every scroll tick causes re-renders → jitter.
  const direction = useMotionValue(-1);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    direction.set(latest > prev ? 1 : -1);
  });

  // Combine scroll position + direction into a single "hide amount" 0 → 1.
  // 0 = fully visible, 1 = fully hidden.
  // Visible at top (<80px). Hides when scrolling down past 80px. Returns when scrolling up.
  const hideAmount = useTransform([scrollY, direction], (values) => {
    const [y, d] = values as [number, number];
    if (y < 80) return 0;
    if (d > 0) return Math.min(1, (y - 80) / 200);
    return 0;
  });

  // Smooth that single signal once.
  const smooth = useSpring(hideAmount, {
    stiffness: 220,
    damping: 32,
    mass: 0.5,
  });

  // Derive every visual property from the same smoothed signal.
  // No blur — it's the #1 scroll-jank source on Windows.
  const scale = useTransform(smooth, [0, 1], [1, 0.85]);
  const opacity = useTransform(smooth, [0, 0.7, 1], [1, 0.4, 0]);
  const y = useTransform(smooth, [0, 1], [0, -40]);

  return (
    <motion.header
      style={{
        scale,
        opacity,
        y,
        transformOrigin: "50% 0%",
        willChange: "transform, opacity",
      }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav className="mx-auto max-w-7xl px-6 py-5 md:px-10 flex items-center justify-between">
        <Link href="/" className="z-10">
          <Brand size="md" />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground absolute left-1/2 -translate-x-1/2">
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
          <a href="#process" className="hover:text-foreground transition-colors">Process</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-2 z-10">
          {session ? (
            <Button asChild size="sm">
              <Link href={session.profile?.role === "admin" ? "/admin" : "/dashboard"}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Start a project</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
