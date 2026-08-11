import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { getLocalities } from '@/services/locality-service'

export async function LocalitiesSection() {
  const localities = await getLocalities()
  return (
    <section className="py-14 lg:py-20" style={{ background: 'var(--surface-2)' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>
              Explore Neighbourhoods
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Top Localities
            </h2>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              Detailed insights on India&apos;s most sought-after neighbourhoods
            </p>
          </div>
          <Link
            href="/localities"
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--primary-600)' }}
          >
            All Localities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {localities.map((locality, i) => (
            <Link
              key={locality.id}
              href={`/localities/${locality.slug}`}
              className="group block"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <article className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-44 overflow-hidden bg-muted">
                  <Image
                    src={locality.image}
                    alt={locality.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-serif font-bold text-lg leading-none">{locality.name}</h3>
                    <p className="text-white/80 text-sm">{locality.city}</p>
                  </div>
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--success)' }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {locality.growth}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Avg Price</div>
                      <div className="text-lg font-bold font-serif price-num" style={{ color: 'var(--text-primary)' }}>
                        ₹{locality.avgPrice.toLocaleString('en-IN')}/sq.ft
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Listings</div>
                      <div className="text-lg font-bold font-serif" style={{ color: 'var(--text-primary)' }}>
                        {locality.properties}+
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {locality.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
