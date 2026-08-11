'use client'

import { useEffect } from 'react'
import { PropertyFormWizard } from '@/components/post-property/property-form-wizard'
import { ShieldCheck, Info } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function PostPropertyPage() {
  const { user, openLogin, isHydrated } = useAuthStore()

  // Guard: if not logged in, show login modal instead of form
  useEffect(() => {
    if (isHydrated && !user) openLogin()
  }, [user, openLogin, isHydrated])

  if (!isHydrated) return null // Wait for hydration before rendering

  if (!user) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Login Required
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Please login to post your property. Opening login…
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Side */}
          <div className="flex-1">
            <div className="mb-10">
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Sell or Rent your Property</h1>
              <p className="text-slate-500">Reach thousands of verified buyers and tenants on India's most trusted platform.</p>
            </div>
            
            <PropertyFormWizard />
          </div>

          {/* Info Side */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900">Why list on ApnaNest?</h3>
              <ul className="space-y-3">
                {[
                  "Zero Brokerage by default",
                  "Direct connection with buyers",
                  "RERA verification badges",
                  "Premium neighborhood analytics",
                  "Expert property valuation tools"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <div className="h-1 w-1 rounded-full bg-green-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-[var(--primary-600)] rounded-3xl text-white space-y-4 shadow-xl shadow-[var(--primary-500)]/20">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Info className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold">Pro Tip</h3>
              <p className="text-xs text-[var(--primary-50)] leading-relaxed">
                Properties with more than 5 high-quality photos get 3x more enquiries. Make sure to capture your property in natural daylight.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
