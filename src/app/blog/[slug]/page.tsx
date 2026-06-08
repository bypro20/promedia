import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getAllBlogSlugs, getBlogPost } from '@/lib/blog-posts'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Yazı bulunamadı' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2)
  const more = related.length > 0 ? related : BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <main className="py-12">
      <article className="sd-container max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-[#7844E4] hover:underline">
          ← Blog
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#666F94]">
          <span className="rounded-full bg-[#EDE5FF] px-3 py-0.5 text-xs font-bold text-[#7844E4]">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readMin} dk okuma</span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight text-[#33353E] sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-[#666F94]">{post.excerpt}</p>
        <div className="mt-8 h-48 rounded-2xl bg-gradient-to-br from-[#7844E4]/20 to-[#057EF6]/20" />

        <div className="prose prose-lg mt-10 max-w-none">
          {post.content.map((para, i) => (
            <p key={i} className="mb-5 text-base leading-relaxed text-[#33353E]">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#7844E4] p-6 text-center text-white">
          <p className="font-bold">Hizmetlerimizi deneyin</p>
          <p className="mt-1 text-sm text-white/80">Kayıt olun, bakiye yükleyin ve anında sipariş verin.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/kayit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#7844E4] hover:bg-white/90">
              Ücretsiz Kayıt
            </Link>
            <Link href="/hizmetler" className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-bold hover:bg-white/10">
              Hizmetleri Gör
            </Link>
          </div>
        </div>

        {more.length > 0 && (
          <section className="mt-12 border-t border-[#E9EBF5] pt-10">
            <h2 className="text-lg font-bold text-[#33353E]">İlgili yazılar</h2>
            <ul className="mt-4 space-y-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="font-semibold text-[#7844E4] hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  )
}
