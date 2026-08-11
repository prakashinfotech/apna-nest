import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell, Trash2, Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Saved Searches' }

const SAVED_SEARCHES = [
  { id: 1, name: '3BHK in Bopal', query: '/search?type=buy&bhk=3&q=Bopal', filters: ['Buy', '3 BHK', 'Bopal', '₹50L–₹1Cr'], alertsOn: true, newMatches: 5, lastUpdated: '2 hours ago' },
  { id: 2, name: 'Rental in Bangalore IT', query: '/search?type=rent&q=Whitefield', filters: ['Rent', 'Whitefield', 'Under ₹30K'], alertsOn: true, newMatches: 12, lastUpdated: '1 day ago' },
  { id: 3, name: 'Villa above 2Cr', query: '/search?type=buy&propertyType=villa', filters: ['Buy', 'Villa', '₹2Cr+'], alertsOn: false, newMatches: 0, lastUpdated: '3 days ago' },
]

export default function SearchesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Saved Searches</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Get instant alerts when new properties match your criteria</p>
        </div>
        <Link href="/search"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:border-[var(--primary-500)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <Search className="w-4 h-4" />
          New Search
        </Link>
      </div>

      <div className="space-y-3">
        {SAVED_SEARCHES.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</h3>
                    {s.newMatches > 0 && (
                      <Badge style={{ background: 'var(--primary-500)' }} className="text-white text-xs">
                        {s.newMatches} new
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.filters.map((f) => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-full border border-border" style={{ color: 'var(--text-secondary)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Last updated {s.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div className="relative w-9 h-5 rounded-full transition-colors" style={{ background: s.alertsOn ? 'var(--primary-500)' : 'var(--border)' }}>
                      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                        style={{ transform: s.alertsOn ? 'translateX(16px)' : 'translateX(2px)' }} />
                    </div>
                    Alerts
                  </label>
                  <Link href={s.query}
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-[var(--primary-500)] transition-colors">
                    <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </Link>
                  <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-red-400 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <Link href={s.query}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: 'var(--primary-600)' }}>
                <Search className="w-3.5 h-3.5" />
                View {s.newMatches > 0 ? `${s.newMatches} new` : ''} results
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {SAVED_SEARCHES.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No saved searches</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Save a search to get instant alerts when matching properties are listed.</p>
            <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold" style={{ background: 'var(--primary-500)' }}>
              Start Searching
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
