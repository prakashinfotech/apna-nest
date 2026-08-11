import { api } from '@/lib/api'
import { type Locality } from '@/lib/types'
import { LOCALITIES } from '@/lib/constants'

interface BackendLocality {
  id: string
  name: string
  slug: string
  latitude?: number
  longitude?: number
  pinCode?: string
  description?: string
  avgPriceSqft?: number
  cityId: string
  cityName: string
  citySlug: string
  propertyCount: number
}

function adapt(b: BackendLocality): Locality {
  return {
    id:          b.id,
    cityId:      b.cityId,
    slug:        b.slug,
    name:        b.name,
    city:        b.cityName,
    avgPrice:    Math.round(b.avgPriceSqft ?? 8000),
    growth:      '+8.5%',  // static for now — add to DB later
    properties:  b.propertyCount,
    description: b.description ?? `${b.name} is a thriving neighbourhood in ${b.cityName}.`,
    image:       `https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80`,
    highlights:  [],
  }
}


export async function getLocalities(citySlug?: string): Promise<Locality[]> {
  try {
    const qs = citySlug ? `?citySlug=${citySlug}` : ''
    const data = await api.get<BackendLocality[]>(`/localities${qs}`)
    return data.length > 0 ? data.map(adapt) : LOCALITIES
  } catch {
    return LOCALITIES
  }
}

export async function getLocalityBySlug(slug: string): Promise<Locality | null> {
  try {
    const data = await api.get<BackendLocality>(`/localities/${slug}`)
    return adapt(data)
  } catch {
    return LOCALITIES.find(l => l.slug === slug) ?? null
  }
}
