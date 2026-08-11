import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the ApnaNest team. We\'re here to help with any questions about buying, selling, or renting property.',
}

const CONTACT_METHODS = [
  { icon: Phone, label: 'Call Us', value: '+91 80001 23456', sub: 'Mon–Sat, 9 AM–7 PM IST', href: 'tel:+918000123456' },
  { icon: Mail, label: 'Email Us', value: 'hello@apnanest.in', sub: 'We reply within 4 hours', href: 'mailto:hello@apnanest.in' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+91 80001 23456', sub: 'Chat with us anytime', href: 'https://wa.me/918000123456' },
  { icon: MapPin, label: 'Office', value: 'Ahmedabad, Gujarat', sub: '601 Stellar One, Bodakdev', href: '#' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-10 lg:py-14" style={{ background: 'var(--primary-50)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>We&apos;d love to hear from you</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact Us</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Our team is here to help Monday through Saturday.</p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact methods */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Get in Touch</h2>
              {CONTACT_METHODS.map(({ icon: Icon, label, value, sub, href }) => (
                <a key={label} href={href}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-md transition-all hover:-translate-y-0.5 block">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--primary-50)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
                  </div>
                </a>
              ))}

              <div className="p-4 rounded-2xl" style={{ background: 'var(--primary-50)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--primary-500)' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--primary-700)' }}>Business Hours</span>
                </div>
                <div className="text-xs space-y-1" style={{ color: 'var(--primary-600)' }}>
                  <p>Monday – Friday: 9:00 AM – 7:00 PM</p>
                  <p>Saturday: 10:00 AM – 5:00 PM</p>
                  <p>Sunday: Closed (emergency support only)</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <h2 className="font-semibold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
