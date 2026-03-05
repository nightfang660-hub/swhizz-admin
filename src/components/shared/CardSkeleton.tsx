import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20 rounded" />
      <Skeleton className="h-3 w-32 rounded" />
      <Skeleton className="h-8 w-full rounded" />
    </div>
  );
}
