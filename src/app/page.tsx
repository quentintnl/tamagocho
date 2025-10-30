// Clean Architecture: Presentation layer imports application components
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import BenefitsSection from '@/components/benefits-section'
import MonstersSection from '@/components/monsters-section'
import ActionsSection from '@/components/actions-section'
import NewsletterSection from '@/components/newsletter-section'
import Footer from '@/components/footer'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
// and handles redirect logic for authenticated users
export default async function Home (): Promise<React.ReactNode> {
  // Vérification de la session utilisateur via Better Auth
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirection intelligente : si connecté, rediriger vers le dashboard
  if (session !== null && session !== undefined) {
    redirect('/dashboard')
  }

  // Landing page pour les utilisateurs non connectés
  return (
    <div className='font-sans'>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
