import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AffordabilityClient } from './affordability-client'

export const metadata: Metadata = {
  title: 'Affordability Calculator',
  description: 'Find out how much home you can afford based on your income and financial profile.',
}

export default function AffordabilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0"><AffordabilityClient /></main>
      <Footer />
    </div>
  )
}
