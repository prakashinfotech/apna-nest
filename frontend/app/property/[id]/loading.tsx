import { Skeleton } from '@/components/ui/skeleton'

export default function PropertyLoading() {
  return (
    <div>
      <Skeleton className="h-[440px] w-full rounded-none" />
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
