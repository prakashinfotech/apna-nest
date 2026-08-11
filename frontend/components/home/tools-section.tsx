import Link from 'next/link'
import { Calculator, PiggyBank, FileText, TrendingUp, ArrowRight } from 'lucide-react'

const TOOLS = [
  {
    icon: Calculator,
    title: 'EMI Calculator',
    desc: 'Calculate your monthly EMI with current interest rates',
    href: '/tools/emi-calculator',
    color: 'var(--primary-500)',
    bg: 'var(--primary-50)',
    stats: 'Rates from 8.35%',
  },
  {
    icon: PiggyBank,
    title: 'Affordability Check',
    desc: 'Find out how much home you can afford based on your income',
    href: '/tools/affordability',
    color: 'var(--secondary-500)',
    bg: 'var(--secondary-50)',
    stats: 'Quick 2-min check',
  },
  {
    icon: TrendingUp,
    title: 'Property Valuation',
    desc: 'Get an instant AI-powered estimate of any property\'s current value',
    href: '/tools/property-value',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    stats: 'AI-powered',
  },
  {
    icon: FileText,
    title: 'Rent Receipt Generator',
    desc: 'Generate HRA-compliant rent receipts for tax exemption',
    href: '/tools/rent-receipt',
    color: '#F97316',
    bg: '#FFF7ED',
    stats: 'HRA compliant',
  },
]

export function ToolsSection() {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>
              Free Tools
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Homebuyer Tools
            </h2>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to make smarter property decisions
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--primary-600)' }}
          >
            All Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS.map(({ icon: Icon, title, desc, href, color, bg, stats }) => (
            <Link key={title} href={href} className="group">
              <div className="h-full p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-serif font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
                    {stats}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
