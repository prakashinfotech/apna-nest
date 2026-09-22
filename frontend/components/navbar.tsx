'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MapPin, ChevronDown, Bell, User, Menu, X, Home, Search,
  PlusCircle, Heart, Building2, BookOpen, Phone, LogIn,
  TrendingUp, Key, Landmark, Calculator, Shield, Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'

const MEGA_MENU = {
  'Buy': {
    links: [
      { label: 'Apartments for Sale', href: '/search?type=buy&propertyType=apartment' },
      { label: 'Villas for Sale', href: '/search?type=buy&propertyType=villa' },
      { label: 'Plots for Sale', href: '/search?type=buy&propertyType=plot' },
      { label: 'Builder Floors', href: '/search?type=buy&propertyType=builder-floor' },
      { label: 'New Projects', href: '/projects' },
      { label: 'RERA Verified', href: '/search?type=buy&rera=true' },
    ],
    featured: { title: 'Top Picks in Ahmedabad', desc: 'Curated verified homes under ₹1 Cr', href: '/search?city=Ahmedabad' },
  },
  'Rent': {
    links: [
      { label: 'Apartments for Rent', href: '/search?type=rent&propertyType=apartment' },
      { label: 'Villas for Rent', href: '/search?type=rent&propertyType=villa' },
      { label: 'PG / Co-living', href: '/search?type=pg' },
      { label: 'Zero Brokerage Rentals', href: '/search?type=rent&zeroBrokerage=true' },
      { label: 'Owner Direct', href: '/search?type=rent&ownerDirect=true' },
      { label: 'Furnished Homes', href: '/search?type=rent&furnishing=fully-furnished' },
    ],
    featured: { title: 'Zero Broker Rentals', desc: 'Connect directly with owners', href: '/search?type=rent&zeroBrokerage=true' },
  },
  'Sell': {
    links: [
      { label: 'Post Free Property', href: '/post-property' },
      { label: 'Manage Listings', href: '/dashboard/listings' },
      { label: 'Get Home Valuation', href: '/tools/property-value' },
      { label: 'Seller\'s Guide', href: '/news/rera-guide-india' },
      { label: 'RERA Registration', href: '/news/rera-guide-india' },
    ],
    featured: { title: 'Sell Faster with ApnaNest', desc: '10x more visibility, zero listing fee', href: '/post-property' },
  },
  'Services': {
    links: [
      { label: 'EMI Calculator', href: '/tools/emi-calculator' },
      { label: 'Rent Receipt Generator', href: '/tools/rent-receipt' },
      { label: 'Property Valuation', href: '/tools/property-value' },
      { label: 'Home Loan Guide', href: '/news/home-loan-guide-2026' },
      { label: 'Legal Assistance', href: '/services/legal' },
      { label: 'New Projects', href: '/projects' },
    ],
    featured: { title: 'Free Tools for Homebuyers', desc: 'EMI, affordability & more', href: '/tools/emi-calculator' },
  },
} as const

const CITIES = ['Ahmedabad', 'Mumbai', 'Bangalore', 'Pune', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Gurgaon']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Ahmedabad')
  const pathname = usePathname()
  const { openLogin, openSignup, user, logout, isHydrated } = useAuthStore()
  const cityRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-border'
        )}
        style={{ height: '64px' }}
      >
        <div className="max-w-[1360px] mx-auto px-4 lg:px-6 h-full flex items-center gap-2">

          {/* ─── LEFT: Logo + Nav ─── */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-500)' }}>
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg font-bold hidden sm:block" style={{ color: 'var(--text-primary)' }}>
                Apna<span style={{ color: 'var(--primary-500)' }}>Nest</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {Object.keys(MEGA_MENU).map((item) => (
                <div
                  key={item}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    className={cn(
                      'relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                      openMenu === item
                        ? 'text-[var(--primary-600)] bg-[var(--primary-50)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-50'
                    )}
                  >
                    {item}
                    <ChevronDown className={cn('w-3 h-3 transition-transform', openMenu === item ? 'rotate-180' : '')} />
                  </button>

                  {openMenu === item && (
                    <>
                      {/* Invisible bridge to prevent menu from closing when moving mouse from button to menu */}
                      <div className="absolute top-[34px] left-0 right-0 h-4 z-40" />
                      
                      <div
                        className="absolute top-[42px] left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-border p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in zoom-in-95 duration-200"
                        style={{ width: '460px', boxShadow: 'var(--shadow-xl)' }}
                      >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                          Quick Links
                        </p>
                        {MEGA_MENU[item as keyof typeof MEGA_MENU].links.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block px-3 py-2 rounded-lg text-sm hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <div className="rounded-xl p-4 flex flex-col justify-between" style={{ background: 'var(--primary-50)' }}>
                        <div>
                          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--primary-700)' }}>
                            {MEGA_MENU[item as keyof typeof MEGA_MENU].featured.title}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--primary-600)' }}>
                            {MEGA_MENU[item as keyof typeof MEGA_MENU].featured.desc}
                          </p>
                        </div>
                        <Link
                          href={MEGA_MENU[item as keyof typeof MEGA_MENU].featured.href}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                          style={{ color: 'var(--primary-600)' }}
                        >
                          Explore →
                        </Link>
                      </div>
                    </div>
                  </>
                )}
                </div>
              ))}
              <Link
                href="/projects"
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                  pathname === '/projects'
                    ? 'text-[var(--primary-600)] bg-[var(--primary-50)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-50'
                )}
              >
                New Projects
              </Link>
              <Link
                href="/news"
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                  pathname.startsWith('/news')
                    ? 'text-[var(--primary-600)] bg-[var(--primary-50)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-50'
                )}
              >
                News & Insights
              </Link>
            </nav>
          </div>

          {/* ─── DIVIDER ─── */}
          <div className="hidden lg:block w-px h-7 bg-slate-200 mx-1" />

          {/* ─── RIGHT: City + Actions ─── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* City Selector — prominent pill */}
            <div className="relative hidden md:block" ref={cityRef}>
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className={cn(
                  'flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full text-[13px] font-semibold transition-all border-2',
                  cityOpen
                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                    : 'border-slate-200 hover:border-[var(--primary-400)] text-[var(--text-primary)]'
                )}
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--primary-500)' }} />
                {selectedCity}
                <ChevronDown className={cn('w-3 h-3 transition-transform', cityOpen && 'rotate-180')} style={{ color: 'var(--text-tertiary)' }} />
              </button>
              {cityOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-border p-1.5 z-50 min-w-[180px]"
                  style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider px-3 pt-2 pb-1.5" style={{ color: 'var(--text-tertiary)' }}>Select City</p>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCityOpen(false) }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedCity === city
                          ? 'bg-[var(--primary-50)] text-[var(--primary-600)] font-semibold'
                          : 'hover:bg-slate-50 text-[var(--text-secondary)]'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" style={{ color: selectedCity === city ? 'var(--primary-500)' : 'var(--text-tertiary)' }} />
                        {city}
                      </span>
                      {selectedCity === city && <Check className="w-3.5 h-3.5" style={{ color: 'var(--primary-500)' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/post-property"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'var(--secondary-500)' }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post Property
            </Link>

            {user && (
              <Link
                href="/dashboard/alerts"
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 hover:border-[var(--primary-400)] transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                {/* Only show badge when logged in */}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--secondary-500)] text-[8px] font-bold text-white flex items-center justify-center border-2 border-white">
                  !
                </span>
              </Link>
            )}

            {/* Auth section — logged-in profile dropdown OR login/signup buttons */}
            {!isHydrated ? (
              <div className="hidden md:flex items-center gap-2 h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="hidden md:flex items-center gap-2 relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border hover:border-[var(--primary-400)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'var(--primary-500)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate" style={{ color: 'var(--text-secondary)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', profileOpen ? 'rotate-180' : '')} style={{ color: 'var(--text-tertiary)' }} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
                    style={{ boxShadow: 'var(--shadow-lg)' }}>
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-border" style={{ background: 'var(--primary-50)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-base font-bold"
                          style={{ background: 'var(--primary-500)' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                            {user.roleId === 2 ? '🏠 Owner' : user.roleId === 4 ? '⚙️ Admin' : '🔍 Buyer'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="py-1">
                      {[
                        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
                        { href: '/dashboard/listings', label: 'My Listings', icon: '🏡' },
                        { href: '/dashboard/saved', label: 'Liked Properties', icon: '❤️' },
                        { href: '/dashboard/messages', label: 'Enquiries', icon: '💬' },
                        { href: '/dashboard/settings', label: 'Account Settings', icon: '⚙️' },
                        { href: '/post-property', label: 'Post a Property', icon: '➕' },
                      ].map(({ href, label, icon }) => (
                        <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--surface-2)] transition-colors"
                          style={{ color: 'var(--text-secondary)' }}>
                          <span>{icon}</span>
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => { setProfileOpen(false); logout(); window.location.href = '/' }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span>🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center rounded-lg border border-slate-200 overflow-hidden h-8">
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 px-3 h-full text-[13px] font-medium hover:bg-slate-50 transition-colors border-r border-slate-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <User className="w-3.5 h-3.5" />
                  Login
                </button>
                <button
                  onClick={openSignup}
                  className="flex items-center px-3 h-full text-[13px] font-semibold transition-colors hover:bg-[var(--primary-50)]"
                  style={{ color: 'var(--primary-600)' }}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col" style={{ top: '64px' }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* City selector */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Select City
              </p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(c)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                      selectedCity === c
                        ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-600)]'
                        : 'border-border text-[var(--text-secondary)]'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav Links */}
            <div className="space-y-1">
              {[
                { href: '/', label: 'Home', icon: Home },
                { href: '/search?type=buy', label: 'Buy Property', icon: Building2 },
                { href: '/search?type=rent', label: 'Rent Property', icon: Key },
                { href: '/search?type=pg', label: 'PG / Co-living', icon: Landmark },
                { href: '/projects', label: 'New Projects', icon: Building2 },
                { href: '/post-property', label: 'Post Property', icon: PlusCircle },
                { href: '/tools/emi-calculator', label: 'EMI Calculator', icon: Calculator },
                { href: '/news', label: 'News & Insights', icon: BookOpen },
                { href: '/agents', label: 'Find Agents', icon: Shield },
                { href: '/dashboard', label: 'My Dashboard', icon: TrendingUp },
                { href: '/contact', label: 'Contact Us', icon: Phone },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-border space-y-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 font-semibold"
                  style={{ borderColor: 'var(--primary-500)', color: 'var(--primary-600)' }}
                >
                  <User className="w-4 h-4" />
                  My Dashboard
                </Link>
                <button
                  onClick={() => { logout(); window.location.href = '/' }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-red-500 font-semibold border-2 border-red-200 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 font-semibold"
                  style={{ borderColor: 'var(--primary-500)', color: 'var(--primary-600)' }}
                >
                  <LogIn className="w-4 h-4" />
                  Login / Sign Up
                </button>
                <Link
                  href="/post-property"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold"
                  style={{ background: 'var(--secondary-500)' }}
                >
                  <PlusCircle className="w-4 h-4" />
                  Post Free Property
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border lg:hidden flex items-center justify-around h-16 px-2 pb-safe">
        {[
          { href: '/', icon: Home, label: 'Home' },
          { href: '/search?type=buy', icon: Search, label: 'Search' },
          { href: '/post-property', icon: PlusCircle, label: 'Post', primary: true },
          { href: '/dashboard/saved', icon: Heart, label: 'Liked' },
          { 
            href: user ? '/dashboard' : '/login', 
            icon: User, 
            label: user ? 'Account' : 'Profile', 
            onClick: user ? undefined : openLogin 
          },
        ].map(({ href, icon: Icon, label, primary, onClick }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href.split('?')[0]))
          
          const content = (
            <div className={cn('flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors', !primary && (active ? 'text-[var(--primary-500)]' : 'text-[var(--text-tertiary)]'))}>
              {primary ? (
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-6 shadow-lg" style={{ background: 'var(--secondary-500)' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              {!primary && <span className="text-[10px] font-medium">{label}</span>}
            </div>
          )

          if (onClick) {
            return (
              <button key={label} onClick={onClick} className="flex-1">
                {content}
              </button>
            )
          }

          return (
            <Link key={href} href={href} className="flex-1">
              {content}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
