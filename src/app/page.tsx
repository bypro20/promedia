import { HeroSection } from '@/components/home/hero-section'
import { HeroSlides } from '@/components/home/hero-slides'
import { PlatformCards } from '@/components/home/platform-cards'
import { PopularPackages } from '@/components/home/popular-packages'
import { AboutSection } from '@/components/home/about-section'
import { FeatureSlider } from '@/components/home/feature-slider'
import { SeoSections } from '@/components/home/seo-sections'
import { SatisfactionSection } from '@/components/home/satisfaction-section'
import { WhyUs } from '@/components/home/why-us'
import { Testimonials } from '@/components/testimonials'
import { FaqSection } from '@/components/faq-section'
import { AppDownload } from '@/components/home/app-download'
import { BlogPreview } from '@/components/home/blog-preview'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HeroSlides />
      <PlatformCards />
      <PopularPackages />
      <AboutSection />
      <FeatureSlider />
      <SeoSections />
      <SatisfactionSection />
      <WhyUs />
      <Testimonials />
      <FaqSection />
      <AppDownload />
      <BlogPreview />
    </main>
  )
}
