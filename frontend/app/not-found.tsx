import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--primary-50)' }}>
      <div className="text-8xl font-serif font-bold mb-4" style={{ color: 'var(--primary-500)' }}>404</div>
      <h1 className="text-2xl font-serif font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        This page does not exist
      </h1>
      <p className="text-base mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
        The property or page you&apos;re looking for may have been removed, renamed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-600"
          style={{ background: 'var(--primary-500)' }}
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 font-600"
          style={{ borderColor: 'var(--primary-500)', color: 'var(--primary-600)' }}
        >
          <Search className="w-4 h-4" />
          Search Properties
        </Link>
      </div>
    </div>
  )
}
