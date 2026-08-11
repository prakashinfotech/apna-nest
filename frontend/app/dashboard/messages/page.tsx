'use client'

import { useState, useEffect } from 'react'
import { Send, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

interface Lead {
  id: string
  buyerName: string
  buyerPhone?: string
  buyerEmail?: string
  message: string
  createdAt: string
  propertyId?: string
}

const MOCK_LEADS: Lead[] = [
  { id: 'l1', buyerName: 'Suresh Patel', buyerPhone: '+91 98765 11111', message: 'Can I schedule a visit this weekend?', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'l2', buyerName: 'Meera Iyer', buyerPhone: '+91 98765 22222', message: 'What is the final price? Is it negotiable?', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'l3', buyerName: 'Priya Sharma', buyerPhone: '+91 98765 33333', message: 'I am interested, please share RERA docs.', createdAt: new Date(Date.now() - 86400000).toISOString() },
]

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export default function MessagesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const [reply, setReply] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get<Lead[]>('/leads')
      .then((data) => { setLeads(data); setActiveLead(data[0] ?? null) })
      .catch(() => { setLeads(MOCK_LEADS); setActiveLead(MOCK_LEADS[0]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = leads.filter((l) =>
    l.buyerName.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--primary-500)' }} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Enquiries</h1>

      <div className="flex border border-border rounded-2xl overflow-hidden bg-card" style={{ height: '520px' }}>
        {/* Sidebar */}
        <div className="w-60 shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
              <Input placeholder="Search..." className="pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No enquiries yet</p>
            )}
            {filtered.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setActiveLead(lead)}
                className={cn('w-full text-left p-3 border-b border-border hover:bg-[var(--surface-2)] transition-colors', activeLead?.id === lead.id && 'bg-[var(--primary-50)]')}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--primary-500)' }}>
                    {lead.buyerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{lead.buyerName}</span>
                      <span className="text-[10px] shrink-0 ml-1" style={{ color: 'var(--text-tertiary)' }}>{timeAgo(lead.createdAt)}</span>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{lead.message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeLead ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--primary-500)' }}>
                {activeLead.buyerName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{activeLead.buyerName}</p>
                {activeLead.buyerPhone && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{activeLead.buyerPhone}</p>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex justify-start">
                <div className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm" style={{ background: 'var(--surface-2)', color: 'var(--text-primary)', borderBottomLeftRadius: '4px' }}>
                  {activeLead.message}
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{timeAgo(activeLead.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <Input
                placeholder="Type a reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setReply('')}
                className="flex-1"
              />
              <button
                onClick={() => setReply('')}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: 'var(--primary-500)' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">Select an enquiry to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
