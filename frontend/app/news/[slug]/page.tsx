import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { NEWS_ARTICLES, getArticleBySlug } from '@/lib/constants'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [{ url: article.image }] },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = NEWS_ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-3">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <Link href="/news" className="hover:text-[var(--primary-500)]">News</Link>
              <ChevronRight className="h-3 w-3" />
              <span style={{ color: 'var(--text-primary)' }} className="line-clamp-1">{article.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-4 lg:px-6 py-8 lg:py-12">
          {/* Article header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge style={{ background: 'var(--primary-500)' }} className="text-white">{article.category}</Badge>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h1>
            <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{article.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs" style={{ background: 'var(--primary-500)' }}>
                  {article.author.charAt(0)}
                </div>
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{article.author}</span>
                <span>·</span>
                <span>{article.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>
              <button className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
            <Image src={article.image} alt={article.title} fill className="object-cover" priority sizes="(max-width: 900px) 100vw, 900px" />
          </div>

          {/* Article body */}
          <div className="prose max-w-none">
            {article.content.map((para, i) => (
              <p key={i} className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                {para}
              </p>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-border">
            <Link href="/news" className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--primary-600)' }}>
              <ArrowLeft className="w-4 h-4" />
              Back to News & Insights
            </Link>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="border-t border-border" style={{ background: 'var(--surface-2)' }}>
            <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10">
              <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((a) => (
                  <Link key={a.id} href={`/news/${a.slug}`} className="group">
                    <article className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-all hover:-translate-y-0.5">
                      <div className="relative h-40 bg-muted">
                        <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                      </div>
                      <div className="p-4">
                        <p className="font-serif font-semibold text-sm line-clamp-2 group-hover:text-[var(--primary-600)] transition-colors" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>{a.date} · {a.readTime}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
