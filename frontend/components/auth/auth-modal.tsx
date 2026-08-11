'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Eye, EyeOff, Mail, Phone, User, Home, Shield, Star, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const { isOpen, view, loginTab, signupRole, close, setView, setLoginTab, setSignupRole } = useAuthStore()
  const { loginWithEmail, register } = useAuthStore()

  // Form state
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // Controlled inputs — login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginPhone, setLoginPhone] = useState('')
  const [otp, setOtp] = useState('')

  // Controlled inputs — signup
  const [signupFirstName, setSignupFirstName] = useState('')
  const [signupLastName, setSignupLastName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const resetError = () => setError('')

  const handleClose = () => {
    setError('')
    setLoading(false)
    close()
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) { setError('Email and password are required'); return }
    setLoading(true); setError('')
    try {
      await loginWithEmail(loginEmail, loginPassword)
      // modal closes automatically via store
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupFirstName || !signupEmail || !signupPhone || !signupPassword) {
      setError('All fields are required'); return
    }
    if (signupPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      await register({
        firstName: signupFirstName,
        lastName:  signupLastName,
        email:     signupEmail,
        phone:     signupPhone.startsWith('+91') ? signupPhone : `+91${signupPhone}`,
        password:  signupPassword,
        isOwner:   signupRole === 'owner',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Email may already be in use.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[820px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="flex h-full max-h-[90vh] sm:max-h-[580px]">

          {/* ─── LEFT: Branding ─── */}
          <div
            className="hidden md:flex md:w-[320px] flex-col justify-between p-8 shrink-0 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, var(--primary-700) 0%, var(--primary-500) 50%, #0D9488 100%)' }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-xl font-bold text-white">ApnaNest</span>
              </div>

              <DialogTitle className="text-2xl font-serif font-bold text-white mb-3 leading-snug">
                {view === 'login' ? 'Welcome back' : 'Join 2M+ homebuyers'}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-sm leading-relaxed">
                {view === 'login'
                  ? 'Access your saved properties, leads, and continue where you left off.'
                  : 'Verified listings, zero brokerage, and direct owner contact.'}
              </DialogDescription>
            </div>

            <div className="relative z-10 space-y-4 mt-8">
              {[
                { icon: Shield, text: '100% verified listings' },
                { icon: Star,   text: 'Zero brokerage options' },
                { icon: ArrowRight, text: 'Direct owner contact' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white/90" />
                  </div>
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>

            <p className="relative z-10 text-[10px] text-white/40 mt-6">
              Trusted by homebuyers across 14+ cities
            </p>
          </div>

          {/* ─── RIGHT: Form ─── */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Login / Sign Up tabs */}
            <div className="flex border-b border-border shrink-0">
              {(['login', 'signup'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => { setView(v); resetError() }}
                  className={cn(
                    'flex-1 py-3.5 text-sm font-semibold text-center transition-colors relative',
                    view === v ? 'text-[var(--primary-600)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  )}
                >
                  {v === 'login' ? 'Login' : 'Sign Up'}
                  {view === v && (
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-full" style={{ background: 'var(--primary-500)' }} />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              {/* Error banner */}
              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {view === 'login' ? (
                <div className="space-y-4">
                  {/* Single smart input — auto-detects email vs phone */}
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-identifier" className="text-xs font-semibold text-slate-600">
                        Email Address or Phone Number
                      </Label>
                      <div className="relative">
                        {loginEmail && /^\d/.test(loginEmail)
                          ? <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          : <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        }
                        <Input
                          id="login-identifier"
                          placeholder="name@email.com or 98765 43210"
                          className="pl-10 h-11 rounded-xl"
                          value={loginEmail}
                          onChange={(e) => { setLoginEmail(e.target.value); resetError() }}
                          autoComplete="username"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Enter your registered email address or mobile number</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-xs font-semibold text-slate-600">Password</Label>
                        <button type="button" className="text-xs text-[var(--primary-600)] font-medium hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pr-10 h-11 rounded-xl"
                          value={loginPassword}
                          onChange={(e) => { setLoginPassword(e.target.value); resetError() }}
                          autoComplete="current-password"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 rounded-xl font-semibold text-white"
                      style={{ background: 'var(--primary-500)' }} disabled={loading}>
                      {loading
                        ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying…</>
                        : 'Login'}
                    </Button>
                  </form>

                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-10 rounded-xl gap-2 text-xs font-medium" type="button">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl gap-2 text-xs font-medium" type="button">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </div>
              ) : (
                /* ─── SIGN UP ─── */
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Role selector */}
                  <div className="flex gap-1 p-1 rounded-xl bg-slate-100">
                    {([{ key: 'buyer', label: 'Buyer / Tenant' }, { key: 'owner', label: 'Property Owner' }] as const).map(({ key, label }) => (
                      <button key={key} type="button" onClick={() => { setSignupRole(key); resetError() }}
                        className={cn('flex-1 py-2 rounded-lg text-xs font-semibold transition-all',
                          signupRole === key ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)]'
                        )}>
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-fname" className="text-xs">First Name</Label>
                      <Input id="signup-fname" placeholder="Rajesh" className="h-11 rounded-xl"
                        value={signupFirstName} onChange={(e) => { setSignupFirstName(e.target.value); resetError() }} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-lname" className="text-xs">Last Name</Label>
                      <Input id="signup-lname" placeholder="Kumar" className="h-11 rounded-xl"
                        value={signupLastName} onChange={(e) => setSignupLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-email" type="email" placeholder="name@example.com" className="pl-10 h-11 rounded-xl"
                        value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); resetError() }} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-phone" className="text-xs">Phone Number</Label>
                    <div className="flex gap-2">
                      <span className="flex items-center justify-center px-3 h-11 rounded-xl border border-border text-sm text-muted-foreground shrink-0">+91</span>
                      <Input id="signup-phone" type="tel" placeholder="98765 43210" className="h-11 rounded-xl flex-1"
                        value={signupPhone} onChange={(e) => { setSignupPhone(e.target.value.replace(/\D/g, '')); resetError() }}
                        maxLength={10} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs">Password <span className="text-muted-foreground">(min 8 chars)</span></Label>
                    <div className="relative">
                      <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                        className="pr-10 h-11 rounded-xl" value={signupPassword}
                        onChange={(e) => { setSignupPassword(e.target.value); resetError() }} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 rounded-xl font-semibold text-white"
                    style={{ background: 'var(--primary-500)' }} disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating account…</> : 'Create Account'}
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground">
                    By signing up, you agree to our <a href="/terms" className="underline">Terms</a> &amp; <a href="/privacy" className="underline">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>

            <div className="px-6 pb-4 text-center text-[10px] text-muted-foreground">
              {view === 'login'
                ? <>Don&apos;t have an account? <button className="underline text-[var(--primary-600)] font-medium" onClick={() => { setView('signup'); resetError() }}>Sign up free</button></>
                : <>Already have an account? <button className="underline text-[var(--primary-600)] font-medium" onClick={() => { setView('login'); resetError() }}>Login</button></>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
