'use client'

import { Scale, ShieldCheck, FileText, Gavel, CheckCircle2 } from 'lucide-react'

export function LegalAssistanceClient() {
  const services = [
    { 
      title: 'Property Title Search', 
      desc: 'Verification of ownership history and encumbrance check for peace of mind.',
      icon: Search,
      price: '₹2,499'
    },
    { 
      title: 'Sale Deed Drafting', 
      desc: 'Professional drafting of sale agreements and deeds by expert property lawyers.',
      icon: FileText,
      price: '₹4,999'
    },
    { 
      title: 'RERA Consultation', 
      desc: 'Expert advice on RERA compliance, project status, and litigation support.',
      icon: ShieldCheck,
      price: '₹1,999'
    },
    { 
      title: 'Gift Deed/Will', 
      desc: 'Legal assistance in property transfer through gifts or testamentary documents.',
      icon: Gavel,
      price: '₹3,499'
    }
  ]

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-12 lg:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-xs font-bold uppercase tracking-widest mb-6">
          <Scale className="w-4 h-4" />
          Legal Assistance
        </div>
        <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Hassle-Free Property <br/>Legal Services
        </h1>
        <p className="text-lg opacity-70 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Protect your investment with expert legal verification. We connect you with top property lawyers to ensure your dream home has a clear title.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {services.map((s, i) => (
          <div key={i} className="group p-8 rounded-3xl bg-white border border-border hover:border-[var(--primary-500)] hover:shadow-xl transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-[var(--primary-50)] transition-colors">
              <s.icon className="w-7 h-7 text-slate-400 group-hover:text-[var(--primary-500)] transition-colors" />
            </div>
            <h3 className="font-bold text-xl mb-3">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{s.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-lg" style={{ color: 'var(--primary-600)' }}>{s.price}</span>
              <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[var(--primary-500)] transition-colors">Select →</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-10 lg:p-16 text-white overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6">Why Choose ApnaNest Legal?</h2>
            <div className="space-y-6">
              {[
                'Expert Property Lawyers with 15+ years experience',
                'Transparent pricing with no hidden charges',
                'Digital reports delivered within 48-72 hours',
                'End-to-end support for registration & stamp duty'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--primary-500)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg opacity-80">{item}</p>
                </div>
              ))}
            </div>
            <button className="mt-10 px-8 py-4 rounded-2xl bg-[var(--primary-500)] text-white font-bold hover:shadow-lg hover:-translate-y-1 transition-all">
              Book Free Consultation
            </button>
          </div>
          <div className="hidden lg:block relative h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-500)]/20 to-transparent rounded-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Scale className="w-32 h-32 text-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper icons that were missing in import
function Search(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  )
}
