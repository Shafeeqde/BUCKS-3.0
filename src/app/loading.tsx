
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

      {/* Main Content Skeleton - Generic for most list/card based views */}
      <div className="flex-grow overflow-hidden p-4 space-y-4">
        {/* Title Skeleton */}
        <Skeleton className="w-1/2 h-10 rounded mb-6 sm:w-1/3" />

        {/* Search/Filter Bar Skeleton (common in JobBoard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
        </div>


        {/* Card List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg shadow-sm p-4 border border-border">
              <div className="flex items-start space-x-4 mb-3">
                <Skeleton className="w-16 h-16 rounded-md shrink-0" /> {/* For Logo/Avatar */}
                <div className="flex-grow space-y-2">
                  <Skeleton className="w-3/4 h-6 rounded" /> {/* Title */}
                  <Skeleton className="w-1/2 h-4 rounded" /> {/* Subtitle/Company */}
                  <Skeleton className="w-1/3 h-4 rounded" /> {/* Location/Date */}
                </div>
                 <Skeleton className="w-20 h-8 rounded-md shrink-0" /> {/* Button */}
              </div>
              <Skeleton className="w-full h-4 rounded mb-2" /> {/* Description line 1 */}
              <Skeleton className="w-5/6 h-4 rounded mb-3" /> {/* Description line 2 */}
              <div className="flex items-center space-x-2">
                <Skeleton className="w-16 h-5 rounded-full" /> {/* Badge */}
                <Skeleton className="w-20 h-5 rounded-full" /> {/* Badge */}
              </div>
               <div className="flex justify-end mt-3 border-t pt-3">
                  <Skeleton className="w-24 h-4 rounded" /> {/* Footer Text */}
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
