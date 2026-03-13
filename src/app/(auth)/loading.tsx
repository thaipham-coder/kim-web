import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-[400px] w-full max-w-md rounded-xl" />
    </div>
  );
}
