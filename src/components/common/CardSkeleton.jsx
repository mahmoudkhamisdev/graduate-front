import { Skeleton } from "../ui/skeleton";

export const CardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className={"w-full h-40 rounded-xl"} />
    <Skeleton className={"w-1/2 h-5 rounded-xl"} />

    <div className="flex items-center gap-4 justify-between">
      <Skeleton className={"w-1/5 h-5 rounded-xl"} />
      <Skeleton className={"w-1/4 h-8 rounded-xl"} />
    </div>
  </div>
);
