'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Eye, MessageCircle, Edit2, Trash2, TrendingUp, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getMyProperties } from '@/services/property-service'
import type { Property } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

type Listing = Property & { enquiries: number; daysLeft: number | null; listingStatus: string }

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = () => {
    setLoading(true)
    getMyProperties()
      .then((data) => {
        setListings(
          data.map((p, i) => ({
            ...p,
            listingStatus: p.isActive ? 'active' : 'pending',
            enquiries: 0,
            daysLeft: 30,
          }))
        )
      })
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      const { deleteProperty } = await import('@/services/property-service')
      await deleteProperty(id)
      fetchListings()
    } catch (err) {
      alert('Failed to delete property')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--primary-500)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Listings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{listings.length} properties listed</p>
        </div>
        <Link
          href="/post-property"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'var(--secondary-500)' }}
        >
          <PlusCircle className="w-4 h-4" />
          Add Listing
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', value: listings.filter((l) => l.listingStatus === 'active').length, color: 'var(--success)' },
          { label: 'Pending Review', value: listings.filter((l) => l.listingStatus === 'pending').length, color: 'var(--warning)' },
          { label: 'Expired', value: listings.filter((l) => l.listingStatus === 'expired').length, color: 'var(--text-tertiary)' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-serif font-bold" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-44 h-36 sm:h-auto shrink-0">
                  <Image
                    src={listing.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: listing.listingStatus === 'active' ? '#DCFCE7' : listing.listingStatus === 'pending' ? '#FEF3C7' : '#F5F5F4',
                        color: listing.listingStatus === 'active' ? '#16A34A' : listing.listingStatus === 'pending' ? '#D97706' : 'var(--text-tertiary)',
                      }}
                    >
                      {listing.listingStatus === 'active' ? '● Active' : listing.listingStatus === 'pending' ? '◐ Pending' : '○ Expired'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-serif font-semibold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {listing.title}
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {listing.localityName}, {listing.cityName}
                      </p>
                      <div className="text-lg font-serif font-bold mt-1 price-num" style={{ color: 'var(--text-primary)' }}>
                        {formatPrice(listing.price, listing.listingIntentId === 2 ? 'rent' : 'buy')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/property/${listing.id}`} title="View"
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-[var(--primary-500)] transition-colors">
                        <Eye className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      </Link>
                      <Link href={`/post-property?edit=${listing.id}`} title="Edit"
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-[var(--primary-500)] transition-colors">
                        <Edit2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      </Link>
                      <button 
                        title="Delete"
                        onClick={() => handleDelete(listing.id)}
                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-red-400 transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {(listing.views ?? 0).toLocaleString('en-IN')} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {listing.enquiries} enquiries
                    </span>
                    {listing.daysLeft !== null && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {listing.daysLeft} days remaining
                      </span>
                    )}
                    {listing.isReraVerified && (
                      <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

