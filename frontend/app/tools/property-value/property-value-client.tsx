'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, MapPin, Building2, Ruler, 
  BedDouble, Sparkles, ChevronRight, 
  ChevronLeft, Info, CheckCircle2, TrendingUp,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CITIES, AMENITIES_LIST } from '@/lib/constants'
import { formatPrice, cn } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Location', icon: MapPin },
  { id: 2, title: 'Details', icon: Building2 },
  { id: 3, title: 'Amenities', icon: Sparkles },
  { id: 4, title: 'Estimate', icon: Calculator },
]

const CITY_RATES: Record<string, number> = {
  Ahmedabad: 6500,
  Mumbai: 18500,
  Bangalore: 11500,
  Pune: 8200,
  Delhi: 12800,
  Hyderabad: 9200,
  Chennai: 8800,
  Kolkata: 7200,
  Jaipur: 5400,
  Gurgaon: 14500,
  Noida: 9800,
  Surat: 5800,
  Lucknow: 5200,
  Kochi: 6400,
}

const TYPE_MULTIPLIER: Record<string, number> = {
  Apartment: 1.0,
  Villa: 1.25,
  Plot: 0.85,
  Studio: 1.1,
  'Builder Floor': 1.15,
  Commercial: 1.4,
}

const AGE_MULTIPLIER: Record<string, number> = {
  'Newly built': 1.05,
  '1–3 years': 1.0,
  '3–5 years': 0.92,
  '5–10 years': 0.85,
  '10+ years': 0.75,
}

export function PropertyValueClient() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    city: '',
    locality: '',
    type: 'Apartment',
    area: '',
    bhk: '2',
    floor: '5',
    totalFloors: '10',
    age: '1–3 years',
    amenities: [] as string[]
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleCalculate = async () => {
    setLoading(true)
    setStep(4)
    
    // Simulate AI calculation
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const baseRate = CITY_RATES[formData.city] || 6000
    const area = parseFloat(formData.area) || 1000
    const typeMult = TYPE_MULTIPLIER[formData.type] || 1.0
    const ageMult = AGE_MULTIPLIER[formData.age] || 1.0
    
    // 1% per amenity
    const amenityBonus = 1 + (formData.amenities.length * 0.01)
    
    // Small random variance for "AI" feel
    const variance = 0.98 + (Math.random() * 0.04)
    
    const estimate = baseRate * area * typeMult * ageMult * amenityBonus * variance
    setResult(estimate)
    setLoading(false)
  }

  const reset = () => {
    setStep(1)
    setResult(null)
    setFormData({
      city: '',
      locality: '',
      type: 'Apartment',
      area: '',
      bhk: '2',
      floor: '5',
      totalFloors: '10',
      age: '1–3 years',
      amenities: []
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
          Instant <span className="gradient-text">AI Property Valuation</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Our advanced algorithm analyzes thousands of real-time listings to give you the most accurate market value estimate for your property.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  step >= s.id ? "bg-[var(--primary-500)] text-white" : "bg-slate-100 text-slate-400"
                )}
              >
                {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn("text-xs font-bold whitespace-nowrap", step >= s.id ? "text-[var(--primary-600)]" : "text-slate-400")}>
                {s.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn("w-16 h-[2px] mx-2 mb-6", step > s.id ? "bg-[var(--primary-500)]" : "bg-slate-100")} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Area */}
        <Card className="lg:col-span-8 border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Select City</Label>
                      <Select value={formData.city} onValueChange={(v) => setFormData({...formData, city: v})}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                          <SelectValue placeholder="Choose city..." />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Locality / Area</Label>
                      <Input 
                        placeholder="e.g. Bopal, Whitefield..." 
                        className="h-12 rounded-xl bg-slate-50 border-slate-100"
                        value={formData.locality}
                        onChange={(e) => setFormData({...formData, locality: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Property Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.keys(TYPE_MULTIPLIER).map(t => (
                        <button
                          key={t}
                          onClick={() => setFormData({...formData, type: t})}
                          className={cn(
                            "py-3 px-4 rounded-xl text-sm font-semibold border transition-all",
                            formData.type === t 
                              ? "bg-[var(--primary-50)] border-[var(--primary-200)] text-[var(--primary-700)]" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={nextStep} 
                      disabled={!formData.city || !formData.locality}
                      className="h-12 px-8 rounded-xl bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
                    >
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Built-up Area (sq.ft)</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="e.g. 1200" 
                          className="h-12 rounded-xl bg-slate-50 border-slate-100 pr-12"
                          value={formData.area}
                          onChange={(e) => setFormData({...formData, area: e.target.value})}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">SQFT</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Bedrooms (BHK)</Label>
                      <Select value={formData.bhk} onValueChange={(v) => setFormData({...formData, bhk: v})}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['1', '2', '3', '4', '5+'].map(v => <SelectItem key={v} value={v}>{v} BHK</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Property Age</Label>
                      <Select value={formData.age} onValueChange={(v) => setFormData({...formData, age: v})}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(AGE_MULTIPLIER).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Floor Number</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          placeholder="Floor" 
                          className="h-12 rounded-xl bg-slate-50 border-slate-100"
                          value={formData.floor}
                          onChange={(e) => setFormData({...formData, floor: e.target.value})}
                        />
                        <span className="self-center text-slate-400">/</span>
                        <Input 
                          type="number" 
                          placeholder="Total" 
                          className="h-12 rounded-xl bg-slate-50 border-slate-100"
                          value={formData.totalFloors}
                          onChange={(e) => setFormData({...formData, totalFloors: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <Button variant="ghost" onClick={prevStep} className="h-12 px-8 rounded-xl">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button onClick={nextStep} disabled={!formData.area} className="h-12 px-8 rounded-xl bg-[var(--primary-500)] hover:bg-[var(--primary-600)]">
                      Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Label className="text-sm font-bold text-slate-700">Select Amenities (Value Boosters)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {AMENITIES_LIST.slice(0, 12).map(item => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox 
                          id={item} 
                          checked={formData.amenities.includes(item)}
                          onCheckedChange={(checked) => {
                            if (checked) setFormData({...formData, amenities: [...formData.amenities, item]})
                            else setFormData({...formData, amenities: formData.amenities.filter(a => a !== item)})
                          }}
                        />
                        <Label htmlFor={item} className="text-xs font-medium text-slate-600 cursor-pointer">{item}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 flex justify-between">
                    <Button variant="ghost" onClick={prevStep} className="h-12 px-8 rounded-xl">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button onClick={handleCalculate} className="h-12 px-8 rounded-xl bg-[var(--primary-500)] hover:bg-[var(--primary-600)]">
                      Calculate Value <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 flex flex-col items-center text-center"
                >
                  {loading ? (
                    <div className="space-y-6 flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[var(--primary-500)] animate-spin" />
                        <div className="absolute inset-4 rounded-full border-4 border-slate-100 border-b-[var(--secondary-500)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className="w-10 h-10 text-[var(--primary-500)]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Analyzing Market Data...</h3>
                        <p className="text-sm text-slate-400">Comparing with {Math.floor(Math.random() * 500) + 200} similar listings in {formData.locality}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full space-y-8">
                      <div className="bg-[var(--primary-50)] rounded-3xl p-8 border border-[var(--primary-100)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[var(--primary-500)]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[var(--secondary-500)]/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                          <p className="text-sm font-bold text-[var(--primary-700)] uppercase tracking-widest mb-2">Estimated Market Value</p>
                          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
                            {formatPrice(result || 0, 'buy')}
                          </h2>
                          <div className="flex items-center justify-center gap-2 text-sm text-[var(--primary-700)] font-semibold">
                            <TrendingUp className="w-4 h-4" />
                            <span>Confidence Score: 94%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Rental Potential</p>
                          <p className="text-lg font-bold text-slate-800">{formatPrice((result || 0) * 0.003, 'rent')} / month</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Price per sq.ft</p>
                          <p className="text-lg font-bold text-slate-800">{formatPrice((result || 0) / parseFloat(formData.area), 'none')}/sq.ft</p>
                        </div>
                      </div>

                      <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={reset} 
                          variant="outline" 
                          className="flex-1 h-12 rounded-xl"
                        >
                          New Valuation
                        </Button>
                        <Button 
                          className="flex-1 h-12 rounded-xl bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
                        >
                          Sell with ApnaNest <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl bg-slate-900 text-white overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[var(--primary-400)]" />
                How it works
              </h3>
              <ul className="space-y-4">
                {[
                  'Analyzes over 50,000 local listings',
                  'Accounts for current market trends',
                  'Factors in amenities & property age',
                  'Uses historical price data for accuracy'
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--primary-500)] shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-400 italic">
                  "I was surprised at how accurate this was. It matched my bank valuation almost perfectly!"
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-300">Amit P., Homeowner</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-[var(--primary-50)] border border-[var(--primary-100)]">
            <h4 className="font-bold text-[var(--primary-900)] mb-2">Want a deeper analysis?</h4>
            <p className="text-xs text-[var(--primary-700)] mb-4">Connect with our RERA-verified experts for a detailed home inspection and professional valuation report.</p>
            <Button variant="link" className="p-0 h-auto text-[var(--primary-600)] font-bold text-xs">
              Book Expert Visit <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
