import React from "react";
import { Card } from "src/components/ui/card";
import { CardContent } from "src/components/ui/card";
import { Skeleton } from "src/components/ui/skeleton";

export default function PriceCardSkeleton() {
  return (
    <Card
      className="relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-700 dark:bg-gradient-to-br dark:from-zinc-950/50 dark:to-zinc-900/80"
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="flex flex-col items-center border-b border-zinc-200 dark:border-zinc-700 pb-6">
          {/* Plan Name */}
          <Skeleton className="mb-6 h-5 w-16" />

          {/* Price */}
          <Skeleton className="mb-3 h-12 w-20" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4 py-9">
          {/* Feature items */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Icon placeholder */}
              <Skeleton className="h-5 w-5 rounded-full" />
              {/* Feature text */}
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
