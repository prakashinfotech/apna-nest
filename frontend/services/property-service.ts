import { api } from '@/lib/api'
import type { Property } from '@/lib/data' // We'll keep the type for now until we move it

// Backend DTO shape (enriched via vw_properties view)
interface BackendProperty {
  id: string; ownerId: string; cityId: string; localityId: string
  addressLine?: string; latitude?: number; longitude?: number; pinCode?: string
  propertyTypeId: number; listingIntentId: number
  title: string; description?: string; bhk?: number; bathrooms?: number
  areaSqft: number; floorNumber?: number; totalFloors?: number; ageYears?: number
  price: number; isPriceNegotiable: boolean; maintenancePerMonth?: number
  furnishingStatusId?: number; possessionStatusId?: number; availableFrom?: string
  isReraVerified: boolean; reraNumber?: string; isZeroBrokerage: boolean
  isFeatured: boolean; isActive: boolean; viewCount: number; leadCount: number
  lat?: number; lng?: number
  createdAt: string; updatedAt: string
  cityName: string; citySlug: string; localityName: string; localitySlug: string
  ownerName?: string; ownerPhone?: string; ownerEmail?: string
  images: string[]; amenities: string[]
  propertyTypeName: string; listingIntentName: string
  furnishingLabel: string; possessionLabel: string
}

function adapt(b: BackendProperty): Property {
  return {
    ...b,
    locality: b.localityName, city: b.cityName, type: b.propertyTypeName,
    area: b.areaSqft, bedrooms: b.bhk, isVerified: b.isReraVerified,
    listingType: b.listingIntentId === 1 ? 'buy' : b.listingIntentId === 2 ? 'rent' : 'pg',
    purpose: b.listingIntentId === 1 ? 'buy' : 'rent',
    status: b.possessionLabel ?? 'Ready to Move',
    furnishing: b.furnishingLabel ?? 'Unfurnished',
    address: b.addressLine, postedBy: 'owner', featured: b.isFeatured,
    lat: b.latitude ?? b.lat ?? 0,
    lng: b.longitude ?? b.lng ?? 0,
    description: b.description ?? '',
    views: b.viewCount, isOwnerDirect: true,
    floor: b.floorNumber, totalFloors: b.totalFloors,
    age: b.ageYears != null ? `${b.ageYears} years` : undefined,
    owner: { name: b.ownerName ?? 'Owner', phone: b.ownerPhone ?? '', email: b.ownerEmail ?? '' },
    ownerId: b.ownerId, cityId: b.cityId, localityId: b.localityId,
    localityName: b.localityName, cityName: b.cityName,
    propertyTypeName: b.propertyTypeName, listingIntentName: b.listingIntentName,
    isActive: b.isActive, createdAt: b.createdAt, updatedAt: b.updatedAt,
  }
}

export async function searchProperties(params: { type?: string; city?: string; q?: string; page?: number; pageSize?: number } = {}): Promise<Property[]> {
  try {
    const qs = new URLSearchParams()
    if (params.type)     qs.set('type',     params.type)
    if (params.city)     qs.set('city',     params.city)
    if (params.q)        qs.set('q',        params.q)
    if (params.page)     qs.set('page',     String(params.page))
    if (params.pageSize) qs.set('pageSize', String(params.pageSize ?? 20))
    const data = await api.get<BackendProperty[]>(`/properties?${qs}`)
    return data.map(adapt)
  } catch (error) {
    console.error("Failed to fetch properties", error)
    return []
  }
}

export async function getMyProperties(): Promise<Property[]> {
  try {
    return (await api.get<BackendProperty[]>('/properties/my')).map(adapt)
  } catch (error) {
    console.error("Failed to fetch my properties", error)
    return []
  }
}

export async function getLikedProperties(): Promise<Property[]> {
  try {
    return (await api.get<BackendProperty[]>('/users/me/saved')).map(adapt)
  } catch (error) {
    console.error("Failed to fetch liked properties", error)
    return []
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const data = await api.get<BackendProperty[]>('/properties?pageSize=12')
    const adapted = data.map(adapt)
    return adapted.filter(p => p.isFeatured || p.featured).length > 0
      ? adapted.filter(p => p.isFeatured || p.featured)
      : adapted.slice(0, 6)
  } catch (error) {
    console.error("Failed to fetch featured properties", error)
    return []
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const data = await api.get<BackendProperty>(`/properties/${id}`)
    return adapt(data)
  } catch (error) {
    console.error("Failed to fetch property by id", error)
    return null
  }
}

export async function createProperty(data: any): Promise<Property> {
  const response = await api.post<BackendProperty>('/properties', data);
  return adapt(response);
}

export async function updateProperty(id: string, data: any): Promise<Property> {
  const response = await api.put<BackendProperty>(`/properties/${id}`, data);
  return adapt(response);
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
}

