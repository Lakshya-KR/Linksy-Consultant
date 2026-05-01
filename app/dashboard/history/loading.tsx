import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HistoryLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-72" />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-6 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-32" />
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden p-0">
        <div className="p-5 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
