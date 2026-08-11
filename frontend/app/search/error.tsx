'use client'
import { RefreshCw } from 'lucide-react'
export default function SearchError({ reset }: { reset: () => void; error: Error }) {
  return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="font-serif text-xl font-semibold mb-3">Search failed</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Something went wrong loading the search results.</p>
      <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white mx-auto" style={{ background: 'var(--primary-500)' }}>
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  )
}
