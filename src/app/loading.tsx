import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-card shadow-sm p-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center">
          <Skeleton className="w-6 h-6 mr-4 rounded" />
          <Skeleton className="w-20 h-8 rounded" />
        </div>
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-grow overflow-hidden p-4 space-y-4">
        <Skeleton className="w-1/3 h-8 rounded mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg shadow-sm p-4 border border-border">
              <div className="flex items-center mb-3">
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-grow space-y-1">
                  <Skeleton className="w-1/2 h-4 rounded" />
                  <Skeleton className="w-1/3 h-3 rounded" />
                </div>
              </div>
              <Skeleton className="w-full h-4 rounded mb-2" />
              <Skeleton className="w-3/4 h-4 rounded mb-3" />
              <Skeleton className="w-full h-48 rounded-lg mb-3" />
              <div className="flex items-center space-x-4 text-sm mb-3">
                <Skeleton className="w-12 h-4 rounded" />
                <Skeleton className="w-12 h-4 rounded" />
                <Skeleton className="w-12 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="bg-card border-t border-border p-2 flex justify-around items-center sticky bottom-0 z-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center p-2 w-1/5 space-y-1">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-12 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
