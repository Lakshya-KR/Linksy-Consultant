import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/[0.04] text-foreground",
        outline: "border-white/15 text-muted-foreground",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
        info:
          "border-sky-500/30 bg-sky-500/10 text-sky-300",
        muted: "border-white/10 bg-white/[0.02] text-muted-foreground",
        solid: "border-transparent bg-foreground text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
