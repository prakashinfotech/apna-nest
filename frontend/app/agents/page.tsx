import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, Star, Shield, MapPin, Briefcase } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { AGENTS, CITIES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Find Real Estate Agents',
  description: 'Connect with verified and experienced real estate agents across India.',
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-10 lg:py-14" style={{ background: 'var(--primary-50)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>Verified Professionals</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Find an Agent</h1>
            <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Connect with trusted, verified real estate agents who know your neighbourhood.
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
          {/* City filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
            {['All Cities', ...CITIES.slice(0, 6)].map((city, i) => (
              <button key={city}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors"
                style={i === 0 ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' } : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {city}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AGENTS.map((agent) => (
              <article key={agent.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ background: 'var(--primary-500)' }}>
                    {agent.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold" style={{ color: 'var(--text-primary)' }}>{agent.name}</h3>
                      {agent.isVerified && (
                        <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--primary-500)' }} />
                      )}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{agent.agency}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--secondary-500)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{agent.rating}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({agent.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Experience', value: `${agent.experience} yrs` },
                    { label: 'Deals Closed', value: `${agent.dealsClosed}+` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)' }}>
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>SPECIALTIES</p>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.specialties.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>LOCALITIES</p>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.localities.map((l) => (
                      <span key={l} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                        <MapPin className="w-2.5 h-2.5" />
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:${agent.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--primary-500)' }}>
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a href={`mailto:${agent.email}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-border"
                    style={{ color: 'var(--text-secondary)' }}>
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
