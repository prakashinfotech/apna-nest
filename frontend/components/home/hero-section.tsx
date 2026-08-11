'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Building2, Shield, UserCheck, TrendingUp, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { LOCALITIES } from '@/lib/constants'

const TABS = ['Buy', 'Rent', 'PG', 'Plot', 'Commercial']

const SUGGESTIONS = [
  'Bopal, Ahmedabad', 'SG Highway, Ahmedabad', 'Vastrapur, Ahmedabad',
  'Whitefield, Bangalore', 'Koramangala, Bangalore', 'Hinjewadi, Pune',
  'Bandra West, Mumbai', 'Gachibowli, Hyderabad', 'Powai, Mumbai',
  'Sector 62, Noida', 'Hauz Khas, Delhi', 'OMR, Chennai',
]

// Dynamic trending keywords derived from LOCALITIES + enriched with property-type keywords
function useTrendingKeywords(activeTab: string) {
  const [keywords, setKeywords] = useState<string[]>([])

  useEffect(() => {
    // Build keywords dynamically from locality data
    const localityKeywords = LOCALITIES.map(l => `${l.name}, ${l.city}`)
    
    // Add tab-specific context keywords
    const tabKeywords: Record<string, string[]> = {
      'Buy': ['New Projects', 'RERA Verified', 'Under ₹1 Cr'],
      'Rent': ['Zero Brokerage', 'Furnished Homes', 'Owner Direct'],
      'PG': ['Co-living Spaces', 'Boys PG', 'Girls PG'],
      'Plot': ['RERA Plots', 'Farm Land', 'NA Plots'],
      'Commercial': ['Office Space', 'Shops', 'Co-working'],
    }

    const combined = [...localityKeywords, ...(tabKeywords[activeTab] || [])]
    // Shuffle for a fresh feel every render
    const shuffled = combined.sort(() => Math.random() - 0.5).slice(0, 5)
    setKeywords(shuffled)
  }, [activeTab])

  return keywords
}

export function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Buy')
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const trendingKeywords = useTrendingKeywords(activeTab)

  const filtered = query
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS.slice(0, 6)

  const handleSearch = (q?: string) => {
    const searchQuery = q || query
    const typeMap: Record<string, string> = {
      'Buy': 'buy', 'Rent': 'rent', 'PG': 'pg', 'Plot': 'buy', 'Commercial': 'buy',
    }
    const type = typeMap[activeTab]
    const propertyType = activeTab === 'Plot' ? '&propertyType=plot' : activeTab === 'Commercial' ? '&propertyType=commercial' : ''
    router.push(`/search?type=${type}${propertyType}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)
    setShowSuggestions(false)
  }

  return (
    <section className="relative w-full min-h-[650px] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Luxury Apartment"
          fill
          className="object-cover"
          priority
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Find the place where <br/>
          <span className="gradient-text">life happens.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          India's most trusted real estate platform. Verified listings, zero brokerage, and direct owner contact.
        </p>

        {/* Centered Search Card */}
        <div className="bg-white rounded-3xl p-2 md:p-4 shadow-2xl shadow-black/40 w-full max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center md:justify-start gap-1 mb-4 border-b border-slate-100 pb-2 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-[var(--primary-50)] text-[var(--primary-600)]" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input Area */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-500)] transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={`Search city, locality or project for ${activeTab}...`}
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:ring-2 focus:ring-[var(--primary-500)] transition-all outline-none"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden text-left">
                  <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {query ? 'Search Results' : 'Popular Localities'}
                  </div>
                  {filtered.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              className="w-full md:w-auto px-8 py-4 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[var(--primary-500)]/20"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          {/* Dynamic Trending Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400 mr-1">
              <Sparkles className="w-3 h-3" />
              Trending:
            </span>
            {trendingKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleSearch(keyword)}
                className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] text-slate-600 rounded-lg transition-colors border border-slate-100 hover:border-[var(--primary-200)]"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">50,000+</div>
            <div className="text-xs text-slate-400">Verified Listings</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">Zero Brokerage</div>
            <div className="text-xs text-slate-400">Direct Owner Contact</div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">RERA Verified</div>
            <div className="text-xs text-slate-400">100% Secure Deals</div>
          </div>
        </div>
      </div>
    </section>
  )
}
