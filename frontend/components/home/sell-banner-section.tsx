import Link from 'next/link'
import { PlusCircle, CheckCircle2 } from 'lucide-react'

const BENEFITS = [
  'Free property listing — no charges ever',
  'Direct contact with verified buyers & tenants',
  'Reach 2M+ active property seekers',
  'Professional photography support available',
]

export function SellBannerSection() {
  return (
    <section className="py-14 lg:py-20 overflow-hidden" style={{ background: 'var(--primary-900)' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--primary-500)' }}>
              For Property Owners
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              List your property.<br />
              <span style={{ color: 'var(--primary-500)' }}>Reach lakhs of buyers.</span>
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Post your property in under 5 minutes and get enquiries from serious buyers and tenants across India. No middlemen, no brokerage cuts.
            </p>

            <ul className="space-y-3 mb-8">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--primary-500)' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/post-property"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90"
                style={{ background: 'var(--secondary-500)' }}
              >
                <PlusCircle className="w-5 h-5" />
                Post Property Free
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base border-2 transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Properties Listed', value: '50,000+' },
                { label: 'Cities Covered', value: '50+' },
                { label: 'Monthly Visitors', value: '2M+' },
                { label: 'Avg Days to Close', value: '21' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10"
                >
                  <div className="text-3xl font-serif font-bold text-white mb-1">{value}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
