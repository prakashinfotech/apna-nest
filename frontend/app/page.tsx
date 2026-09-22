import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { StatsSection } from '@/components/home/stats-section'
import { TopPicksSection } from '@/components/home/top-picks-section'
import { LocalitiesSection } from '@/components/home/localities-section'
import { WhyUsSection } from '@/components/home/why-us-section'
import { DevelopersSection } from '@/components/home/developers-section'
import { ToolsSection } from '@/components/home/tools-section'
import { NewsSection } from '@/components/home/news-section'
import { SellBannerSection } from '@/components/home/sell-banner-section'

export const metadata: Metadata = {
  title: 'ApnaNest — Find the place where life happens',
  description: 'Discover homes, plots, and PGs across India. Buy, sell, or rent with verified listings, zero brokerage options, and owner-direct contact.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <HeroSection />
        <StatsSection />
        <TopPicksSection />
        <LocalitiesSection />
        <WhyUsSection />
        <DevelopersSection />
        <ToolsSection />
        <NewsSection />
        <SellBannerSection />
      </main>
      <Footer />
    </div>
  )
}
