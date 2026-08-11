import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { NEWS_ARTICLES } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

export function NewsSection() {
  const articles = NEWS_ARTICLES.slice(0, 4)

  return (
    <section className="py-14 lg:py-20" style={{ background: 'var(--surface-2)' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--primary-500)' }}>
              Stay Informed
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              News & Insights
            </h2>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              Market trends, legal updates, and buying guides
            </p>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--primary-600)' }}
          >
            All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((article, i) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="group">
              <article className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
                <div className="relative h-44 overflow-hidden bg-muted">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="text-[10px] px-2 py-0.5" style={{ background: 'var(--primary-500)' }}>
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-serif font-semibold text-sm line-clamp-3 leading-snug mb-3 flex-1" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
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
    </section>
  )
}
