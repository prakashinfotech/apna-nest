import { TrendingUp, Home, Users, Shield } from 'lucide-react'

const STATS = [
  { icon: Home, value: '50,000+', label: 'Active Listings', sub: 'Across 50+ cities' },
  { icon: Users, value: '2M+', label: 'Happy Users', sub: 'Trust ApnaNest' },
  { icon: Shield, value: '98%', label: 'Verified Properties', sub: 'RERA compliant' },
  { icon: TrendingUp, value: '₹0', label: 'Brokerage', sub: 'Owner-direct listings' },
]

export function StatsSection() {
  return (
    <section className="py-10 bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--primary-50)' }}>
                <Icon className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
              </div>
              <div className="text-2xl lg:text-3xl font-serif font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {value}
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
