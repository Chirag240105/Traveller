import React from 'react'

type SkeletonLoaderProps = {
  count?: number
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => {
  const items = Array.from({ length: count })

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/60 p-1 shadow-2xl"
        >
          {/* Card Image Shimmer */}
          <div className="relative h-72 w-full animate-pulse bg-slate-900" />

          {/* Card Info Shimmer */}
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 w-36 animate-pulse rounded-lg bg-slate-900" />
                <div className="h-3.5 w-24 animate-pulse rounded-lg bg-slate-900" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-5 w-16 animate-pulse rounded-lg bg-slate-900" />
                <div className="h-3 w-10 animate-pulse rounded-lg bg-slate-900" />
              </div>
            </div>
            
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-slate-900" />
              <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-900" />
            </div>

            {/* Bottom Info Shimmer */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-3.5 w-10 animate-pulse rounded bg-slate-900" />
              <div className="h-3.5 w-16 animate-pulse rounded bg-slate-900" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader
