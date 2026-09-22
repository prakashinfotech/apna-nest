import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Users, Home, TrendingUp, Heart, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'About ApnaNest',
  description: 'Learn about ApnaNest — India\'s most trusted real estate platform with verified listings and zero brokerage options.',
}

const TEAM = [
  { name: 'Arjun Patel', role: 'Co-founder & CEO', desc: 'Former Goldman Sachs banker turned PropTech entrepreneur. IIT Bombay + Wharton.', initials: 'AP' },
  { name: 'Priya Nair', role: 'Co-founder & CTO', desc: 'Built search infra at Google India for 6 years. Deep expertise in large-scale property data.', initials: 'PN' },
  { name: 'Ravi Sharma', role: 'Head of Partnerships', desc: 'Real estate veteran with 15+ years experience across Mumbai and NCR markets.', initials: 'RS' },
  { name: 'Aditi Mehta', role: 'Head of Product', desc: 'Previously led mobile product at MagicBricks. Passionate about making home search delightful.', initials: 'AM' },
]

const VALUES = [
  { icon: Shield, title: 'Verified First', desc: 'Every listing goes through our 5-point verification process before going live — RERA, ownership, location, pricing, and photos.', color: 'var(--primary-500)', bg: 'var(--primary-50)' },
  { icon: Heart, title: 'Owner-Centric', desc: 'We built this platform for property owners who are tired of paying 2% brokerage. Post for free, reach millions, sell on your terms.', color: '#EF4444', bg: '#FEF2F2' },
  { icon: Users, title: 'Community Driven', desc: 'Hyperlocal insights, honest reviews, and neighbourhood data curated by real residents — not scraped from unreliable sources.', color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: Zap, title: 'Tech Obsessed', desc: 'AI-powered search, instant price alerts, and a seamless mobile experience built by engineers who\'ve bought and rented homes in India.', color: 'var(--secondary-500)', bg: 'var(--secondary-50)' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-16 lg:py-24" style={{ background: 'var(--primary-900)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 text-center">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              We&apos;re fixing<br /><span style={{ color: 'var(--primary-500)' }}>Indian real estate.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ApnaNest was born from a simple frustration: why should buying or renting a home in India require paying ₹1–2 lakhs to a broker who adds zero value? We built the platform we wished had existed when we were looking for homes.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="py-12 bg-white border-b border-border">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50,000+', label: 'Active Listings', icon: Home },
                { value: '2M+', label: 'Monthly Searches', icon: TrendingUp },
                { value: '98%', label: 'Verified Properties', icon: Shield },
                { value: '₹0', label: 'Brokerage Charged', icon: Heart },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label}>
                  <div className="text-3xl lg:text-4xl font-serif font-bold mb-1" style={{ color: 'var(--primary-500)' }}>{value}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="py-14 lg:py-20" style={{ background: 'var(--surface-2)' }}>
          <div className="max-w-[800px] mx-auto px-4 lg:px-6">
            <h2 className="font-serif text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>In 2023, our co-founders were looking for a 2BHK in Bangalore. Between them, they paid ₹1.4 lakhs in brokerage across three failed deals before finally signing a lease — through a common friend who happened to know the owner.</p>
              <p>They asked themselves: why does every Indian who rents or buys a home have to go through this? The broker rarely adds value, the listings are often outdated, and the pricing is opaque.</p>
              <p>So they built ApnaNest — starting with a simple WhatsApp group for owners in HSR Layout, Bangalore. Within six months, they had 400+ listings across five cities. Today, we&apos;re the fastest-growing real estate platform in India by listings quality.</p>
              <p>Our mission is simple: make finding your next home as easy and transparent as ordering food online. No brokers, no outdated listings, no information asymmetry.</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-14 lg:py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <h2 className="font-serif text-3xl font-bold mb-10 text-center" style={{ color: 'var(--text-primary)' }}>What We Stand For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex gap-5 p-6 rounded-2xl border border-border">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="py-14 lg:py-20" style={{ background: 'var(--surface-2)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <h2 className="font-serif text-3xl font-bold mb-10 text-center" style={{ color: 'var(--text-primary)' }}>Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="p-6 rounded-2xl border border-border bg-card text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white" style={{ background: 'var(--primary-500)' }}>
                    {member.initials}
                  </div>
                  <h3 className="font-serif font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: 'var(--primary-600)' }}>{member.role}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-14 bg-white text-center">
          <div className="max-w-[600px] mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Join the movement</h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Whether you&apos;re buying, renting, or selling — ApnaNest is the smarter way to do Indian real estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/search" className="px-8 py-4 rounded-xl text-white font-semibold text-base" style={{ background: 'var(--primary-500)' }}>
                Browse Properties
              </Link>
              <Link href="/post-property" className="px-8 py-4 rounded-xl font-semibold text-base border-2" style={{ borderColor: 'var(--primary-500)', color: 'var(--primary-600)' }}>
                Post for Free
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
