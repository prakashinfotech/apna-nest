'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Bed, Bath, Maximize2, Shield, Tag, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, cn } from '@/lib/utils'
import { api } from '@/lib/api'
import type { Property } from '@/lib/types'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/stores/auth-store'

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'list'
}

export function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  const [saved, setSaved] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [pulse, setPulse] = useState(false)
  const { user } = useAuthStore()
  const isOwner = user?.id === property.ownerId

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isOwner) return

    const next = !saved
    setSaved(next)
    setPulse(true)
    setTimeout(() => setPulse(false), 400)

    try {
      if (next) {
        await api.post(`/properties/${property.id}/save`, {})
        toast.success('Added to Liked Properties')
      } else {
        await api.delete(`/properties/${property.id}/save`)
        toast.success('Removed from Liked Properties')
      }
    } catch {
      setSaved(!next) // revert on error
      if (!localStorage.getItem('apnanest_token')) {
        toast.error('Login to like properties')
        useAuthStore.getState().openLogin()
      }
    }
  }

  if (variant === 'list') {
    return (
      <Link href={`/property/${property.id}`} className="block group">
        <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="relative w-full sm:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={imgError ? '' : (property.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80')}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 224px"
              onError={() => setImgError(true)}
            />
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center img-fallback">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{property.propertyTypeName}</p>
                </div>
              </div>
            )}
            {!isOwner && (
              <button
                onClick={handleSave}
                className={cn(
                  'absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition shadow',
                  saved ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white',
                  pulse && 'heart-animate'
                )}
                aria-label={saved ? 'Unlike property' : 'Like property'}
              >
                <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif font-bold price-num" style={{ color: 'var(--text-primary)' }}>
                    {formatPrice(property.price, property.listingIntentId === 2 ? 'rent' : 'buy')}
                  </span>
                </div>
                {property.listingIntentId === 1 && (
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    ₹{Math.round(property.price / property.areaSqft).toLocaleString('en-IN')}/sq.ft
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {property.isVerified && (
                  <Badge variant="verified" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {property.isZeroBrokerage && (
                  <Badge variant="zero" className="gap-1">
                    <Tag className="h-3 w-3" />
                    Zero Brokerage
                  </Badge>
                )}
              </div>
            </div>

            <h3 className="font-serif font-semibold text-lg mt-2 line-clamp-1" style={{ color: 'var(--text-primary)' }}>
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{property.localityName}, {property.cityName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
              {property.bhk && property.bhk > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  {property.bhk} BHK
                </span>
              )}
              {property.bathrooms && property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" />
                  {property.bathrooms}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                {property.areaSqft.toLocaleString('en-IN')} sq.ft
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>Active</span>
              <div className="flex items-center gap-3">
                <span>{new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <article className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imgError ? '' : (property.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80')}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center img-fallback">
              <div className="text-center">
                <div className="text-5xl mb-2">🏠</div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{property.propertyTypeName}</p>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {property.isVerified && (
              <Badge variant="verified" className="gap-1 shadow-sm">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {property.isReraVerified && (
              <Badge className="gap-1 bg-blue-600 text-white shadow-sm text-[10px] px-1.5">
                RERA
              </Badge>
            )}
          </div>

          {property.isZeroBrokerage && (
            <Badge variant="zero" className="absolute bottom-3 left-3 gap-1 shadow-sm">
              <Tag className="h-3 w-3" />
              Zero Brokerage
            </Badge>
          )}

          {!isOwner && (
            <button
              onClick={handleSave}
              className={cn(
                'absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition shadow-md',
                saved ? 'bg-red-500 text-white scale-110' : 'bg-white/90 hover:bg-white',
                pulse && 'heart-animate'
              )}
              aria-label={saved ? 'Unlike property' : 'Like property'}
            >
              <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
            </button>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="text-2xl font-serif font-bold price-num" style={{ color: 'var(--text-primary)' }}>
                {formatPrice(property.price, property.listingIntentId === 2 ? 'rent' : 'buy')}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">
              {property.propertyTypeName}
            </Badge>
          </div>
          {property.listingIntentId === 1 && (
            <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
              ₹{Math.round(property.price / property.areaSqft).toLocaleString('en-IN')}/sq.ft
            </div>
          )}

          <h3 className="font-serif font-semibold text-base line-clamp-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs mt-1 mb-3" style={{ color: 'var(--text-secondary)' }}>
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{property.localityName}, {property.cityName}</span>
          </div>

          <div className="flex items-center gap-3 pb-3 border-b border-border text-xs" style={{ color: 'var(--text-secondary)' }}>
            {property.bhk && property.bhk > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {property.bhk} BHK
              </span>
            )}
            {property.bathrooms && property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {property.areaSqft.toLocaleString('en-IN')} sq.ft
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: 'var(--primary-500)' }}
              >
                {property.owner.name.charAt(0)}
              </div>
              <span className="truncate max-w-[100px]" style={{ color: 'var(--text-secondary)' }}>
                {property.owner.name}
              </span>
            </div>
            <span className="flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
              <Eye className="h-3 w-3" />
              0
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
