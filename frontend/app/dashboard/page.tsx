'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, MessageSquare, TrendingUp, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Building2, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface OwnerStats {
  totalViews:     number
  totalLeads:     number
  activeListings: number
  savedCount:     number
}

const ACTIVITY = [
  { id: 1, title: 'New enquiry for "Spacious 3BHK in Bopal"', time: '2 hours ago', icon: MessageSquare, unread: true },
  { id: 2, title: 'Property reached 1,247 views', time: '5 hours ago', icon: Eye, unread: false },
  { id: 3, title: 'Your profile is 80% complete', time: '1 day ago', icon: AlertCircle, unread: true },
  { id: 4, title: 'Property listed and live', time: '2 days ago', icon: CheckCircle2, unread: false },
]

interface Lead {
  id: string
  buyerName: string
  propertyTitle?: string
  createdAt: string
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])

  useEffect(() => {
    // Stats
    api.get<OwnerStats>('/users/me/stats')
      .then((data) => setStats(data))
      .catch(() => setStats({ totalViews: 0, totalLeads: 0, activeListings: 0, savedCount: 0 }))
      .finally(() => setStatsLoading(false))

    // Recent Activity (Leads)
    api.get<Lead[]>('/leads/my')
      .then(data => setRecentLeads(data.slice(0, 4)))
      .catch(() => {})
  }, [])

  const STAT_CARDS = [
    {
      label: 'Total Views',
      value: stats?.totalViews?.toLocaleString('en-IN') ?? '0',
      trend: '+12%',
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Enquiries',
      value: stats?.totalLeads?.toLocaleString('en-IN') ?? '0',
      trend: '+4%',
      icon: MessageSquare,
      color: 'text-[var(--primary-500)]',
      bg: 'bg-[var(--primary-50)]',
    },
    {
      label: 'Liked',
      value: stats?.savedCount?.toLocaleString('en-IN') ?? '0',
      trend: '+18%',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Active Listings',
      value: stats?.activeListings?.toLocaleString('en-IN') ?? '0',
      trend: '0%',
      icon: Building2,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.label} className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={cn('p-2.5 rounded-xl', stat.bg)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {statsLoading
                  ? <Loader2 className="w-5 h-5 animate-spin inline text-slate-300" />
                  : stat.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6 border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-bold text-slate-900">Recent Enquiries</h2>
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm" className="text-[var(--primary-600)] font-bold text-xs uppercase">View All</Button>
            </Link>
          </div>
          <div className="space-y-6">
            {recentLeads.length > 0 ? recentLeads.map((item: Lead) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="mt-1 h-8 w-8 rounded-full bg-[var(--primary-50)] flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4 text-[var(--primary-500)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    New enquiry from <span className="font-bold">{item.buyerName}</span> for <span className="text-[var(--primary-600)]">{item.propertyTitle || 'Listing'}</span>
                  </p>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-[var(--primary-500)] shrink-0 mt-2" />
              </div>
            )) : (
              <div className="py-10 text-center">
                <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No enquiries received yet.</p>
              </div>
            )}
          </div>
        </Card>

          <Card className="p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-900/20">
            <h3 className="text-lg font-serif font-bold mb-2">Want More Enquiries?</h3>
            <p className="text-sm text-slate-400 mb-6">Boost your listings to appear at the top of search results.</p>
            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold gap-2">
              Boost Listing <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Card>
      </div>
    </div>
  )
}


