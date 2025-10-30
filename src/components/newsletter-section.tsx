'use client'

import { useState } from 'react'
import Button from '@/components/button'
import type { NewsletterFormData } from '@/types/components'

// Single Responsibility: NewsletterSection handles newsletter subscription
export default function NewsletterSection (): React.ReactNode {
  const [formData, setFormData] = useState<NewsletterFormData>({ email: '' })

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ email: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    // Dependency Inversion: In real app, this would use an injected service
    console.log('Newsletter subscription:', formData.email)
    // Reset form
    setFormData({ email: '' })
  }

  return (
    <section id='newsletter' className='py-20 bg-gradient-to-r from-sunset-400 via-sunset-500 to-sunset-600 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-10 right-10 text-9xl'>☀️</div>
        <div className='absolute bottom-10 left-10 text-8xl'>🌅</div>
      </div>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
        <h2 className='text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg'>
          Rejoignez notre communauté zen ! 🌸
        </h2>
        <p className='text-xl text-white/95 mb-8 drop-shadow-md'>
          Inscrivez-vous à notre newsletter et recevez <strong>10% de réduction</strong> sur votre premier achat in-app
        </p>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
          <input
            type='email'
            value={formData.email}
            onChange={handleEmailChange}
            placeholder='Votre adresse email'
            required
            className='flex-1 px-4 py-3 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50'
          />
          <Button variant='outline' size='md'>
            S'inscrire 🌿
          </Button>
        </form>

        <p className='text-sm text-white/80 mt-4 drop-shadow-sm'>
          * Offre valable pour les nouveaux utilisateurs uniquement
        </p>
      </div>
    </section>
  )
}
