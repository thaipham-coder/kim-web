import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Search + column toggle */}
      <div className="flex items-center py-4 gap-x-4">
        <Skeleton className="h-10 w-72 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full ml-auto" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-100 p-3 flex gap-4">
          {[80, 120, 160, 100, 100, 100, 100, 40].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-3 flex gap-4 border-t">
            {[80, 120, 160, 100, 100, 100, 100, 40].map((w, j) => (
              <Skeleton key={j} className="h-5" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center py-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
