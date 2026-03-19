import HeroSection from '@/components/landing/HeroSection'
import Categories from '@/components/landing/Categories'
import FeaturedProducts from '@/components/landing/FeaturedProducts'
import QuoteSection from '@/components/landing/QuoteSection'
import Deals from '@/components/landing/Deals'
import Testimonials from '@/components/landing/Testimonials'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <QuoteSection />
      <Deals />
      <Testimonials />
    </>
  )
}
