import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
