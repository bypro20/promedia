import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-posts'

export function BlogPreview() {
  const posts = BLOG_POSTS.slice(0, 3)

  return (
    <section className="py-14">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#33353E]">Son Bloglarımız</h2>
          <p className="mt-1 text-sm text-[#666F94]">En güncel içeriklere göz atın ve sosyal medya dünyasındaki trendleri takip edin</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div className="h-32 rounded-xl bg-[#EDE5FF]" />
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
