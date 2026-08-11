import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, MapPin, Home, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PropertyCard } from '@/components/property-card'
import { Badge } from '@/components/ui/badge'
import { LOCALITIES, getLocalityBySlug } from '@/lib/constants'
import { searchProperties } from '@/services/property-service'
import { getLocalityBySlug as getLocalityFromApi } from '@/services/locality-service'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return LOCALITIES.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const loc = getLocalityBySlug(slug)
  if (!loc) return { title: 'Locality Not Found' }
  return {
    title: `Properties in ${loc.name}, ${loc.city}`,
    description: `Buy and rent properties in ${loc.name}, ${loc.city}. Avg price: ₹${loc.avgPrice.toLocaleString('en-IN')}/sq.ft. ${loc.properties}+ listings available.`,
  }
}

export default async function LocalityPage({ params }: Props) {
  const { slug } = await params
  // Try API first, fall back to local data
  const locality = (await getLocalityFromApi(slug)) ?? getLocalityBySlug(slug)
  if (!locality) notFound()

  const [localityProperties, allCityProperties] = await Promise.all([
    searchProperties({ q: locality.name, pageSize: 6 }),
    searchProperties({ city: locality.city, pageSize: 3 }),
  ])
  // Remove locality-specific results from "other areas" list
  const otherAreaProperties = allCityProperties
    .filter((p) => p.localityName?.toLowerCase() !== locality.name.toLowerCase())
    .slice(0, 3)

  const priceData = [
    { year: '2021', price: Math.round(locality.avgPrice * 0.75) },
    { year: '2022', price: Math.round(locality.avgPrice * 0.83) },
    { year: '2023', price: Math.round(locality.avgPrice * 0.91) },
    { year: '2024', price: Math.round(locality.avgPrice * 0.96) },
    { year: '2025', price: Math.round(locality.avgPrice * 0.99) },
    { year: '2026', price: locality.avgPrice },
  ]
  const maxPrice = Math.max(...priceData.map((d) => d.price))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-3">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <Link href="/localities" className="hover:text-[var(--primary-500)]">Localities</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/search?city=${locality.city}`} className="hover:text-[var(--primary-500)]">{locality.city}</Link>
              <ChevronRight className="h-3 w-3" />
              <span style={{ color: 'var(--text-primary)' }}>{locality.name}</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="relative h-72 lg:h-96">
          <Image src={locality.image} alt={locality.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-[1280px] mx-auto px-4 lg:px-6 pb-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                    <MapPin className="w-3 h-3" />
                    {locality.city}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                    <TrendingUp className="w-3 h-3" />
                    {locality.growth} this year
                  </span>
                </div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white">{locality.name}</h1>
              </div>
              <Link href={`/search?q=${locality.name}`}
                className="px-5 py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'var(--secondary-500)', color: 'white' }}>
                View All Properties
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Avg Price', value: `₹${locality.avgPrice.toLocaleString('en-IN')}/sq.ft`, icon: Home },
                  { label: 'YoY Growth', value: locality.growth, icon: TrendingUp, green: true },
                  { label: 'Active Listings', value: `${locality.properties}+`, icon: Home },
                  { label: 'Avg Rent', value: locality.avgRent ? `₹${locality.avgRent.toLocaleString('en-IN')}/mo` : 'N/A', icon: Home },
                ].map(({ label, value, green }) => (
                  <div key={label} className="p-4 rounded-2xl border border-border bg-card text-center">
                    <div className="text-xl font-serif font-bold price-num" style={{ color: green ? 'var(--success)' : 'var(--text-primary)' }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div>
                <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>About {locality.name}</h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{locality.description}</p>
              </div>

              {/* Price trend */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary-500)' }} />
                  Price Trend (₹/sq.ft)
                </h2>
                <div className="flex items-end gap-3 h-32">
                  {priceData.map((d) => (
                    <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>₹{(d.price / 1000).toFixed(1)}K</div>
                      <div className="w-full rounded-t-md transition-all"
                        style={{ height: `${(d.price / maxPrice) * 100}%`, background: d.year === '2026' ? 'var(--primary-500)' : 'var(--primary-200)' }} />
                      <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{d.year}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Properties */}
              {localityProperties.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
                    Properties in {locality.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {localityProperties.map((p) => (
                      <PropertyCard key={p.id} property={p} />
                    ))}
                  </div>
                  <Link href={`/search?q=${locality.name}`}
                    className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                    style={{ background: 'var(--primary-500)' }}>
                    View All {locality.properties}+ Properties
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Highlights */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Why {locality.name}?</h3>
                <div className="space-y-2">
                  {locality.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--primary-50)' }}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--primary-500)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick search */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Search in {locality.name}</h3>
                <div className="space-y-2">
                  {['Buy Apartments', 'Rent Apartments', 'Villas for Sale', 'Plots for Sale'].map((action) => {
                    const type = action.includes('Rent') ? 'rent' : 'buy'
                    const pType = action.includes('Villa') ? '&propertyType=villa' : action.includes('Plot') ? '&propertyType=plot' : ''
                    return (
                      <Link key={action} href={`/search?type=${type}${pType}&q=${locality.name}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors text-sm"
                        style={{ color: 'var(--text-secondary)' }}>
                        <Home className="w-4 h-4" style={{ color: 'var(--primary-500)' }} />
                        {action} in {locality.name}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Nearby localities */}
              {otherAreaProperties.length > 0 && (
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Other Areas in {locality.city}</h3>
                  <div className="space-y-3">
                    {otherAreaProperties.map((p) => (
                      <Link key={p.id} href={`/property/${p.id}`} className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                          <Image src={p.images[0]} alt={p.localityName} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{p.localityName}</p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>₹{Math.round(p.price / p.areaSqft).toLocaleString('en-IN')}/sq.ft</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
