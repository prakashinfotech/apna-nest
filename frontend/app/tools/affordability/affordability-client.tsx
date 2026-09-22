'use client'

import { useState, useMemo } from 'react'
import { PiggyBank, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function formatRs(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function AffordabilityClient() {
  const [monthlyIncome, setMonthlyIncome] = useState(150000)
  const [existingEmi, setExistingEmi] = useState(0)
  const [downPayment, setDownPayment] = useState(2000000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(20)

  const results = useMemo(() => {
    const maxEmiAllowed = monthlyIncome * 0.5 - existingEmi
    const r = interestRate / 12 / 100
    const n = tenureYears * 12
    const maxLoan = maxEmiAllowed > 0 ? (maxEmiAllowed * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : 0
    const maxHome = maxLoan + downPayment
    const foir = ((existingEmi + maxEmiAllowed) / monthlyIncome) * 100
    return { maxEmiAllowed: Math.max(0, maxEmiAllowed), maxLoan: Math.max(0, maxLoan), maxHome: Math.max(0, maxHome), foir }
  }, [monthlyIncome, existingEmi, downPayment, interestRate, tenureYears])

  const isGood = results.foir <= 50

  return (
    <div className="max-w-[900px] mx-auto px-4 lg:px-6 py-10">
      <div className="mb-8 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1" style={{ background: 'var(--secondary-50)' }}>
          <PiggyBank className="w-5 h-5" style={{ color: 'var(--secondary-500)' }} />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Affordability Calculator</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Find out exactly how much home you can comfortably afford.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Your Financial Profile</h2>

            {[
              { label: 'Monthly Net Income (₹)', value: monthlyIncome, set: setMonthlyIncome, min: 20000, max: 1000000, step: 5000 },
              { label: 'Existing EMIs (₹/month)', value: existingEmi, set: setExistingEmi, min: 0, max: 500000, step: 1000 },
              { label: 'Down Payment Available (₹)', value: downPayment, set: setDownPayment, min: 100000, max: 20000000, step: 100000 },
            ].map(({ label, value, set, min, max, step }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">{label}</Label>
                  <span className="text-sm font-bold price-num" style={{ color: 'var(--secondary-500)' }}>{formatRs(value)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--secondary-500)' }} />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label className="text-xs">Interest Rate (%)</Label>
                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="mt-1 h-9 text-sm" min={6} max={16} step={0.1} />
              </div>
              <div>
                <Label className="text-xs">Tenure (Years)</Label>
                <Input type="number" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="mt-1 h-9 text-sm" min={5} max={30} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card style={{ borderColor: isGood ? 'var(--primary-200)' : '#FEF08A' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {isGood
                  ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
                  : <AlertCircle className="w-5 h-5 text-amber-500" />}
                <span className="font-semibold text-sm" style={{ color: isGood ? 'var(--success)' : '#D97706' }}>
                  {isGood ? 'Healthy financial profile' : 'High debt-to-income ratio'}
                </span>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Maximum Home Budget</p>
                <div className="text-4xl font-serif font-bold price-num" style={{ color: 'var(--primary-500)' }}>
                  {formatRs(results.maxHome)}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Max Loan Eligible', value: formatRs(results.maxLoan), highlight: false },
                  { label: 'Down Payment', value: formatRs(downPayment), highlight: false },
                  { label: 'Max Monthly EMI', value: `₹${Math.round(results.maxEmiAllowed).toLocaleString('en-IN')}`, highlight: true },
                  { label: 'FOIR (Debt-to-Income)', value: `${results.foir.toFixed(1)}%`, highlight: false },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border last:border-b-0">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span className={`text-sm font-semibold price-num ${highlight ? 'text-[var(--primary-600)]' : ''}`}
                      style={!highlight ? { color: 'var(--text-primary)' } : {}}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl text-sm" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
            <p className="font-semibold mb-1">💡 Expert Tip</p>
            <p>Banks typically allow up to 50% of net monthly income as total EMI (FOIR). A down payment of 20%+ gives you better loan terms and lower interest rates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
