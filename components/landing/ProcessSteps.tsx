"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    n: "01",
    title: "Brief",
    desc: "You walk through a four-step proposal. Scope, timeline, budget, contact. Three minutes.",
  },
  {
    n: "02",
    title: "Reply",
    desc: "We message you within 24 hours — WhatsApp, email, or phone — to align on scope and price.",
  },
  {
    n: "03",
    title: "Build",
    desc: "Your dashboard goes live. Status updates, task progress, and a chat thread with the studio.",
  },
  {
    n: "04",
    title: "Ship",
    desc: "We deploy. You launch. We stay on call for the first weeks and beyond.",
  },
];

export default function ProcessSteps() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 0.5,
  });

  const lineHeight = useTransform(smoothProgress, [0.05, 0.95], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {/* Static rail (faint) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] md:-translate-x-1/2" />
        {/* Animated rail (draws in on scroll) */}
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-4 md:left-1/2 top-0 w-px bg-gradient-to-b from-foreground/60 via-foreground/30 to-transparent md:-translate-x-1/2 origin-top"
        />

        <div className="space-y-16 md:space-y-24">
          {steps.map((s, i) => (
            <ProcessStep key={s.n} step={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: { n: string; title: string; desc: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 30%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const dotScale = useTransform(smooth, [0, 1], [0.5, 1.4]);
  const dotGlow = useTransform(smooth, [0, 1], [0, 1]);
  const opacity = useTransform(smooth, [0, 0.5, 1], [0.3, 0.8, 1]);
  const x = useTransform(
    smooth,
    [0, 1],
    [index % 2 === 0 ? -30 : 30, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="relative grid md:grid-cols-2 gap-6 md:gap-16 items-start pl-12 md:pl-0"
    >
      {/* Number badge */}
      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-0 z-10">
        <motion.div
          style={{ scale: dotScale }}
          className="w-10 h-10 rounded-full bg-background border border-white/20 flex items-center justify-center font-mono text-[10px] text-muted-foreground relative"
        >
          {step.n}
          <motion.div
            style={{ opacity: dotGlow }}
            className="absolute inset-0 rounded-full bg-foreground/10 blur-md -z-10"
          />
        </motion.div>
      </div>
      {/* Content */}
      <motion.div
        style={{ x }}
        className={
          index % 2 === 0
            ? "md:pr-16 md:text-right"
            : "md:order-2 md:pl-16"
        }
      >
        <h3 className="text-2xl md:text-4xl font-display tracking-tight">
          {step.title}
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">{step.desc}</p>
      </motion.div>
      <div
        className={
          index % 2 === 0 ? "md:pl-16" : "md:order-1 md:pr-16 md:text-right"
        }
      />
    </motion.div>
  );
}
