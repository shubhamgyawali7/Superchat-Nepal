import React from "react";
import { Skeleton, SkeletonTable, SkeletonCard } from "@/components/common/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1550px] mx-auto animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1] dark:border-[#222736]">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] p-5 rounded-2xl space-y-3"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] p-5 rounded-2xl space-y-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
