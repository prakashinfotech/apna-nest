'use client'

import { useState, useMemo } from 'react'
import { Calculator, TrendingUp, Download, Share2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const BANKS = [
  { name: 'SBI', rate: 8.50 },
  { name: 'HDFC Bank', rate: 8.70 },
  { name: 'ICICI Bank', rate: 8.75 },
  { name: 'Axis Bank', rate: 8.75 },
  { name: 'Kotak', rate: 8.65 },
  { name: 'PNB', rate: 8.40 },
  { name: 'Bank of Baroda', rate: 8.40 },
  { name: 'Canara Bank', rate: 8.45 },
]

function formatRs(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function EmiCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(5000000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(20)
  const [showAmortization, setShowAmortization] = useState(false)

  const results = useMemo(() => {
    const r = interestRate / 12 / 100
    const n = tenureYears * 12
    const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n
    const totalPayment = emi * n
    const totalInterest = totalPayment - loanAmount
    const principalPercent = (loanAmount / totalPayment) * 100

    // Build amortization (yearly summary)
    const amortization: { year: number; principal: number; interest: number; balance: number }[] = []
    let balance = loanAmount
    for (let year = 1; year <= Math.min(tenureYears, 10); year++) {
      let yearPrincipal = 0, yearInterest = 0
      for (let m = 0; m < 12; m++) {
        const intPay = balance * r
        const prinPay = emi - intPay
        yearInterest += intPay
        yearPrincipal += prinPay
        balance -= prinPay
      }
      amortization.push({ year, principal: yearPrincipal, interest: yearInterest, balance: Math.max(0, balance) })
    }

    return { emi, totalPayment, totalInterest, principalPercent, amortization }
  }, [loanAmount, interestRate, tenureYears])

  const sliders = [
    { label: 'Loan Amount', value: loanAmount, min: 500000, max: 50000000, step: 100000, set: setLoanAmount, display: formatRs(loanAmount) },
    { label: 'Interest Rate (% p.a.)', value: interestRate, min: 6, max: 16, step: 0.05, set: setInterestRate, display: `${interestRate.toFixed(2)}%` },
    { label: 'Loan Tenure (Years)', value: tenureYears, min: 1, max: 30, step: 1, set: setTenureYears, display: `${tenureYears} yrs` },
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-50)' }}>
            <Calculator className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>EMI Calculator</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Calculate your monthly home loan EMI and plan your budget wisely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              {sliders.map(({ label, value, min, max, step, set, display }) => {
                const percent = ((value - min) / (max - min)) * 100
                return (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <span className="text-sm font-bold price-num" style={{ color: 'var(--primary-500)' }}>{display}</span>
                  </div>
                  <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary-500) ${percent}%, var(--primary-200) ${percent}%)`,
                    }}
                  />
                  <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <span>{typeof min === 'number' && min >= 100000 ? formatRs(min) : min}{label.includes('Rate') ? '%' : label.includes('Tenure') ? ' yr' : ''}</span>
                    <span>{typeof max === 'number' && max >= 100000 ? formatRs(max) : max}{label.includes('Rate') ? '%' : label.includes('Tenure') ? ' yrs' : ''}</span>
                  </div>
                </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Bank comparison */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary-500)' }} />
                Bank Rate Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Bank</th>
                      <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Rate</th>
                      <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>EMI/L</th>
                      <th className="text-right py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Monthly EMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BANKS.sort((a, b) => a.rate - b.rate).map((bank, i) => {
                      const r = bank.rate / 12 / 100
                      const n = tenureYears * 12
                      const bankEmi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
                      const emiPerLakh = (100000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
                      const isCurrent = Math.abs(bank.rate - interestRate) < 0.01
                      return (
                        <tr key={bank.name} className={`border-b border-border last:border-b-0 ${isCurrent ? 'font-semibold' : ''}`}
                          style={isCurrent ? { background: 'var(--primary-50)' } : {}}>
                          <td className="py-2.5" style={{ color: 'var(--text-primary)' }}>
                            {bank.name}
                            {i === 0 && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: '#DCFCE7', color: '#16A34A' }}>Lowest</span>}
                          </td>
                          <td className="text-right py-2.5 price-num" style={{ color: 'var(--text-secondary)' }}>{bank.rate.toFixed(2)}%</td>
                          <td className="text-right py-2.5 price-num" style={{ color: 'var(--text-secondary)' }}>₹{Math.round(emiPerLakh).toLocaleString('en-IN')}</td>
                          <td className="text-right py-2.5 price-num font-semibold" style={{ color: 'var(--text-primary)' }}>₹{Math.round(bankEmi).toLocaleString('en-IN')}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Amortization */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Amortization Schedule</h2>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="text-sm font-semibold" style={{ color: 'var(--primary-600)' }}
                >
                  {showAmortization ? 'Hide' : 'Show'}
                </button>
              </div>
              {showAmortization && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Year', 'Principal', 'Interest', 'Balance'].map((h) => (
                          <th key={h} className="text-right first:text-left py-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.amortization.map((row) => (
                        <tr key={row.year} className="border-b border-border last:border-b-0">
                          <td className="py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>Yr {row.year}</td>
                          <td className="text-right py-2.5 price-num" style={{ color: 'var(--text-secondary)' }}>{formatRs(row.principal)}</td>
                          <td className="text-right py-2.5 price-num" style={{ color: 'var(--text-secondary)' }}>{formatRs(row.interest)}</td>
                          <td className="text-right py-2.5 price-num font-semibold" style={{ color: 'var(--text-primary)' }}>{formatRs(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Monthly EMI</p>
              <div className="text-4xl font-serif font-bold price-num mb-1" style={{ color: 'var(--primary-500)' }}>
                ₹{Math.round(results.emi).toLocaleString('en-IN')}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>per month for {tenureYears} years</p>

              {/* Pie chart visualization */}
              <div className="my-5 flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary-200)" strokeWidth="3.2" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary-500)" strokeWidth="3.2"
                      strokeDasharray={`${results.principalPercent} ${100 - results.principalPercent}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: 'var(--primary-600)' }}>
                      {Math.round(results.principalPercent)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--primary-500)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Principal: {formatRs(loanAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--primary-200)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Interest: {formatRs(results.totalInterest)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                {[
                  { label: 'Principal Amount', value: formatRs(loanAmount) },
                  { label: 'Total Interest', value: formatRs(results.totalInterest) },
                  { label: 'Total Payment', value: formatRs(results.totalPayment), bold: true },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span className={`text-sm price-num ${bold ? 'font-bold' : ''}`} style={{ color: bold ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'var(--primary-500)', color: 'white' }}>
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-border"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Share2 className="w-4 h-4" />
                  Share Results
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
