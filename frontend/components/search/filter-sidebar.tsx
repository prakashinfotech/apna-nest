'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FilterState {
  type: string
  propertyType: string
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  bhk: number[]
  furnishing: string[]
  amenities: string[]
  ownerDirect: boolean
  verified: boolean
  zeroBrokerage: boolean
  facing: string[]
  status: string[]
}

interface FilterSidebarProps {
  filters: FilterState
  onChange: (key: keyof FilterState, value: unknown) => void
}

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'PG', 'Commercial', 'Builder Floor', 'Studio']
const BHK_OPTIONS = [1, 2, 3, 4, 5]
const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished']
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West']
const STATUS_OPTIONS = ['Ready to move', 'Under construction', 'Newly built']
const AMENITIES = [
  'Swimming Pool', 'Gymnasium', 'Clubhouse', 'Power Backup', 'Lift',
  '24x7 Security', 'Garden', 'Kids Play Area', 'Tennis Court',
  'WiFi', 'Air Conditioner', 'CCTV', 'EV Charging', 'Jogging Track',
]
const BUDGET_RANGES_BUY = [
  { label: 'Under ₹30L', min: 0, max: 3000000 },
  { label: '₹30L – ₹60L', min: 3000000, max: 6000000 },
  { label: '₹60L – ₹1Cr', min: 6000000, max: 10000000 },
  { label: '₹1Cr – ₹2Cr', min: 10000000, max: 20000000 },
  { label: '₹2Cr+', min: 20000000, max: 999999999 },
]
const BUDGET_RANGES_RENT = [
  { label: 'Under ₹10K', min: 0, max: 10000 },
  { label: '₹10K – ₹20K', min: 10000, max: 20000 },
  { label: '₹20K – ₹40K', min: 20000, max: 40000 },
  { label: '₹40K+', min: 40000, max: 999999 },
]

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border pb-5 mb-5 last:border-b-0 last:mb-0 last:pb-0">
      <button
        className="flex items-center justify-between w-full mb-3"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        )}
      </button>
      {open && children}
    </div>
  )
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]

  const budgetRanges = filters.type === 'rent' ? BUDGET_RANGES_RENT : BUDGET_RANGES_BUY

  return (
    <div className="bg-white rounded-2xl p-5 border border-border" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <h3 className="font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Filters</h3>

      {/* Property Type */}
      <Section title="Property Type">
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange('propertyType', filters.propertyType === type.toLowerCase() ? '' : type.toLowerCase())}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={
                filters.propertyType === type.toLowerCase()
                  ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' }
                  : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }
              }
            >
              {type}
            </button>
          ))}
        </div>
      </Section>

      {/* BHK */}
      {filters.type !== 'pg' && (
        <Section title="BHK / Bedrooms">
          <div className="flex gap-2 flex-wrap">
            {BHK_OPTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onChange('bhk', toggleArrayItem(filters.bhk, b))}
                className="w-10 h-10 rounded-xl text-sm font-semibold border transition-all"
                style={
                  filters.bhk.includes(b)
                    ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' }
                    : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                }
              >
                {b}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onChange('bhk', toggleArrayItem(filters.bhk, 6))}
              className="px-3 h-10 rounded-xl text-sm font-semibold border transition-all"
              style={
                filters.bhk.includes(6)
                  ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' }
                  : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }
              }
            >
              5+
            </button>
          </div>
        </Section>
      )}

      {/* Budget */}
      <Section title="Budget">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>
                {filters.type === 'rent' ? 'Min (₹)' : 'Min (₹L)'}
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onChange('minPrice', Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2"
                style={{ color: 'var(--text-primary)' }}
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>
                {filters.type === 'rent' ? 'Max (₹)' : 'Max (₹L)'}
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onChange('maxPrice', Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Any"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {budgetRanges.map((range) => (
              <button
                key={range.label}
                type="button"
                onClick={() => { onChange('minPrice', range.min); onChange('maxPrice', range.max) }}
                className="px-2.5 py-1 rounded-full text-xs border border-border hover:border-[var(--primary-500)] hover:text-[var(--primary-600)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Area */}
      <Section title="Area (sq.ft)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={filters.minArea}
            onChange={(e) => onChange('minArea', Number(e.target.value))}
            placeholder="Min"
            className="w-full min-w-0 h-9 px-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2"
            style={{ color: 'var(--text-primary)' }}
          />
          <input
            type="number"
            value={filters.maxArea}
            onChange={(e) => onChange('maxArea', Number(e.target.value))}
            placeholder="Max"
            className="w-full min-w-0 h-9 px-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </Section>

      {/* Furnishing */}
      <Section title="Furnishing" defaultOpen={false}>
        <div className="space-y-2">
          {FURNISHING_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.furnishing.includes(f)}
                onChange={() => onChange('furnishing', toggleArrayItem(filters.furnishing, f))}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--primary-500)' }}
              />
              <span className="text-sm group-hover:text-[var(--primary-600)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                {f}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Listing Type toggles */}
      <Section title="Listing Type">
        <div className="space-y-3">
          {[
            { key: 'ownerDirect' as const, label: 'Owner Direct', desc: 'No broker involvement' },
            { key: 'verified' as const, label: 'Verified Listings', desc: 'Manually checked by team' },
            { key: 'zeroBrokerage' as const, label: 'Zero Brokerage', desc: 'Save on brokerage fees' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => onChange(key, !filters[key])}
                className="relative w-11 h-6 rounded-full transition-colors shrink-0"
                style={{ background: filters[key] ? 'var(--primary-500)' : 'var(--border)' }}
                role="switch"
                aria-checked={filters[key]}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: filters[key] ? 'translateX(20px)' : 'translateX(2px)' }}
                />
              </button>
            </label>
          ))}
        </div>
      </Section>

      {/* Status */}
      <Section title="Possession Status" defaultOpen={false}>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.status.includes(s)}
                onChange={() => onChange('status', toggleArrayItem(filters.status, s))}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--primary-500)' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Amenities */}
      <Section title="Amenities" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onChange('amenities', toggleArrayItem(filters.amenities, a))}
              className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
              style={
                filters.amenities.includes(a)
                  ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' }
                  : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }
              }
            >
              {a}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}
