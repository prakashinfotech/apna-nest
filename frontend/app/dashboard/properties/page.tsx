'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, Plus, Search, MoreHorizontal, 
  Edit2, Eye, Trash2, Power, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import type { Property } from '@/lib/types'
import { getMyProperties } from '@/services/property-service'
import { formatPrice, cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMyProperties().then(setProperties).catch(() => setProperties([]))
  }, [])

  const filtered = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.localityName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search your listings..." 
            className="pl-10 h-11 rounded-xl border-slate-100 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/post-property">
          <Button className="rounded-xl h-11 px-6 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-bold gap-2 shadow-lg shadow-[var(--primary-500)]/20">
            <Plus className="h-4 w-4" />
            Add New Property
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map((property) => (
            <Card key={property.id} className="p-4 border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={property.images[0] || ''}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-500 text-white border-none text-[10px] uppercase font-bold">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-[var(--primary-600)] transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.localityName}, {property.cityName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">
                          {formatPrice(property.price, property.listingIntentId === 2 ? 'rent' : 'buy')}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {property.propertyTypeName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Views</span>
                        <span className="text-sm font-bold text-slate-700">1.2k</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enquiries</span>
                        <span className="text-sm font-bold text-slate-700">12</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posted</span>
                        <span className="text-sm font-bold text-slate-700">{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <Link href={`/property/${property.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs font-bold gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="rounded-lg h-9 text-xs font-bold gap-1.5">
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-slate-100">
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2">
                          <Power className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-sm">Deactivate Listing</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-slate-50" />
                        <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2 text-red-500 focus:text-red-500 focus:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                          <span className="font-medium text-sm">Delete Property</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">No properties listed yet</h3>
            <p className="text-slate-500 max-w-sm mt-2 mb-8">
              Start by listing your first property and reach millions of potential buyers and tenants.
            </p>
            <Link href="/post-property">
              <Button className="rounded-xl h-12 px-8 bg-slate-900 text-white font-bold">
                List Your Property
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
