import { Skeleton } from '@/components/ui/skeleton'

export default function SearchLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 flex gap-6">
      <div className="hidden lg:block w-72 shrink-0">
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
