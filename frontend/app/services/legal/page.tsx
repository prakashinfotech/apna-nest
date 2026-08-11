import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LegalAssistanceClient } from './legal-assistance-client'

export const metadata: Metadata = {
  title: 'Legal Assistance — Property Verification & Documentation',
  description: 'Get expert legal help for property title search, sale deed drafting, and RERA consultation. Professional property lawyers at your service.',
}

export default function LegalAssistancePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <LegalAssistanceClient />
      </main>
      <Footer />
    </div>
  )
}
