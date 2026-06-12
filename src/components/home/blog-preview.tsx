import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-posts'

const CATEGORY_COLORS: Record<string, string> = {
  Instagram: '#E1306C',
  TikTok: '#000000',
  YouTube: '#FF0000',
  Twitter: '#1DA1F2',
  Genel: '#7844E4',
}

export function BlogPreview() {
  const posts = BLOG_POSTS.slice(0, 3)

  return (
    <section className="py-14">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#33353E]">Son Bloglarımız</h2>
          <p className="mt-1 text-sm text-[#666F94]">Sosyal medya büyüme rehberleri ve güncel ipuçları</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div
                className="flex h-32 flex-col justify-end rounded-xl p-4 text-white"
                style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[post.category] ?? '#7844E4'} 0%, #282D40 100%)` }}
              >
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{post.category}</span>
                <span className="text-sm font-semibold">{post.readMin} dk okuma</span>
              </div>
              <h3 className="mt-4 text-base font-semibold leading-snug text-[#33353E]">{post.title}</h3>
              <p className="mt-2 text-sm text-[#666F94]">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-semibold text-[#7844E4] hover:underline">
                Devamını Oku →
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/blog" className="text-sm font-bold text-[#7844E4] hover:underline">
            Tüm blog yazılarını gör →
          </Link>
        </div>
      </div>
    </section>
  )
}
