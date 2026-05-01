"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="p-8 md:p-12">
        <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-3">
          {eyebrow}
        </div>
        <h1 className="text-3xl md:text-5xl font-display tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-xl">
            {subtitle}
          </p>
        )}
        <div className="mt-10 space-y-6">{children}</div>
      </Card>
    </motion.div>
  );
}
