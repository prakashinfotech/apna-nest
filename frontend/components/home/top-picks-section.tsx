import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProperties } from '@/services/property-service'
import { PropertyCard } from '@/components/property-card'
import type { Property } from '@/lib/types'

export async function TopPicksSection() {
  const featured = await getFeaturedProperties()

  return (
    <section className="py-14 lg:py-20" style={{ background: 'var(--background)' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>
              Hand-Picked for You
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Featured Properties
            </h2>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              Verified listings curated by our team across top cities
            </p>
          </div>
          <Link
            href="/search?type=buy&featured=true"
            className="hidden md:flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--primary-600)' }}
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((property, i) => (
            <div key={property.id} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
            style={{ background: 'var(--primary-500)' }}
          >
            Browse All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
