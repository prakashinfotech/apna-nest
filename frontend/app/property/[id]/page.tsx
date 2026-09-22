'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  MapPin, Bed, Bath, Maximize2, Shield, Heart, Share2, 
  ChevronRight, Check, Info, Phone, Mail,
  Calendar, Compass, Layers, Zap, Clock, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, cn } from '@/lib/utils'
import { type Property } from '@/lib/types'
import { getPropertyById } from '@/services/property-service'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Navbar } from '@/components/navbar'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/search/map-view').then(mod => mod.MapView), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Loading Map...</div>
})

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [enquiring, setEnquiring] = useState(false)

  useEffect(() => {
    getPropertyById(id)
      .then(p => { if (p) setProperty(p as unknown as Property) })
      .finally(() => setLoading(false))
  }, [id])

  const handleEnquire = async () => {
    const { user, openLogin } = useAuthStore.getState()
    
    if (!user) {
      toast.error('Please login to send an enquiry')
      openLogin()
      return
    }
    
    if (!property) return
    setEnquiring(true)
    
    try {
      await api.post('/leads', { 
        propertyId: property.id, 
        buyerName:  user.name,
        buyerPhone: user.phone || '0000000000', // Fallback if phone missing
        buyerEmail: user.email,
        message:    'Interested in this property. Please contact me.' 
      })
      toast.success('Enquiry sent! The owner will contact you soon.')
    } catch (err: unknown) {
      const errorMsg = (err as any)?.response?.data?.error || 'Failed to send enquiry. Please try again.'
      toast.error(errorMsg)
    } finally {
      setEnquiring(false)
    }
  }


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-500)]" />
        </div>
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-serif font-bold mb-4">Property not found</h1>
          <Button onClick={() => router.push('/search')}>Back to Search</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-24 bg-slate-50/50">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-[var(--primary-500)] transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/search?type=${property.listingIntentId === 1 ? 'buy' : 'rent'}`} className="hover:text-[var(--primary-500)] transition-colors">
          {property.cityName}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate">{property.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="px-3 py-0.5 rounded-full uppercase tracking-wider text-[10px] font-bold">
                {property.propertyTypeName}
              </Badge>
              {property.isVerified && (
                <Badge variant="verified" className="gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
              <MapPin className="h-4 w-4 text-[var(--primary-500)]" />
              <span>{property.addressLine || `${property.localityName}, ${property.cityName}`}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-3xl md:text-4xl font-serif font-bold text-[var(--primary-600)]">
              {formatPrice(property.price, property.listingIntentId === 2 ? 'rent' : 'buy')}
            </div>
            {property.listingIntentId === 1 && (
              <div className="text-sm text-slate-500">
                ₹{Math.round(property.price / property.areaSqft).toLocaleString('en-IN')}/sq.ft
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("rounded-full h-10 w-10 transition-all", isSaved && "bg-red-50 text-red-500 border-red-100")}
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10 h-[300px] md:h-[500px]">
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden group">
            <Image
              src={property.images[activeImage]}
              alt={property.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              priority
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeImage === idx ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
              <Image
                src={property.images[1] || property.images[0]}
                alt="View 2"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
              <Image
                src={property.images[2] || property.images[0]}
                alt="View 3"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold group-hover:bg-black/20 transition-all">
                +{property.images.length - 2} Photos
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">BHK Type</span>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Bed className="h-4 w-4 text-[var(--primary-500)]" />
                  {property.bhk} BHK
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bathrooms</span>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Bath className="h-4 w-4 text-[var(--primary-500)]" />
                  {property.bathrooms} Baths
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Area</span>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Maximize2 className="h-4 w-4 text-[var(--primary-500)]" />
                  {property.areaSqft.toLocaleString('en-IN')} sq.ft
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Ready to Move
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-slate-900">About this Property</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 pt-2">
                {[
                  { icon: Compass, label: "Facing", value: "East Facing" },
                  { icon: Layers, label: "Floor", value: "5th of 12 floors" },
                  { icon: Calendar, label: "Age", value: "2 Years" },
                  { icon: Clock, label: "Available", value: "Immediate" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-700">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-slate-900">Premium Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[var(--primary-200)] hover:bg-[var(--primary-50)] transition-all group">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary-500)]/10 flex items-center justify-center group-hover:bg-[var(--primary-500)]/20 transition-colors">
                      <Check className="h-3 w-3 text-[var(--primary-500)]" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-slate-900">Location & Neighborhood</h2>
                <Button variant="ghost" size="sm" className="text-[var(--primary-600)] font-bold text-xs uppercase">Open in Google Maps</Button>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-100">
                <MapView properties={[property]} />
              </div>
            </section>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="sticky top-24 p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-500)] flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-[var(--primary-500)]/20">
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900">{property.owner.name}</h3>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none h-4 px-1.5 text-[8px]">OWNER</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Typical response: Under 1 hour</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2"
                  onClick={() => setShowPhone(true)}
                >
                  <Phone className="h-4 w-4" />
                  {showPhone
                    ? (property.owner.phone || '+91 98765 XXXXX')
                    : 'Show Phone Number'}
                </Button>
                <Button
                  className="w-full h-12 rounded-xl bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-bold gap-2 shadow-lg shadow-[var(--primary-500)]/20"
                  onClick={handleEnquire}
                  disabled={enquiring}
                >
                  {enquiring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Enquire Now
                </Button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Info className="h-3.5 w-3.5 text-blue-500" />
                  Buying Guide
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Connect directly with the owner to save on brokerage. Ensure you verify RERA documents before payment.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 2 days ago</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="flex items-center gap-1"><Compass className="h-3 w-3" /> 1.2k Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}
