'use client'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
export default function PropertyError({ reset }: { reset: () => void; error: Error }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-4xl mb-4">🏡</div>
      <h2 className="font-serif text-xl font-semibold mb-3">Could not load property</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>This listing may have been removed or is temporarily unavailable.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white" style={{ background: 'var(--primary-500)' }}>
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
        <Link href="/search" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border" style={{ color: 'var(--text-secondary)' }}>
          Browse All
        </Link>
      </div>
    </div>
  )
}
