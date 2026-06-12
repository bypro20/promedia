import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Sosyal medya büyüme, SMM panel, Instagram, TikTok ve YouTube rehberleri — ProMedia blog.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  return (
    <main className="py-12">
      <div className="sd-container">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#33353E]">Blog</h1>
          <p className="mt-2 text-[#666F94]">
            Sosyal medya büyüme stratejileri, SMM ipuçları ve platform rehberleri
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_32px_rgba(120,68,228,0.12)]"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7844E4]">
                <span className="rounded-full bg-[#EDE5FF] px-2.5 py-0.5">{post.category}</span>
                <span className="text-[#666F94]">{post.readMin} dk okuma</span>
              </div>
              <div
                className="mt-4 flex h-36 flex-col justify-end rounded-xl p-4 text-white"
                style={{
                  background: `linear-gradient(135deg, ${
                    post.category === 'Instagram' ? '#E1306C'
                    : post.category === 'TikTok' ? '#000'
                    : post.category === 'YouTube' ? '#FF0000'
                    : '#7844E4'
                  } 0%, #282D40 100%)`,
                }}
              >
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{post.category}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold leading-snug text-[#33353E]">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#666F94]">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[#E9EBF5] pt-4">
                <time className="text-xs text-[#666F94]" dateTime={post.date}>{formatDate(post.date)}</time>
                <Link href={`/blog/${post.slug}`} className="text-sm font-bold text-[#7844E4] hover:underline">
                  Devamını Oku →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
