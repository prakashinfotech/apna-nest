import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { EmiCalculatorClient } from './emi-calculator-client'

export const metadata: Metadata = {
  title: 'EMI Calculator — Home Loan',
  description: 'Calculate your monthly home loan EMI instantly. Compare banks, see amortization schedule, and plan your budget.',
}

export default function EmiCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <EmiCalculatorClient />
      </main>
      <Footer />
    </div>
  )
}
