import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RentReceiptClient } from './rent-receipt-client'

export const metadata: Metadata = {
  title: 'Rent Receipt Generator — HRA Compliant',
  description: 'Generate HRA-compliant rent receipts for income tax purposes. Download as PDF instantly.',
}

export default function RentReceiptPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0"><RentReceiptClient /></main>
      <Footer />
    </div>
  )
}
