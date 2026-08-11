'use client'

import { useState, useMemo } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin, X } from 'lucide-react'
import type { Property } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface MapViewProps {
  properties: Property[]
}

// Using Carto Voyager - A professional, free, and no-key-required map style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'

export function MapView({ properties }: MapViewProps) {
  const [popupInfo, setPopupInfo] = useState<Property | null>(null)
  const [viewState, setViewState] = useState({
    latitude: properties[0]?.lat || 20.5937,
    longitude: properties[0]?.lng || 78.9629,
    zoom: properties.length > 0 ? 11 : 4
  })

  const pins = useMemo(() => properties.map(p => (
    <Marker
      key={p.id}
      longitude={p.lng}
      latitude={p.lat}
      anchor="bottom"
      onClick={e => {
        e.originalEvent.stopPropagation()
        setPopupInfo(p)
      }}
    >
      <div className="group cursor-pointer">
        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-md group-hover:bg-[var(--primary-500)] group-hover:text-white transition-colors">
          <span className="text-[10px] font-bold whitespace-nowrap">
            {formatPrice(p.price, p.listingIntentId === 2 ? 'rent' : 'buy')}
          </span>
        </div>
        <div className="w-0.5 h-1 bg-slate-400 mx-auto group-hover:bg-[var(--primary-500)]" />
      </div>
    </Marker>
  )), [properties])

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-border shadow-inner bg-slate-50">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="property-popup"
          >
            <div className="w-48 bg-white rounded-xl overflow-hidden shadow-xl border border-slate-100">
              <div className="relative h-24">
                <Image 
                  src={popupInfo.images[0] || ''} 
                  alt={popupInfo.title} 
                  fill 
                  className="object-cover"
                  sizes="192px"
                />
                <button 
                  onClick={() => setPopupInfo(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="p-3">
                <div className="text-sm font-bold text-slate-900 mb-0.5">
                  {formatPrice(popupInfo.price, popupInfo.listingIntentId === 2 ? 'rent' : 'buy')}
                </div>
                <div className="text-[10px] text-slate-500 truncate mb-3">{popupInfo.title}</div>
                <Link 
                  href={`/property/${popupInfo.id}`}
                  className="block text-center py-2 rounded-lg bg-[var(--primary-500)] text-white text-[10px] font-bold hover:bg-[var(--primary-600)] transition-all shadow-sm active:scale-95"
                >
                  View Details
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Stats overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 pointer-events-none transition-opacity hover:opacity-20">
        <div className="w-2 h-2 rounded-full bg-[var(--primary-500)] animate-pulse" />
        <span className="text-[10px] font-bold text-slate-700">{properties.length} Results in this view</span>
      </div>

      {/* Map Attribution Disclaimer (Optional but good practice for free tiles) */}
      <div className="absolute bottom-1 right-1 bg-white/50 px-1 rounded text-[8px] text-slate-400">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors
      </div>
    </div>
  )
}
