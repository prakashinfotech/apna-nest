'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, Search, Phone, Mail, 
  Calendar, CheckCircle2, XCircle, MoreHorizontal,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface Lead {
  id: string
  buyerName: string
  buyerPhone: string
  buyerEmail?: string
  message?: string
  status?: string
  statusId?: number
  propertyTitle?: string
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get<Lead[]>('/leads/my')
      .then(data => setLeads(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const downloadCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to download')
      return
    }

    const headers = ['Buyer Name', 'Phone', 'Email', 'Property', 'Message', 'Status', 'Date']
    const rows = leads.map(l => [
      l.buyerName,
      l.buyerPhone,
      l.buyerEmail || '-',
      l.propertyTitle || 'Unknown Property',
      (l.message || '').replace(/"/g, '""'), // Escape quotes for CSV
      l.status || 'New',
      new Date(l.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `ApnaNest_Leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Leads exported as CSV')
  }

  const filtered = leads.filter(l => 
    (l.buyerName || '').toLowerCase().includes(search.toLowerCase()) || 
    (l.propertyTitle || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search leads by name or property..." 
            className="pl-10 h-11 rounded-xl border-slate-100 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          onClick={downloadCSV}
          className="rounded-xl h-11 px-6 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white font-bold gap-2 shadow-lg shadow-[var(--primary-600)]/20"
        >
          <Download className="h-4 w-4" />
          Export Leads
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((lead) => (
          <Card key={lead.id} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarFallback className="bg-[var(--primary-50)] text-[var(--primary-600)] font-bold">
                    {(lead.buyerName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{lead.buyerName}</h3>
                    <Badge variant={lead.status === 'New' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1.5">
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Interested in: <span className="text-slate-700 font-bold">{lead.propertyTitle}</span></p>
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Phone className="h-3 w-3" />
                      {lead.buyerPhone}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Mail className="h-3 w-3" />
                      {lead.buyerEmail}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:text-right space-y-4">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center lg:justify-end gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Received {new Date(lead.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center lg:justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg h-9 text-xs font-bold gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-100"
                    onClick={async () => {
                      try {
                        await api.patch(`/leads/${lead.id}/status`, { statusId: 2 }) // 2 = Contacted
                        setLeads(leads.map(l => l.id === lead.id ? { ...l, statusId: 2 } : l))
                        toast.success('Lead marked as contacted')
                      } catch {
                        toast.error('Failed to update lead')
                      }
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Contacted
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg h-9 text-xs font-bold gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                    onClick={async () => {
                      if (!confirm('Are you sure you want to archive this lead?')) return
                      try {
                        await api.delete(`/leads/${lead.id}`)
                        setLeads(leads.filter(l => l.id !== lead.id))
                        toast.success('Lead archived')
                      } catch {
                        toast.error('Failed to delete lead')
                      }
                    }}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Archive
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MessageSquare className="h-3 w-3" />
                Message from Buyer
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{lead.message}"
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
