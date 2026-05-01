import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminProjectDetailLoading() {
  return (
    <div className="space-y-10">
      <Skeleton className="h-4 w-20" />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-12 md:h-16 w-3/4" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 space-y-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1 rounded-xl" />
              <Skeleton className="h-11 w-20 rounded-full" />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3"
              >
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </Card>
        </div>
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-full rounded-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
