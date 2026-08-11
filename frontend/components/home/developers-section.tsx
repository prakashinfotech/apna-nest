import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { DEVELOPERS } from '@/lib/constants'

export function DevelopersSection() {
  return (
    <section className="py-14 lg:py-20" style={{ background: 'var(--surface-2)' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>
              Trusted Builders
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Top Developers
            </h2>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              India&apos;s most reputed builders — all in one place
            </p>
          </div>
          <Link
            href="/projects#developers"
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--primary-600)' }}
          >
            All Developers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DEVELOPERS.map((dev) => (
            <Link
              key={dev.id}
              href={`/projects?builder=${encodeURIComponent(dev.name)}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold text-white font-serif"
                  style={{ background: 'var(--primary-500)' }}
                >
                  {dev.logoInitials}
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>
                  {dev.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-current" style={{ color: 'var(--secondary-500)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{dev.rating}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{dev.projectsCount}+ projects</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
