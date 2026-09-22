import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, MapPin, Home } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CITIES } from '@/lib/constants'
import { getLocalities } from '@/services/locality-service'

export const metadata: Metadata = {
  title: 'Top Localities in India',
  description: 'Explore top localities for buying and renting property in India. Price trends, infrastructure, and lifestyle insights.',
}

export default async function LocalitiesPage() {
  const localities = await getLocalities()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-10 lg:py-14" style={{ background: 'var(--primary-50)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>Neighbourhood Intelligence</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Explore Localities</h1>
            <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Deep insights on India&apos;s most sought-after neighbourhoods — price trends, amenities, connectivity, and more.
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
          {/* City filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
            {['All Cities', ...CITIES.slice(0, 8)].map((city, i) => (
              <button key={city}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors"
                style={i === 0 ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' } : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {city}
              </button>
            ))}
          </div>

          {/* Localities grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {localities.map((locality) => (
              <Link key={locality.id} href={`/localities/${locality.slug}`} className="group">
                <article className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-52 overflow-hidden bg-muted">
                    <Image src={locality.image} alt={locality.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-white font-serif font-bold text-xl">{locality.name}</h2>
                      <p className="text-white/75 text-sm flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {locality.city}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--success)' }}>
                      <TrendingUp className="w-3 h-3" />
                      {locality.growth}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>{locality.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)' }}>
                        <div className="text-lg font-serif font-bold price-num" style={{ color: 'var(--text-primary)' }}>₹{locality.avgPrice.toLocaleString('en-IN')}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Avg /sq.ft</div>
                      </div>
                      <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)' }}>
                        <div className="text-lg font-serif font-bold" style={{ color: 'var(--text-primary)' }}>{locality.properties}+</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Listings</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {locality.highlights.slice(0, 3).map((h) => (
                        <span key={h} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>{h}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
