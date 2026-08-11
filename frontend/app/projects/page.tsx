'use client'

import { useState, useMemo } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Building2, Star, Search, Filter, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PROJECTS, DEVELOPERS, CITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Under Construction': { bg: '#FEF3C7', color: '#D97706' },
  'Pre-Launch': { bg: '#EEF2FF', color: '#6366F1' },
  'Ready to Move': { bg: '#DCFCE7', color: '#16A34A' },
  'New Launch': { bg: '#FCE7F3', color: '#DB2777' },
}

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      const matchesCity = cityFilter === 'All Cities' || p.city === cityFilter
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.builder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.locality.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesCity && matchesSearch
    })
  }, [statusFilter, cityFilter, searchQuery])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-12 lg:py-16" style={{ background: 'var(--primary-50)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--primary-500)' }}>Premium Real Estate</p>
                <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Projects & <br/>Developments</h1>
                <p className="text-lg opacity-80 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Discover elite residential and commercial properties from India&apos;s most prestigious developers. 
                  Verified listings with RERA details.
                </p>
              </div>
              <div className="w-full lg:w-96">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary-500)] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by project, builder or area..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-white bg-white/80 backdrop-blur-sm focus:bg-white focus:outline-none focus:border-[var(--primary-500)] transition-all shadow-sm focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Filters</span>
              </div>
              
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {['All', 'Pre-Launch', 'New Launch', 'Under Construction', 'Ready to Move'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "shrink-0 px-5 py-2 rounded-xl text-sm font-semibold border transition-all",
                      statusFilter === s 
                        ? "bg-[var(--primary-500)] text-white border-transparent shadow-md -translate-y-0.5" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-[var(--primary-300)]"
                    )}>
                    {s}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block" />

              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {['All Cities', ...CITIES.slice(0, 6)].map((c) => (
                  <button 
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={cn(
                      "shrink-0 px-5 py-2 rounded-xl text-sm font-semibold border transition-all",
                      cityFilter === c 
                        ? "border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)] shadow-sm -translate-y-0.5" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-[var(--primary-300)]"
                    )}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-sm font-medium text-slate-400 shrink-0">
              Showing <span className="text-slate-900 font-bold">{filteredProjects.length}</span> projects
            </div>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project, i) => {
              const statusStyle = STATUS_COLORS[project.status] || { bg: 'var(--surface-2)', color: 'var(--text-secondary)' }
              return (
                <article key={project.id} className="group rounded-3xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative h-60 overflow-hidden bg-muted">
                    <Image src={project.image} alt={project.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm" style={{ background: 'white', color: statusStyle.color }}>
                        {project.status}
                      </span>
                    </div>
                    {project.reraId && (
                      <div className="absolute top-4 right-4">
                        <Badge className="text-[10px] font-bold px-2 py-1 bg-blue-600 text-white shadow-sm">RERA VERIFIED</Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[var(--primary-500)]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{project.builder}</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl leading-tight group-hover:text-[var(--primary-600)] transition-colors mb-2" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin className="w-4 h-4 text-slate-300" />
                        {project.locality}, {project.city}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Configurations</p>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{project.configurations}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Possession</p>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{project.possession}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Price Range</p>
                        <p className="font-bold text-lg" style={{ color: 'var(--primary-600)' }}>{project.priceRange}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/search?q=${encodeURIComponent(project.name)}`}
                          className="w-10 h-10 rounded-xl bg-[var(--primary-500)] text-white flex items-center justify-center hover:bg-[var(--primary-600)] shadow-md transition-all active:scale-95"
                          title="View Details"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 mb-12">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setStatusFilter('All'); setCityFilter('All Cities'); setSearchQuery('') }}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold hover:border-[var(--primary-500)] hover:text-[var(--primary-600)] transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Developers section */}
          <div id="developers" className="pt-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Top Developers</h2>
              <Link href="/agents" className="text-sm font-bold text-[var(--primary-600)] hover:underline">View All Developers →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {DEVELOPERS.map((dev) => (
                <Link key={dev.id} href={`/projects?builder=${encodeURIComponent(dev.name)}`} className="group">
                  <Card className="rounded-2xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-none bg-slate-50 group-hover:bg-white overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110" style={{ background: 'var(--primary-500)' }}>
                        {dev.logoInitials}
                      </div>
                      <h3 className="text-sm font-bold line-clamp-1 mb-2 group-hover:text-[var(--primary-600)] transition-colors" style={{ color: 'var(--text-primary)' }}>{dev.name}</h3>
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <Star className="w-3.5 h-3.5 fill-current text-[var(--secondary-500)]" />
                        <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{dev.rating}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Est. {dev.established}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

