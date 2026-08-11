import { Shield, UserCheck, Tag, Star, Zap, HeartHandshake } from 'lucide-react'

const REASONS = [
  {
    icon: Shield,
    title: 'RERA Verified',
    desc: 'Every listing is cross-checked against RERA databases for compliance and authenticity before going live.',
    color: 'var(--primary-500)',
    bg: 'var(--primary-50)',
  },
  {
    icon: Tag,
    title: 'Zero Brokerage',
    desc: 'Thousands of owner-direct listings with zero brokerage fees. Save lakhs on your next transaction.',
    color: 'var(--secondary-500)',
    bg: 'var(--secondary-50)',
  },
  {
    icon: UserCheck,
    title: 'Owner Direct',
    desc: 'Connect directly with property owners. No middlemen, no information asymmetry, no surprises.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    desc: 'Set up saved searches and get instant notifications when new properties matching your criteria are listed.',
    color: '#F97316',
    bg: '#FFF7ED',
  },
  {
    icon: Star,
    title: 'Hyperlocal Insights',
    desc: 'Price trends, infrastructure updates, and walkability scores for every neighbourhood in India.',
    color: '#EAB308',
    bg: '#FEFCE8',
  },
  {
    icon: HeartHandshake,
    title: 'Assisted Services',
    desc: 'From home loans to legal documentation, our partner network helps you close deals smoothly.',
    color: '#0EA5E9',
    bg: '#F0F9FF',
  },
]

export function WhyUsSection() {
  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>
            Why ApnaNest
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            The Smarter Way to Buy or Rent
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We cut through the noise of Indian real estate so you can find your perfect home — faster, safer, and cheaper.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
