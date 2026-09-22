'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const SUBJECTS = ['General Enquiry', 'Report a Listing', 'Post Property Help', 'Account Issues', 'Partnership / Business', 'Media / Press']

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--primary-50)' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--primary-500)' }} />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Thanks for reaching out. We&apos;ll get back to you at <strong>{form.email}</strong> within 4 hours.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}>
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input placeholder="Rajesh Kumar" className="mt-1" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <Label>Email Address *</Label>
            <Input type="email" placeholder="you@example.com" className="mt-1" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input placeholder="+91 98765 43210" className="mt-1" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <Label>Subject *</Label>
            <select
              className="w-full mt-1 h-10 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2"
              style={{ color: form.subject ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
              value={form.subject} onChange={(e) => update('subject', e.target.value)}>
              <option value="">Select a subject...</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Message *</Label>
            <Textarea
              rows={5}
              placeholder="Tell us how we can help you..."
              className="mt-1"
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
            />
          </div>
        </div>

        <Button
          className="mt-5 gap-2"
          style={{ background: 'var(--primary-500)' }}
          disabled={!form.name || !form.email || !form.subject || !form.message}
          onClick={() => setSubmitted(true)}
        >
          <Send className="w-4 h-4" />
          Send Message
        </Button>

        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
          By submitting this form, you agree to our Privacy Policy. We never share your information with third parties.
        </p>
      </CardContent>
    </Card>
  )
}
