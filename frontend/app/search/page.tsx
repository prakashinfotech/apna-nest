import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SearchResults } from '@/components/search/search-results'

export const metadata: Metadata = {
  title: 'Search Properties',
  description: 'Find apartments, villas, plots, and PGs for buy and rent across India.',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-0 pb-16 lg:pb-0">
        <Suspense fallback={
          <div className="p-12 text-center" style={{ color: 'var(--text-tertiary)' }}>
            Loading results...
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
