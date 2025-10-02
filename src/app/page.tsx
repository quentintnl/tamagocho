import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import MonstersSection from '@/components/sections/MonstersSection'
import ActionsSection from '@/components/sections/ActionsSection'
import NewsletterSection from '@/components/sections/NewsletterSection'

export default function Home () {
  return (
    <main className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-white'>
      <Header />
      <HeroSection />
      <AdvantagesSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
