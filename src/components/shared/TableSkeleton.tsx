import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card">
      <div className="p-4 border-b border-border">
        <Skeleton className="h-9 w-64 rounded-lg" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            {Array.from({ length: cols - 1 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
