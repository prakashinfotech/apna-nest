'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, MapPin, IndianRupee, Image as ImageIcon,
  CheckCircle2, ChevronRight, ChevronLeft, Loader2, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROPERTY_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { createProperty } from '@/services/property-service'
import { api } from '@/lib/api'

interface ApiCity  { id: string; name: string; slug: string }
interface ApiLocality { id: string; name: string; slug: string; city_id: string }

const formSchema = z.object({
  propertyTypeId: z.string().min(1, 'Required'),
  listingIntentId: z.string().min(1, 'Required'),
  cityId: z.string().min(1, 'Select a city'),
  localityId: z.string().min(1, 'Select a locality'),
  title: z.string().min(10, 'Title must be at least 10 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().min(1000, 'Price must be at least ₹1,000'),
  areaSqft: z.coerce.number().min(1, 'Area must be at least 1 sq.ft'),
  bhk: z.coerce.number().min(0).max(20).optional(),
  bathrooms: z.coerce.number().min(0).max(20).optional(),
  addressLine: z.string().min(5, 'Address is required'),
})

type FormData = z.infer<typeof formSchema>

const STEPS = [
  { id: 'basic',    label: 'Basic Info',        icon: Building2     },
  { id: 'details',  label: 'Property Details',  icon: IndianRupee   },
  { id: 'location', label: 'Location & Photos', icon: MapPin        },
  { id: 'finish',   label: 'Finish',            icon: CheckCircle2  },
]



export function PropertyFormWizard() {
  const [currentStep, setCurrentStep]   = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages]             = useState<string[]>([])
  const [isUploading, setIsUploading]   = useState(false)
  const [cities, setCities]             = useState<ApiCity[]>([])
  const [localities, setLocalities]     = useState<ApiLocality[]>([])
  const [loadingLoc, setLoadingLoc]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyTypeId: '1',
      listingIntentId: '1',
      cityId: '',
      localityId: '',
      bhk: 2,
      bathrooms: 2,
      price: 0,
      areaSqft: 0,
    },
  })

  const selectedCityId = watch('cityId')

  // Fetch cities on mount
  useEffect(() => {
    api.get<ApiCity[]>('/cities')
      .then(data => {
        setCities(data)
        if (data.length > 0) setValue('cityId', data[0].id)
      })
      .catch(() => {})
  }, [])

  // Fetch localities when city changes
  useEffect(() => {
    if (!selectedCityId) return
    setLoadingLoc(true)
    setValue('localityId', '')
    api.get<ApiLocality[]>(`/localities?cityId=${selectedCityId}`)
      .then(data => { setLocalities(data); setLoadingLoc(false) })
      .catch(() => { setLoadingLoc(false) })
  }, [selectedCityId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setIsUploading(true)
    const newImages: string[] = []
    for (let i = 0; i < files.length && i < 5; i++) {
      const reader = new FileReader()
      const base64 = await new Promise<string>(res => {
        reader.onload = () => res(reader.result as string)
        reader.readAsDataURL(files[i])
      })
      newImages.push(base64)
    }
    setImages(prev => [...prev, ...newImages].slice(0, 10))
    setIsUploading(false)
  }

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

  const nextStep = async () => {
    const fieldsByStep: (keyof FormData)[][] = [
      ['propertyTypeId', 'listingIntentId', 'cityId', 'localityId'],
      ['title', 'description', 'price', 'areaSqft'],
      ['addressLine'],
    ]
    const valid = await trigger(fieldsByStep[currentStep])
    if (valid) setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0))

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      // Send only URL strings — skip base64 images (no upload endpoint)
      const urlImages = images.filter(img => img.startsWith('http'))
      await createProperty({
        propertyTypeId:  Number(data.propertyTypeId),
        listingIntentId: Number(data.listingIntentId),
        title:           data.title,
        description:     data.description,
        price:           Number(data.price),
        areaSqft:        Number(data.areaSqft),
        bhk:             data.bhk ?? null,
        bathrooms:       data.bathrooms ?? null,
        addressLine:     data.addressLine,
        cityId:          data.cityId,
        localityId:      data.localityId,
        isActive:        true,
        isZeroBrokerage: true,
        isReraVerified:  false,
        isFeatured:      false,
        imageUrls:       urlImages,
      })
      setCurrentStep(3)
    } catch (err: any) {
      alert(err?.message ?? 'Failed to submit property. Please ensure you are logged in and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">Back to Home</span>
        </Link>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ApnaNest</p>
          <p className="text-xs font-bold text-slate-900">List Your Property</p>
        </div>
      </div>

      {/* Progress */}
      <div className="relative mb-12 flex justify-between">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[var(--primary-500)] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon
          const isActive  = idx <= currentStep
          const isCurrent = idx === currentStep
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2',
                isActive ? 'bg-[var(--primary-500)] border-[var(--primary-500)] text-white' : 'bg-white border-slate-200 text-slate-400',
                isCurrent && 'ring-4 ring-[var(--primary-500)]/20',
              )}>
                <StepIcon className="h-5 w-5" />
              </div>
              <span className={cn('text-[10px] font-bold uppercase tracking-wider', isActive ? 'text-slate-900' : 'text-slate-400')}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Basic Info ── */}
              {currentStep === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Let's start with the basics</h2>
                    <p className="text-slate-500">Select property type, intent, and city.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">Listing Intent</Label>
                      <RadioGroup defaultValue="1" onValueChange={v => setValue('listingIntentId', v)} className="flex gap-4">
                        <div className="flex items-center space-x-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                          <RadioGroupItem value="1" id="intent-buy" />
                          <Label htmlFor="intent-buy" className="font-bold cursor-pointer">Sell Property</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                          <RadioGroupItem value="2" id="intent-rent" />
                          <Label htmlFor="intent-rent" className="font-bold cursor-pointer">Rent Out</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">Property Type</Label>
                      <Select defaultValue="1" onValueChange={v => setValue('propertyTypeId', v)}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">City</Label>
                      <Select value={selectedCityId} onValueChange={v => setValue('cityId', v)}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder={cities.length === 0 ? 'Loading cities…' : 'Select city'} />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.cityId && <p className="text-xs text-red-500 font-medium">{errors.cityId.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-bold text-xs uppercase text-slate-400 tracking-widest">Locality</Label>
                      <Select value={watch('localityId')} onValueChange={v => setValue('localityId', v)} disabled={!selectedCityId || loadingLoc}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder={loadingLoc ? 'Loading…' : 'Select locality'} />
                        </SelectTrigger>
                        <SelectContent>
                          {localities.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.localityId && <p className="text-xs text-red-500 font-medium">{errors.localityId.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Details ── */}
              {currentStep === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Property Details</h2>
                    <p className="text-slate-500">Provide accurate information to attract serious buyers/tenants.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold text-xs uppercase text-slate-400">Property Title</Label>
                      <Input id="title" {...register('title')} placeholder="e.g. Luxury 3BHK Apartment in Prahlad Nagar" className="h-12 rounded-xl" />
                      {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="font-bold text-xs uppercase text-slate-400">Price (₹)</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input id="price" type="number" {...register('price')} placeholder="0" className="h-12 pl-10 rounded-xl" />
                        </div>
                        {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area" className="font-bold text-xs uppercase text-slate-400">Area (sq.ft)</Label>
                        <Input id="area" type="number" {...register('areaSqft')} placeholder="0" className="h-12 rounded-xl" />
                        {errors.areaSqft && <p className="text-xs text-red-500 font-medium">{errors.areaSqft.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bhk" className="font-bold text-xs uppercase text-slate-400">BHK</Label>
                        <Input id="bhk" type="number" {...register('bhk')} className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms" className="font-bold text-xs uppercase text-slate-400">Bathrooms</Label>
                        <Input id="bathrooms" type="number" {...register('bathrooms')} className="h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-bold text-xs uppercase text-slate-400">Description</Label>
                      <Textarea id="description" {...register('description')} placeholder="Describe the property features, neighborhood, etc." className="min-h-[120px] rounded-xl py-3" />
                      {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Location & Photos ── */}
              {currentStep === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Location & Photos</h2>
                    <p className="text-slate-500">Add detailed address and property photos.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine" className="font-bold text-xs uppercase text-slate-400">Detailed Address</Label>
                      <Input id="addressLine" {...register('addressLine')} placeholder="House no, Street name, Landmark, etc." className="h-12 rounded-xl" />
                      {errors.addressLine && <p className="text-xs text-red-500 font-medium">{errors.addressLine.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <Label className="font-bold text-xs uppercase text-slate-400">Property Photos (optional, max 10)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={img} alt="Property" className="object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {images.length < 10 && (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Add Photo</span>
                          </div>
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                      {isUploading && <p className="text-xs text-[var(--primary-500)] font-medium">Processing images…</p>}
                      <p className="text-xs text-slate-400">Photos will be visible after admin review. You can add them later from your dashboard.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Success ── */}
              {currentStep === 3 && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Property Listed Successfully!</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Your property is now live on ApnaNest. Track views and enquiries from your dashboard.
                    </p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="button" onClick={() => router.push('/dashboard/listings')} className="rounded-xl h-12 px-8 bg-slate-900 text-white font-bold">
                      Go to My Listings
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/')} className="rounded-xl h-12 px-8 font-bold">
                      Home
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentStep < 3 && (
            <div className="p-6 md:px-12 md:pb-12 bg-slate-50/50 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn('rounded-xl h-12 px-6 font-bold', currentStep === 0 && 'opacity-0')}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep === STEPS.length - 2 ? (
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="rounded-xl h-12 px-8 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-bold shadow-lg shadow-[var(--primary-500)]/20"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Submit Listing
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="rounded-xl h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
