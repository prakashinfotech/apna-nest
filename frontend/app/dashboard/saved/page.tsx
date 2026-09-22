'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Loader2 } from 'lucide-react'
import { PropertyCard } from '@/components/property-card'
import { getLikedProperties } from '@/services/property-service'
import { type Property } from '@/lib/types'

export default function SavedPage() {
  const [saved, setSaved] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLikedProperties()
      .then(setSaved)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--primary-500)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Liked Properties</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{saved.length} properties liked</p>
      </div>

      {saved.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {saved.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No liked properties</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Like properties you're interested in by tapping the heart icon on any listing.
          </p>
          <Link href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
            style={{ background: 'var(--primary-500)' }}>
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  )
}
