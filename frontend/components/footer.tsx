import Link from 'next/link'
import { Home, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const FOOTER_LINKS = {
  'For Buyers': [
    { label: 'Buy Apartments', href: '/search?type=buy&propertyType=apartment' },
    { label: 'Buy Villas', href: '/search?type=buy&propertyType=villa' },
    { label: 'Buy Plots', href: '/search?type=buy&propertyType=plot' },
    { label: 'New Projects', href: '/projects' },
    { label: 'RERA Verified', href: '/search?type=buy&rera=true' },
    { label: 'Budget Homes', href: '/search?type=buy&maxPrice=50' },
  ],
  'For Tenants': [
    { label: 'Rent Apartments', href: '/search?type=rent&propertyType=apartment' },
    { label: 'Rent Villas', href: '/search?type=rent&propertyType=villa' },
    { label: 'PG / Co-living', href: '/search?type=pg' },
    { label: 'Zero Brokerage', href: '/search?type=rent&zeroBrokerage=true' },
    { label: 'Owner Direct', href: '/search?type=rent&ownerDirect=true' },
    { label: 'Furnished Homes', href: '/search?type=rent&furnishing=fully-furnished' },
  ],
  'New Projects': [
    { label: 'New Launches', href: '/projects?status=new' },
    { label: 'Under Construction', href: '/projects?status=construction' },
    { label: 'Ready to Move', href: '/projects?status=ready' },
    { label: 'Top Developers', href: '/projects#developers' },
    { label: 'RERA Approved', href: '/search?type=buy&rera=true' },
  ],
  'Popular Cities': [
    { label: 'Mumbai', href: '/search?city=Mumbai' },
    { label: 'Bangalore', href: '/search?city=Bangalore' },
    { label: 'Pune', href: '/search?city=Pune' },
    { label: 'Hyderabad', href: '/search?city=Hyderabad' },
    { label: 'Delhi NCR', href: '/search?city=Delhi' },
    { label: 'Ahmedabad', href: '/search?city=Ahmedabad' },
    { label: 'Chennai', href: '/search?city=Chennai' },
  ],
  'Resources': [
    { label: 'News & Articles', href: '/news' },
    { label: 'EMI Calculator', href: '/tools/emi-calculator' },
    { label: 'Rent Receipt', href: '/tools/rent-receipt' },
    { label: 'Property Value', href: '/tools/property-value' },
    { label: 'About ApnaNest', href: '/about' },
    { label: 'Find Agents', href: '/agents' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--text-primary)' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4 text-white">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mb-10" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-500)' }}>
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Apna<span style={{ color: 'var(--primary-500)' }}>Nest</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Where homes find people. India&apos;s most trusted real estate platform with verified listings, zero brokerage options, and direct owner contact.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@apnanest.in" className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <Mail className="w-4 h-4" />
                hello@apnanest.in
              </a>
              <a href="tel:+918000123456" className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <Phone className="w-4 h-4" />
                +91 80001 23456
              </a>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <MapPin className="w-4 h-4 shrink-0" />
                Ahmedabad, Gujarat, India
              </div>
            </div>
          </div>

          {/* App + Social */}
          <div>
            <p className="font-semibold text-sm text-white mb-4">Get the App</p>
            <div className="flex gap-3 mb-6">
              <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.2)] hover:border-white/50 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Download on</div>
                  <div className="text-xs font-semibold text-white">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.2)] hover:border-white/50 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.37.2.79.26 1.19.17l12.28-7.08-2.69-2.69-10.78 9.6zm-1.8-20.1C1.14 4.05 1 4.5 1 5.02v13.97c0 .52.14.97.38 1.35l.07.07 7.83-7.83v-.18L1.38 3.59l-.07.07zm19.36 8.97l-2.54-1.46-2.96 2.96 2.96 2.96 2.57-1.48c.73-.42.73-1.56-.03-1.98zM4.37.24L16.65 7.3l-2.69 2.69L3.18.38C3.56.3 3.98.36 4.37.62z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Get it on</div>
                  <div className="text-xs font-semibold text-white">Google Play</div>
                </div>
              </a>
            </div>

            <p className="font-semibold text-sm text-white mb-3">Follow us</p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter/X' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.15)] hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 flex flex-col sm:flex-row justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; 2026 ApnaNest Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Sitemap', 'Report Fraud'].map((item) => (
              <Link key={item} href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
