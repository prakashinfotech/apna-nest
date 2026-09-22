'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-serif font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Something went wrong
      </h2>
      <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-600"
        style={{ background: 'var(--primary-500)' }}
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  )
}
