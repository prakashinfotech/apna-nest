import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PropertyValueClient } from './property-value-client'

export const metadata: Metadata = {
  title: 'Property Valuation — Instant AI Estimate',
  description: 'Get an instant AI-powered estimate of any property\'s current market value. Enter address, type, and size.',
}

export default function PropertyValuePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <PropertyValueClient />
      </main>
      <Footer />
    </div>
  )
}
