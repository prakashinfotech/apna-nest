import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, PiggyBank, FileText, TrendingUp, ArrowRight, Home } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Free Property Tools',
  description: 'Free tools for homebuyers — EMI calculator, affordability check, property valuation and rent receipt generator.',
}

const TOOLS = [
  { icon: Calculator, title: 'EMI Calculator', desc: 'Calculate your monthly home loan EMI with current interest rates from leading banks.', href: '/tools/emi-calculator', tag: 'Most Popular', color: 'var(--primary-500)', bg: 'var(--primary-50)' },
  { icon: PiggyBank, title: 'Affordability Calculator', desc: 'Find out how much home you can afford based on your income, savings, and existing loans.', href: '/tools/affordability', tag: '2 min check', color: 'var(--secondary-500)', bg: 'var(--secondary-50)' },
  { icon: TrendingUp, title: 'Property Valuation', desc: 'Get an AI-powered instant estimate of the current market value of any property in India.', href: '/tools/property-value', tag: 'AI-Powered', color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: FileText, title: 'Rent Receipt Generator', desc: 'Generate HRA-compliant rent receipts for tax exemption. PDF ready in seconds.', href: '/tools/rent-receipt', tag: 'Free PDF', color: '#F97316', bg: '#FFF7ED' },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-12 lg:py-16" style={{ background: 'var(--primary-50)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--primary-500)' }}>100% Free</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Homebuyer Tools
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to make smarter property decisions — completely free, forever.
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TOOLS.map(({ icon: Icon, title, desc, href, tag, color, bg }) => (
              <Link key={title} href={href} className="group">
                <div className="h-full p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: bg, color }}>
                      {tag}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  <div className="flex items-center gap-2 font-semibold text-sm" style={{ color }}>
                    Try it free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
