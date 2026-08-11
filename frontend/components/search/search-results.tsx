'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Map, List, LayoutGrid, X, ChevronDown, Search, ArrowUpDown, Loader2 } from 'lucide-react'
import { PropertyCard } from '@/components/property-card'
import { FilterSidebar } from '@/components/search/filter-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/search/map-view').then(mod => mod.MapView), { ssr: false })
import { type Property } from '@/lib/types'
import { searchProperties } from '@/services/property-service'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'area-desc', label: 'Area: High to Low' },
]

const LISTING_TYPE_LABELS: Record<string, string> = { buy: 'Buy', rent: 'Rent', pg: 'PG' }

type FilterState = {
  type: string
  propertyType: string
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  bhk: number[]
  furnishing: string[]
  amenities: string[]
  ownerDirect: boolean
  verified: boolean
  zeroBrokerage: boolean
  facing: string[]
  status: string[]
}

const DEFAULT_FILTERS: FilterState = {
  type: 'buy', propertyType: '', minPrice: 0, maxPrice: 999999999,
  minArea: 0, maxArea: 999999, bhk: [], furnishing: [], amenities: [],
  ownerDirect: false, verified: false, zeroBrokerage: false, facing: [], status: [],
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list')
  const [sortBy, setSortBy] = useState('newest')
  const [showSort, setShowSort] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const PAGE_SIZE = 12
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    type: searchParams.get('type') || 'buy',
    propertyType: searchParams.get('propertyType') || '',
  })

  const updateFilter = (key: keyof FilterState, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Fetch from API, debounced on searchQuery changes
  const fetchProperties = useCallback(async (type: string, q: string, pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true)
    try {
      const data = await searchProperties({ type, q: q || undefined, pageSize: PAGE_SIZE, page: pageNum })
      setAllProperties(prev => append ? [...prev, ...data] : data)
      setHasMore(data.length === PAGE_SIZE) // If we got a full page, assume there's more
    } catch {
      if (!append) setAllProperties([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Sync URL search params to filter state when searchParams changes
  useEffect(() => {
    const urlType = searchParams.get('type') || 'buy'
    const urlPropType = searchParams.get('propertyType') || ''
    const urlQ = searchParams.get('q') || ''
    
    setFilters(prev => ({
      ...prev,
      type: urlType,
      propertyType: urlPropType
    }))
    setSearchQuery(urlQ)
  }, [searchParams])

  // Initial load + whenever type or debounced query changes — reset to page 1
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchProperties(filters.type, searchQuery, 1, false)
    }, searchQuery ? 400 : 0)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [filters.type, searchQuery, fetchProperties])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchProperties(filters.type, searchQuery, next, true)
  }

  const activeFilterCount = [
    filters.propertyType,
    filters.bhk.length > 0,
    filters.ownerDirect,
    filters.verified,
    filters.zeroBrokerage,
  ].filter(Boolean).length

  // Client-side filtering on top of API results (BHK, price, area, flags, furnishing)
  const filtered = useMemo(() => {
    let result = allProperties.filter((p) => {
      if (filters.propertyType && p.propertyTypeName.toLowerCase() !== filters.propertyType.toLowerCase()) return false
      if (filters.verified && !p.isReraVerified) return false
      if (filters.zeroBrokerage && !p.isZeroBrokerage) return false
      if (filters.ownerDirect && !p.isOwnerDirect) return false
      if (filters.bhk.length > 0 && p.bhk && !filters.bhk.includes(p.bhk)) return false
      if (filters.minPrice > 0 && p.price < filters.minPrice) return false
      if (filters.maxPrice < 999999999 && p.price > filters.maxPrice) return false
      if (filters.minArea > 0 && p.areaSqft < filters.minArea) return false
      // Furnishing filter — match against furnishing string on property
      if (filters.furnishing.length > 0) {
        const furnish = p.furnishing?.toLowerCase() ?? ''
        const matches = filters.furnishing.some(f => furnish.includes(f.toLowerCase()))
        if (!matches) return false
      }
      return true
    })

    if (sortBy === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === 'area-desc')  result = [...result].sort((a, b) => b.areaSqft - a.areaSqft)
    else if (sortBy === 'views')      result = [...result].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))

    return result
  }, [allProperties, filters, sortBy])

  const clearAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, type: filters.type })
    setSearchQuery('')  // Fix #6: also clear the search text
  }

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Sticky search toolbar */}
      <div
        className="sticky top-[72px] z-30 bg-white border-b border-border"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          {/* Type tabs */}
          <div className="flex gap-1 shrink-0">
            {['buy', 'rent', 'pg'].map((t) => (
              <button
                key={t}
                onClick={() => updateFilter('type', t)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors"
                style={
                  filters.type === t
                    ? { background: 'var(--primary-500)', color: 'white' }
                    : { color: 'var(--text-secondary)' }
                }
              >
                {LISTING_TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Locality, city or project..."
              className="w-full h-9 pl-9 pr-4 rounded-xl text-sm border border-border focus:outline-none focus:ring-2"
              style={{ background: 'var(--surface-2)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors hover:border-[var(--primary-500)] shrink-0"
            style={{
              borderColor: activeFilterCount > 0 ? 'var(--primary-500)' : 'var(--border)',
              color: activeFilterCount > 0 ? 'var(--primary-600)' : 'var(--text-secondary)',
              background: activeFilterCount > 0 ? 'var(--primary-50)' : 'white',
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: 'var(--primary-500)' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:border-[var(--primary-500)] transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden md:inline">{SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Sort'}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showSort && 'rotate-180')} />
            </button>
            {showSort && (
              <div
                className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-border p-1 z-50 min-w-[200px]"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false) }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={
                      sortBy === opt.value
                        ? { background: 'var(--primary-50)', color: 'var(--primary-600)' }
                        : { color: 'var(--text-secondary)' }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List/Grid/Map toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden shrink-0">
            {[
              { mode: 'list' as const, icon: List, label: 'List' },
              { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
              { mode: 'map' as const, icon: Map, label: 'Map' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors"
                style={viewMode === mode ? { background: 'var(--primary-500)', color: 'white' } : { color: 'var(--text-secondary)' }}
                title={`${label} view`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="max-w-[1280px] mx-auto px-4 pb-2 flex flex-wrap gap-2">
            {filters.propertyType && (
              <FilterChip label={filters.propertyType} onRemove={() => updateFilter('propertyType', '')} />
            )}
            {filters.bhk.map((b) => (
              <FilterChip key={b} label={`${b} BHK`} onRemove={() => updateFilter('bhk', filters.bhk.filter((x) => x !== b))} />
            ))}
            {filters.ownerDirect && <FilterChip label="Owner Direct" onRemove={() => updateFilter('ownerDirect', false)} />}
            {filters.verified && <FilterChip label="Verified" onRemove={() => updateFilter('verified', false)} />}
            {filters.zeroBrokerage && <FilterChip label="Zero Brokerage" onRemove={() => updateFilter('zeroBrokerage', false)} />}
            {activeFilterCount > 1 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6 flex gap-6">
        {/* Filter Sidebar — Desktop */}
        <div className="hidden lg:block shrink-0 w-72">
          <div className="sticky top-40">
            <FilterSidebar filters={filters} onChange={updateFilter} />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar filters={filters} onChange={updateFilter} />
              </div>
              <div className="shrink-0 p-4 bg-white border-t border-border">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 rounded-xl text-white font-semibold"
                  style={{ background: 'var(--primary-500)' }}
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                  Showing {Math.min(1, filtered.length)}-{filtered.length} of {filtered.length} properties
                </p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  for {LISTING_TYPE_LABELS[filters.type]} in India
                  {searchQuery && ` · "${searchQuery}"`}
                </p>
              </div>
            </div>

          {/* Map view */}
          {viewMode === 'map' && (
            <div className="mb-6">
              <MapView properties={filtered} />
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
                viewMode === 'grid' ? (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border bg-card">
                    <Skeleton className="w-56 h-36 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && filtered.length === 0 ? (
            <EmptyState onClear={clearAllFilters} />
          ) : !loading && (
            <>
              <div className={
                viewMode === 'grid' || viewMode === 'map'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filtered.map((property, i) => (
                  <div key={property.id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <PropertyCard property={property} variant={viewMode === 'list' ? 'list' : 'grid'} />
                  </div>
                ))}
              </div>
              
              {/* Fix #8: Real pagination - Load More */}
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 font-semibold transition-all"
                    style={{
                      borderColor: 'var(--primary-500)',
                      color: 'var(--primary-600)',
                      opacity: loadingMore ? 0.7 : 1,
                    }}
                  >
                    {loadingMore ? (
                      <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Loading…</>
                    ) : (
                      'Load More Properties'
                    )}
                  </button>
                </div>
              )}
              {!hasMore && filtered.length > 0 && (
                <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Showing all {filtered.length} matching properties
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', borderColor: 'var(--primary-200)' }}
    >
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-[var(--primary-900)]" aria-label="Remove filter">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-border">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        No properties match your search
      </h3>
      <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
        We couldn't find any results for your current filters. Try removing some filters or searching in a different area.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onClear}
          className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'var(--primary-500)' }}
        >
          Clear all filters
        </button>
        <button
          className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-slate-50 transition-all"
        >
          Post a Requirement
        </button>
      </div>
    </div>
  )
}
