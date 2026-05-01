import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.04]",
        "before:absolute before:inset-0 before:animate-skeleton-sweep",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent",
        className
      )}
      {...props}
    />
  );
}
