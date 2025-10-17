import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import MonstersSection from '@/components/sections/MonstersSection'
import ActionsSection from '@/components/sections/ActionsSection'
import NewsletterSection from '@/components/sections/NewsletterSection'
import { Metadata } from 'next'

export const metadata: Readonly<Metadata> = {
  title: 'Tamagotcho - Adopte et prends soin de ton compagnon virtuel',
  description: 'Tamagotcho est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !',
  keywords: 'Tamagotcho, monstre virtuel, adoption, jeu, aventure',
  openGraph: {
    title: 'Tamagotcho - Adopte et prends soin de ton compagnon virtuel',
    description: 'Tamagotcho est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !'
  },
  twitter: {
    title: 'Tamagotcho - Adopte et prends soin de ton compagnon virtuel',
    description: 'Tamagotcho est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !'
  }
}

// Single Responsibility: Home page orchestrates the layout of sections
export default function Home (): React.ReactNode {
  return (
    <div className='font-sans'>
      <Header />
      <HeroSection />
      <AdvantagesSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
