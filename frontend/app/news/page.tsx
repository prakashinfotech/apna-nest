import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { NEWS_ARTICLES } from '@/lib/data'

export const metadata: Metadata = {
  title: 'News & Real Estate Insights',
  description: 'Latest real estate news, market trends, buying guides, and investment insights for Indian property market.',
}

const CATEGORIES = ['All', 'Market Trends', 'Investment', 'Buying Guide', 'Legal & Finance', 'Infrastructure', 'Policy']

export default function NewsPage() {
  const featured = NEWS_ARTICLES[0]
  const rest = NEWS_ARTICLES.slice(1)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="py-10 lg:py-14" style={{ background: 'var(--primary-50)' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>News & Insights</p>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Real Estate Intelligence</h1>
            <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>Market trends, legal guides, and expert insights to help you make smarter property decisions.</p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
            {CATEGORIES.map((cat) => (
              <button key={cat}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors"
                style={cat === 'All' ? { background: 'var(--primary-500)', color: 'white', borderColor: 'transparent' } : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Featured article */}
          <Link href={`/news/${featured.slug}`} className="group block mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video lg:aspect-auto rounded-xl overflow-hidden bg-muted">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Badge style={{ background: 'var(--primary-500)' }} className="text-white">{featured.category}</Badge>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#DCFCE7', color: '#16A34A' }}>Featured</span>
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-3 group-hover:text-[var(--primary-600)] transition-colors leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {featured.title}
                </h2>
                <p className="text-base mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 font-semibold text-sm" style={{ color: 'var(--primary-600)' }}>
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group">
                <article className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute top-3 left-3">
                      <Badge className="text-[10px] px-2 py-0.5" style={{ background: 'var(--primary-500)', color: 'white' }}>{article.category}</Badge>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif font-semibold text-base line-clamp-2 leading-snug mb-2 flex-1 group-hover:text-[var(--primary-600)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {article.title}
                    </h3>
                    <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{article.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
