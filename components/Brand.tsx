import { cn } from "@/lib/utils";

const SIZES = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-5xl md:text-7xl",
} as const;

interface BrandProps {
  className?: string;
  size?: keyof typeof SIZES;
  /** Show "Studio" suffix. Default true. */
  suffix?: boolean;
  /** Force suffix on a new line (for stacked / mark-style usage). */
  stacked?: boolean;
}

export function Brand({
  className,
  size = "md",
  suffix = true,
  stacked = false,
}: BrandProps) {
  return (
    <span
      className={cn(
        "font-display tracking-tight inline-flex items-baseline gap-1.5 leading-none select-none",
        stacked && "flex-col items-start gap-0",
        SIZES[size],
        className
      )}
    >
      <span className="text-shine italic">Linksy</span>
      {suffix && (
        <span
          className={cn(
            "not-italic font-normal text-muted-foreground/70",
            stacked
              ? "text-[10px] uppercase tracking-[0.3em] mt-1"
              : "text-[0.6em]"
          )}
        >
          Studio
        </span>
      )}
    </span>
  );
}
