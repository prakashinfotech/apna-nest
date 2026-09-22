// ── lib/types.ts ─────────────────────────────────────────────────────────────

export interface Property {
  // DB-aligned identifiers
  id:           string
  ownerId:      string
  cityId:       string
  localityId:   string

  // Descriptive
  title:        string
  description:  string
  addressLine?: string

  // Geo
  lat:          number
  lng:          number
  pinCode?:     string

  // Lookup IDs
  propertyTypeId:   number   // 1=apt 2=villa 3=plot 4=pg 5=commercial 6=studio 7=builder_floor
  listingIntentId:  number   // 1=buy 2=rent 3=pg
  furnishingStatusId?: number // 1=unfurnished 2=semi 3=fully
  possessionStatusId?: number // 1=ready 2=under_const 3=new_launch

  // Numerics
  price:     number
  areaSqft:  number
  bhk?:      number
  bathrooms?: number
  floor?:    number
  totalFloors?: number

  // Flags
  isReraVerified:  boolean
  isZeroBrokerage: boolean
  isOwnerDirect?:  boolean
  isActive:        boolean
  isFeatured?:     boolean

  // Timestamps
  createdAt:  string
  updatedAt:  string

  // UI enrichment (populated by API joins)
  images:       string[]
  amenities:    string[]
  owner:        { name: string; phone: string; email: string }
  localityName: string
  cityName:     string
  propertyTypeName: string
  listingIntentName: string

  // Extended detail fields
  facing?:     string
  parking?:    string
  age?:        string
  reraNumber?: string
  deposit?:    number
  maintenanceCharge?: number
  availableFrom?: string
  societyName?: string
  views?:      number
  postedOn?:   string

  // Legacy aliases (deprecated but kept for compatibility)
  locality?:    string
  city?:        string
  type?:        string
  area?:        number
  bedrooms?:    number
  isVerified?: boolean
  listingType?: string
  purpose?:     string
  status?:      string
  furnishing?: string
  postedBy?:   string
  featured?:   boolean
  address?:    string
}

export interface Locality {
  id: string
  cityId: string
  name: string
  city: string
  slug: string
  avgPrice: number
  properties: number
  growth: string
  description: string
  image: string
  avgRent?: number
  highlights: string[]
}

