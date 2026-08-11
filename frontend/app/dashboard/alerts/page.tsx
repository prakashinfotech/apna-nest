'use client'

import { useState } from 'react'
import { Bell, TrendingDown, TrendingUp, Home, Tag, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const INITIAL_ALERTS = [
  { id: 1, type: 'price_drop', icon: TrendingDown, color: '#16A34A', bg: '#DCFCE7', title: 'Price dropped on a saved property', body: '2BHK in SG Highway dropped by ₹2L to ₹60L', time: '2 hours ago', read: false },
  { id: 2, type: 'new_match', icon: Home, color: 'var(--primary-500)', bg: 'var(--primary-50)', title: 'New property matches your search', body: '3 new 3BHK listings in Bopal match your saved search', time: '5 hours ago', read: false },
  { id: 3, type: 'enquiry', icon: Bell, color: 'var(--secondary-500)', bg: 'var(--secondary-50)', title: 'New enquiry on your listing', body: 'Suresh Patel sent an enquiry for your 3BHK in Bopal', time: '1 day ago', read: true },
  { id: 4, type: 'price_rise', icon: TrendingUp, color: '#F97316', bg: '#FFF7ED', title: 'Locality price trend update', body: 'Whitefield prices rose 3.2% this month — your saved properties appreciated', time: '2 days ago', read: true },
  { id: 5, type: 'verified', icon: CheckCircle2, color: '#8B5CF6', bg: '#F5F3FF', title: 'Property verified successfully', body: 'Your listing "3BHK in Bopal" has been verified by our team', time: '3 days ago', read: true },
  { id: 6, type: 'discount', icon: Tag, color: '#EF4444', bg: '#FEF2F2', title: 'Zero brokerage deal found', body: 'Owner-direct 2BHK in Koramangala listed at ₹22K/month, zero brokerage', time: '4 days ago', read: true },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const unread = alerts.filter((a) => !a.read).length

  const markAllRead = () => setAlerts(alerts.map((a) => ({ ...a, read: true })))
  const markRead = (id: number) => setAlerts(alerts.map((a) => a.id === id ? { ...a, read: true } : a))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Alerts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{unread} unread alerts</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--primary-600)' }}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <button key={alert.id} className="w-full text-left" onClick={() => markRead(alert.id)}>
          <Card className={alert.read ? 'opacity-60' : 'ring-1 ring-[var(--primary-200)]'}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: alert.bg }}>
                  <alert.icon className="w-5 h-5" style={{ color: alert.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{alert.title}</p>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: 'var(--primary-500)' }} />
                    )}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{alert.body}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{alert.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
