import React from "react";
import { Skeleton, SkeletonTable, SkeletonCard } from "@/components/common/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-48" />
        </div>
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Links Row Skeleton */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 border border-orange-500/10 p-6 rounded-2xl space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6">
          <SkeletonTable rows={5} columns={4} />
        </div>
      </div>
    </div>
  );
}
