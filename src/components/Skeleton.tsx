export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonRow({ columns = 3 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-16 shrink-0" />
      ))}
    </div>
  )
}

export function SkeletonStatRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-sm border border-line bg-surface py-3 pl-4 pr-3">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="mt-2.5 h-6 w-10" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonPanel({ rows = 4, columns = 3 }: { rows?: number; columns?: number }) {
  return (
    <div className="panel overflow-hidden">
      <div className="divide-y divide-line">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} columns={columns} />
        ))}
      </div>
    </div>
  )
}
