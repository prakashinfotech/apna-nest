import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import { AuthModal } from '@/components/auth/auth-modal'
import { MSWProvider } from '@/components/msw-provider'
import { AuthUrlHandler } from '@/components/auth/auth-url-handler'
import { Toaster } from 'sonner'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ApnaNest — Find the place where life happens',
    template: '%s | ApnaNest',
  },
  description:
    'Discover homes, plots, and PGs across India. Buy, sell, or rent with verified listings, zero brokerage options, and owner-direct contact.',
  keywords: 'real estate India, buy home, rent apartment, property for sale, verified listings, zero brokerage, RERA',
  openGraph: {
    title: 'ApnaNest — Find the place where life happens',
    description: 'Discover homes, plots, and PGs across India with no broker drama.',
    type: 'website',
    siteName: 'ApnaNest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApnaNest',
    description: 'India\'s trusted real estate platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#14B8A6',
  width: 'device-width',
  initialScale: 1,
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased min-h-screen bg-background" suppressHydrationWarning>
        <MSWProvider>
          <AuthUrlHandler />
          <AuthModal />
          {children}
          <Toaster position="top-center" richColors closeButton />
        </MSWProvider>
      </body>
    </html>
  )
}
