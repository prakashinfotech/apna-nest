'use client'

import { useState } from 'react'
import { User, Bell, Shield, Trash2, Loader2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [profile, setProfile] = useState({
    name:  user?.name  ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    city:  '',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setSaved(false); setSaveError('')
    try {
      const res = await api.put<{ user: any }>('/users/me', { 
        name: profile.name, 
        phone: profile.phone,
        email: profile.email
      })
      if (res.user) updateUser(res.user)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }
  const [notifications, setNotifications] = useState({
    emailEnquiries: true, smsEnquiries: true, emailAlerts: true, smsAlerts: false,
    emailNews: false, pushNotifications: true,
  })

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>

      {/* Profile */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
          </div>

          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'var(--primary-500)' }}>
              R
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{profile.name}</p>
              <button className="text-sm font-medium mt-1" style={{ color: 'var(--primary-600)' }}>Change Photo</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input className="mt-1" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input className="mt-1" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input type="email" className="mt-1" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-1" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
          </div>

          {saveError && (
            <p className="mt-3 text-xs text-red-600">⚠️ {saveError}</p>
          )}
          <div className="mt-4 flex gap-3 items-center">
            <Button onClick={handleSaveProfile} disabled={saving} style={{ background: 'var(--primary-500)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailEnquiries' as const, label: 'Email me for new enquiries', desc: 'When someone contacts you about a listing' },
              { key: 'smsEnquiries' as const, label: 'SMS me for new enquiries', desc: 'Instant SMS on your phone' },
              { key: 'emailAlerts' as const, label: 'Email price alerts', desc: 'When saved property prices change' },
              { key: 'smsAlerts' as const, label: 'SMS price alerts', desc: 'Instant SMS for price drops' },
              { key: 'emailNews' as const, label: 'Email newsletter', desc: 'Weekly market insights and news' },
              { key: 'pushNotifications' as const, label: 'Push notifications', desc: 'Browser/app notifications' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  className="relative w-11 h-6 rounded-full transition-colors shrink-0"
                  style={{ background: notifications[key] ? 'var(--primary-500)' : 'var(--border)' }}
                  role="switch"
                  aria-checked={notifications[key]}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: notifications[key] ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </button>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Security</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              Connected Accounts (Google, Apple)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-red-600">Danger Zone</h2>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Deleting your account will permanently remove all your listings, saved properties, and messages. This cannot be undone.
          </p>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
