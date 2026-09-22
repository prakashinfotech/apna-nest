'use client'

import { useState } from 'react'
import { FileText, Download, Printer, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function RentReceiptClient() {
  const [form, setForm] = useState({
    tenantName: '', tenantPan: '', landlordName: '', landlordPan: '', landlordAddress: '',
    rentAmount: '', month: 'April', year: '2026', propertyAddress: '',
  })
  const [generated, setGenerated] = useState(false)

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const canGenerate = form.tenantName && form.landlordName && form.rentAmount && form.propertyAddress

  return (
    <div className="max-w-[900px] mx-auto px-4 lg:px-6 py-10">
      <div className="mb-8 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1" style={{ background: '#FFF7ED' }}>
          <FileText className="w-5 h-5" style={{ color: '#F97316' }} />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Rent Receipt Generator</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Generate HRA-compliant rent receipts for income tax purposes. Accepted by all employers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Receipt Details</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Month</Label>
                <select className="w-full mt-1 h-10 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2"
                  style={{ color: 'var(--text-primary)' }}
                  value={form.month} onChange={(e) => update('month', e.target.value)}>
                  {MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Year</Label>
                <select className="w-full mt-1 h-10 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2"
                  style={{ color: 'var(--text-primary)' }}
                  value={form.year} onChange={(e) => update('year', e.target.value)}>
                  {['2024', '2025', '2026'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Tenant Name *</Label>
              <Input placeholder="Your full name" className="mt-1 h-9 text-sm" value={form.tenantName} onChange={(e) => update('tenantName', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Tenant PAN (optional)</Label>
              <Input placeholder="ABCDE1234F" className="mt-1 h-9 text-sm" value={form.tenantPan} onChange={(e) => update('tenantPan', e.target.value.toUpperCase())} maxLength={10} />
            </div>
            <div>
              <Label className="text-xs">Monthly Rent (₹) *</Label>
              <Input type="number" placeholder="15000" className="mt-1 h-9 text-sm" value={form.rentAmount} onChange={(e) => update('rentAmount', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Landlord Name *</Label>
              <Input placeholder="Landlord's full name" className="mt-1 h-9 text-sm" value={form.landlordName} onChange={(e) => update('landlordName', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Landlord PAN (required if rent {'>'} ₹1L/year)</Label>
              <Input placeholder="ABCDE1234F" className="mt-1 h-9 text-sm" value={form.landlordPan} onChange={(e) => update('landlordPan', e.target.value.toUpperCase())} maxLength={10} />
            </div>
            <div>
              <Label className="text-xs">Property Address *</Label>
              <Input placeholder="Full address of rented property" className="mt-1 h-9 text-sm" value={form.propertyAddress} onChange={(e) => update('propertyAddress', e.target.value)} />
            </div>

            <Button className="w-full gap-2" style={{ background: '#F97316' }}
              disabled={!canGenerate}
              onClick={() => setGenerated(true)}>
              <FileText className="w-4 h-4" />
              Generate Receipt
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <div>
          {generated ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--success)' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Receipt Generated!</span>
                </div>

                {/* Receipt preview */}
                <div className="border-2 border-dashed border-border rounded-xl p-5 mb-4 text-sm space-y-3" style={{ fontFamily: 'serif' }}>
                  <div className="text-center border-b pb-3">
                    <p className="font-bold text-base">RENT RECEIPT</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>For the month of {form.month} {form.year}</p>
                  </div>
                  <p>Received with thanks from <strong>{form.tenantName}</strong>{form.tenantPan ? ` (PAN: ${form.tenantPan})` : ''} a sum of <strong>₹{Number(form.rentAmount).toLocaleString('en-IN')}/- (Rupees {form.rentAmount} only)</strong> towards rent for the property at:</p>
                  <p className="italic">{form.propertyAddress}</p>
                  <p className="pt-2 border-t">Landlord: <strong>{form.landlordName}</strong>{form.landlordPan ? ` | PAN: ${form.landlordPan}` : ''}</p>
                  <div className="flex justify-between pt-3 border-t text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span>Signature: _____________</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 gap-2 transition-all hover:opacity-90 active:scale-95 shadow-md" 
                    style={{ background: '#F97316' }}
                    onClick={() => window.print()}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 transition-all active:scale-95"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                </div>

                <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-tertiary)' }}>
                  This receipt is HRA-compliant and accepted by all employers for tax exemption.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Receipt Preview</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fill in the details on the left and click Generate Receipt to preview your HRA-compliant rent receipt.</p>
                <div className="mt-5 p-4 rounded-xl text-left" style={{ background: 'var(--surface-2)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>📋 What you get:</p>
                  {['HRA-compliant format', 'Landlord signature field', 'PAN details included', 'Instant PDF download', 'Print-ready layout'].map((item) => (
                    <p key={item} className="text-xs flex items-center gap-2 mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: 'var(--success)' }} /> {item}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
