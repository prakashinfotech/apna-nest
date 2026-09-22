'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, Share2, MapPin, Bed, Bath, Square, Calendar, Home, Compass,
  Building2, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight,
  TrendingUp, Train, School, Hospital, ShoppingBag, Shield, UserCheck,
  Tag, Copy, MessageCircle, Eye, Maximize2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PropertyCard } from '@/components/property-card'
import { formatPrice } from '@/lib/utils'
import { type Property } from '@/lib/types'
import { cn } from '@/lib/utils'
import { submitLead } from '@/services/lead-service'
import { searchProperties } from '@/services/property-service'
import { api } from '@/lib/api'

import { useAuthStore } from '@/lib/stores/auth-store'

export function PropertyDetail({ property }: { property: Property }) {
  const { user } = useAuthStore()
  const [imageIndex, setImageIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const [similar, setSimilar] = useState<Property[]>([])
  const [showPhone, setShowPhone] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: `I'm interested in ${property.title}. Please contact me.` })
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [enquiryDone, setEnquiryDone] = useState(false)
  const [loanAmount, setLoanAmount] = useState(property.price * 0.8)

  const [enquiryError, setEnquiryError] = useState('')

  const isOwner = user?.id === property.ownerId

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isOwner) { setEnquiryError("You cannot enquire on your own property."); return }
    if (!enquiryForm.name.trim()) { setEnquiryError('Please enter your name.'); return }
    if (!enquiryForm.phone.trim()) { setEnquiryError('Please enter your phone number.'); return }
    setEnquiryLoading(true)
    setEnquiryError('')
    try {
      await submitLead({
        propertyId: property.id,
        buyerName:  enquiryForm.name.trim(),
        buyerEmail: enquiryForm.email.trim(),
        buyerPhone: enquiryForm.phone.trim(),
        message:    enquiryForm.message.trim(),
      })
      setEnquiryDone(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send enquiry. Please try again.'
      setEnquiryError(msg)
    } finally {
      setEnquiryLoading(false)
    }
  }

  const [interest, setInterest] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  // Load state and similar properties
  useEffect(() => {
    // Check if saved
    if (user) {
      api.get<Property[]>('/users/me/saved')
        .then(data => {
          if (data.some((p: Property) => p.id === property.id)) setSaved(true)
        })
        .catch(() => {})
    }

    searchProperties({ type: property.listingType ?? 'buy', pageSize: 8 })
      .then(data => setSimilar(data.filter(p => p.id !== property.id).slice(0, 4)))
      .catch(() => {})
  }, [property.id, property.listingType, user])

  const monthlyRate = interest / 12 / 100
  const months = tenure * 12
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  const totalPayment = emi * months
  const totalInterest = totalPayment - loanAmount

  return (
    <div className="pb-16 lg:pb-0" style={{ background: 'var(--surface-2)' }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <Link href="/" className="hover:text-[var(--primary-500)] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/search?city=${property.city}`} className="hover:text-[var(--primary-500)] transition-colors">{property.city}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/search?q=${property.locality}`} className="hover:text-[var(--primary-500)] transition-colors">{property.locality}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1" style={{ color: 'var(--text-primary)' }}>{property.title}</span>
          </div>
        </div>
      </div>

      {/* Image gallery */}
      <div className="bg-[var(--text-primary)]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[440px]">
            {/* Main image */}
            <div className="md:col-span-3 relative rounded-xl overflow-hidden group">
              <Image
                src={property.images[imageIndex] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i === 0 ? property.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i === property.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                {imageIndex + 1} / {property.images.length}
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {(property.views ?? 0).toLocaleString('en-IN')} views
                </span>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="hidden md:grid grid-rows-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i < property.images.length ? i : 0)}
                  className={cn('relative rounded-xl overflow-hidden transition', imageIndex === i ? 'ring-2 ring-[var(--primary-500)]' : 'opacity-70 hover:opacity-100')}
                >
                  <Image
                    src={property.images[i] || property.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {i === 2 && property.images.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                      +{property.images.length - 3} more
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <Card>
              <CardContent className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {property.isVerified && (
                    <Badge variant="verified" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      RERA Verified
                    </Badge>
                  )}
                  {property.isOwnerDirect && (
                    <Badge variant="outline" className="gap-1">
                      <UserCheck className="h-3 w-3" />
                      Owner Direct
                    </Badge>
                  )}
                  {property.isZeroBrokerage && (
                    <Badge variant="zero" className="gap-1">
                      <Tag className="h-3 w-3" />
                      Zero Brokerage
                    </Badge>
                  )}
                  <Badge variant="secondary">{property.listingType === 'buy' ? 'For Sale' : property.listingType === 'pg' ? 'PG' : 'For Rent'}</Badge>
                  <Badge variant="secondary">{property.type}</Badge>
                </div>

                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--primary-500)' }} />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isOwner && (
                      <button
                        onClick={async () => {
                          const next = !saved
                          setSaved(next)
                          try {
                            if (next) await api.post(`/properties/${property.id}/save`, {})
                            else await api.delete(`/properties/${property.id}/save`)
                          } catch { setSaved(!next) }
                        }}
                        className={cn(
                          'h-10 w-10 rounded-xl border flex items-center justify-center transition',
                          saved ? 'border-red-500 bg-red-50 text-red-500' : 'border-border hover:border-[var(--primary-500)]'
                        )}
                        title={saved ? 'Unlike' : 'Like'}
                      >
                        <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const url = window.location.href
                        if (navigator.share) {
                          navigator.share({ title: property.title, url })
                        } else {
                          navigator.clipboard.writeText(url)
                          // toast.success('Link copied!')
                        }
                      }}
                      className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:border-[var(--primary-500)] transition"
                      title="Share property"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl lg:text-4xl font-serif font-bold price-num" style={{ color: 'var(--text-primary)' }}>
                    {formatPrice(property.price, property.purpose)}
                  </span>
                  {property.purpose === 'buy' && (property.area ?? 0) > 0 && (
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      ₹{Math.round(property.price / (property.area ?? 1)).toLocaleString('en-IN')}/sq.ft
                    </span>
                  )}
                  {property.purpose === 'rent' && property.deposit && (
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Deposit: {formatPrice(property.deposit)}
                    </span>
                  )}
                </div>

                {/* Key specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border">
                  {[
                    { icon: Square, label: 'Area', value: `${(property.area ?? property.areaSqft).toLocaleString('en-IN')} sq.ft` },
                    { icon: Bed, label: 'Bedrooms', value: (property.bedrooms ?? property.bhk ?? 0) > 0 ? `${property.bedrooms ?? property.bhk} BHK` : 'N/A' },
                    { icon: Bath, label: 'Bathrooms', value: (property.bathrooms ?? 0) > 0 ? String(property.bathrooms) : 'N/A' },
                    { icon: Calendar, label: 'Status', value: property.status },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="emi">EMI</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="pt-5 space-y-4">
                    <h2 className="text-xl font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>About this property</h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{property.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {[
                        { icon: Home, label: 'Furnishing', value: property.furnishing },
                        { icon: Compass, label: 'Facing', value: property.facing },
                        { icon: Building2, label: 'Floor', value: (property.totalFloors ?? 0) > 0 ? `${property.floor ?? 0} of ${property.totalFloors}` : 'Ground' },
                        { icon: Calendar, label: 'Age', value: property.age },
                        { icon: CheckCircle2, label: 'Parking', value: property.parking },
                        { icon: Shield, label: 'Posted by', value: property.postedBy },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                          <Icon className="h-5 w-5 shrink-0" style={{ color: 'var(--primary-500)' }} />
                          <div>
                            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
                            <div className="font-medium text-sm capitalize" style={{ color: 'var(--text-primary)' }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {property.reraNumber && (
                      <div className="flex items-center gap-2 p-4 rounded-xl border border-[var(--primary-200)]" style={{ background: 'var(--primary-50)' }}>
                        <Shield className="w-5 h-5 shrink-0" style={{ color: 'var(--primary-500)' }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: 'var(--primary-700)' }}>RERA Registration Number</p>
                          <p className="text-sm font-mono" style={{ color: 'var(--primary-600)' }}>{property.reraNumber}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(property.reraNumber ?? '')
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-[var(--primary-300)] flex items-center gap-1.5 hover:bg-[var(--primary-100)] transition-colors"
                          style={{ color: 'var(--primary-600)' }}
                          title="Copy RERA number"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="amenities" className="pt-5">
                    <h2 className="text-xl font-serif font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Amenities & Features</h2>
                    {property.amenities.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center gap-2 p-3 rounded-xl border border-border">
                            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--primary-500)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No amenities listed for this property.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="location" className="pt-5 space-y-4">
                    <h2 className="text-xl font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>Location & Nearby</h2>
                    <div
                      className="aspect-video rounded-2xl border-2 border-dashed border-[var(--primary-200)] flex items-center justify-center"
                      style={{ background: 'var(--primary-50)' }}
                    >
                      <div className="text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--primary-500)' }} />
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{property.locality}, {property.city}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Interactive map requires Mapbox token</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { icon: Train, label: 'Metro', distance: '1.2 km' },
                        { icon: School, label: 'Schools', distance: '0.5 km' },
                        { icon: Hospital, label: 'Hospitals', distance: '1.5 km' },
                        { icon: ShoppingBag, label: 'Shopping', distance: '0.8 km' },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-xl border border-border text-center">
                          <item.icon className="h-5 w-5 mx-auto mb-2" style={{ color: 'var(--primary-500)' }} />
                          <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{item.distance}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="emi" className="pt-5">
                    <h2 className="text-xl font-serif font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>EMI Calculator</h2>
                    <div className="space-y-5">
                      {[
                        { label: 'Loan Amount', value: loanAmount, min: property.price * 0.1, max: property.price, step: 100000, set: setLoanAmount, display: `₹${(loanAmount / 100000).toFixed(2)} L` },
                        { label: 'Interest Rate', value: interest, min: 6, max: 16, step: 0.1, set: setInterest, display: `${interest}%` },
                        { label: 'Tenure (Years)', value: tenure, min: 1, max: 30, step: 1, set: setTenure, display: `${tenure} yrs` },
                      ].map(({ label, value, min, max, step, set, display }) => (
                        <div key={label}>
                          <div className="flex justify-between text-sm mb-2">
                            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                            <span className="font-semibold" style={{ color: 'var(--primary-500)' }}>{display}</span>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={(e) => set(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: 'var(--primary-500)' }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-6">
                      {[
                        { label: 'Monthly EMI', value: `₹${Math.round(emi).toLocaleString('en-IN')}`, highlight: true },
                        { label: 'Total Interest', value: `₹${(totalInterest / 100000).toFixed(2)} L`, highlight: false },
                        { label: 'Total Payment', value: `₹${(totalPayment / 100000).toFixed(2)} L`, highlight: false },
                      ].map(({ label, value, highlight }) => (
                        <div
                          key={label}
                          className="p-4 rounded-xl text-center"
                          style={{ background: highlight ? 'var(--primary-50)' : 'var(--surface-2)' }}
                        >
                          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
                          <div className="font-bold text-base price-num" style={{ color: highlight ? 'var(--primary-600)' : 'var(--text-primary)' }}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)' }}>
                      * EMI calculated at {interest}% p.a. Interest rates are indicative. Actual rates may vary by lender.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Price trends */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>Price Trends</h2>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      in {property.locality}, {property.city}
                    </p>
                  </div>
                  <Badge className="gap-1" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', border: 'none' }}>
                    <TrendingUp className="h-3 w-3" />
                    +8.2% YoY
                  </Badge>
                </div>
                <PriceTrendChart />
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Owner info */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                    style={{ background: 'var(--primary-500)' }}
                  >
                    {property.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{property.owner.name}</div>
                    <div className="text-xs capitalize" style={{ color: 'var(--text-tertiary)' }}>{property.postedBy}</div>
                  </div>
                  {property.isVerified && (
                    <Shield className="ml-auto w-5 h-5" style={{ color: 'var(--primary-500)' }} />
                  )}
                </div>

                {/* CTA buttons */}
                <div className="space-y-3 mb-5">
                  <Button
                    className="w-full gap-2"
                    style={{ background: 'var(--primary-500)' }}
                    onClick={() => setShowPhone(!showPhone)}
                    disabled={isOwner}
                  >
                    <Phone className="h-4 w-4" />
                    {isOwner ? 'You are the owner' : (showPhone ? property.owner.phone : 'View Phone Number')}
                  </Button>
                  <Button variant="outline" className="w-full gap-2" disabled={isOwner}>
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>

                {/* Enquiry form */}
                {isOwner ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-bold text-slate-900">This is your listing</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">You can manage this property and view its leads from your dashboard.</p>
                    <Link href="/dashboard/listings">
                      <Button size="sm" className="w-full h-9 rounded-xl bg-slate-900 text-white font-bold">Manage Listing</Button>
                    </Link>
                  </div>
                ) : enquiryDone ? (
                  <div className="py-6 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--primary-50)' }}>
                      <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--primary-500)' }} />
                    </div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Enquiry Sent!</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {property.owner.name} will contact you on {enquiryForm.phone} soon.
                    </p>
                    <button onClick={() => setEnquiryDone(false)} className="mt-3 text-xs underline" style={{ color: 'var(--primary-600)' }}>
                      Send another message
                    </button>
                  </div>
                ) : (
                <form className="space-y-3" onSubmit={handleEnquiry}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Send Enquiry</p>
                  <div>
                    <Label htmlFor="enq-name" className="text-xs">Full Name *</Label>
                    <Input id="enq-name" placeholder="Enter your name" className="mt-1 h-9 text-sm"
                      value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="enq-phone" className="text-xs">Phone Number *</Label>
                    <Input id="enq-phone" placeholder="+91 98765 43210" className="mt-1 h-9 text-sm"
                      value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="enq-email" className="text-xs">Email</Label>
                    <Input id="enq-email" type="email" placeholder="you@example.com" className="mt-1 h-9 text-sm"
                      value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="enq-msg" className="text-xs">Message</Label>
                    <Textarea id="enq-msg" rows={3} className="mt-1 text-sm"
                      value={enquiryForm.message} onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })} />
                  </div>
                  {enquiryError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                      ⚠️ {enquiryError}
                    </div>
                  )}
                  <Button type="submit" disabled={enquiryLoading} className="w-full gap-2" style={{ background: 'var(--secondary-500)' }}>
                    <Mail className="h-4 w-4" />
                    {enquiryLoading ? 'Sending…' : 'Send Enquiry'}
                  </Button>
                </form>
                )}

                <p className="text-xs text-center mt-3" style={{ color: 'var(--text-tertiary)' }}>
                  Your info is shared only with the property owner
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PriceTrendChart() {
  const data = [
    { year: '2020', price: 5800 }, { year: '2021', price: 6100 }, { year: '2022', price: 6500 },
    { year: '2023', price: 7000 }, { year: '2024', price: 7400 }, { year: '2025', price: 8000 },
    { year: '2026', price: 8650 },
  ]
  const max = Math.max(...data.map((d) => d.price))
  return (
    <div>
      <div className="flex items-end gap-2 h-36">
        {data.map((d) => (
          <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>₹{d.price}</div>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(d.price / max) * 100}%`,
                background: d.year === '2026' ? 'var(--primary-500)' : 'var(--primary-200)',
              }}
            />
            <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{d.year}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-3" style={{ color: 'var(--text-tertiary)' }}>
        Price per sq.ft over the years
      </p>
    </div>
  )
}
