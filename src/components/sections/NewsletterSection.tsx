import React from 'react'
import Button from '@/components/button'

const NewsletterSection: React.FC = () => {
  return (
    <section id='newsletter' className='py-20 relative overflow-hidden'>
      {/* Fond animé */}
      <div className='absolute inset-0 bg-gradient-to-br from-fuchsia-blue-50 via-white to-lochinvar-50'>
        <div
          className='absolute w-96 h-96 bg-moccaccino-100/20 rounded-full -top-48 left-1/4 blur-3xl animate-pulse'
        />
        <div
          className='absolute w-96 h-96 bg-fuchsia-blue-100/20 rounded-full bottom-0 right-1/4 blur-3xl animate-pulse delay-500'
        />
      </div>

      <div className='container mx-auto px-4 relative'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center space-y-6 backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-xl'>
            <div className='inline-block animate-bounce-slow'>
              <span className='text-4xl'>✨</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              <span
                className='bg-gradient-to-r from-fuchsia-blue-600 via-moccaccino-500 to-lochinvar-600 bg-clip-text text-transparent'
              >
                Restez informé !
              </span>
            </h2>
            <p className='text-xl bg-gradient-to-r from-lochinvar-700 to-fuchsia-blue-700 bg-clip-text text-transparent mb-8'>
              Inscrivez-vous à notre newsletter et recevez
              <span className='font-bold'> 10% de réduction </span>
              sur vos premiers achats in-app !
            </p>
            <form className='flex flex-col md:flex-row gap-4 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Votre email'
                className='flex-1 px-6 py-4 rounded-xl border-2 border-fuchsia-blue-200 focus:border-fuchsia-blue-400 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-blue-300 transition-all duration-300 placeholder-lochinvar-400'
              />
              <Button
                variant='primary'
                size='lg'
                className='bg-gradient-to-r from-fuchsia-blue-500 to-lochinvar-500 hover:from-lochinvar-500 hover:to-fuchsia-blue-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300'
              >
                S'inscrire
              </Button>
            </form>
            <p className='text-sm text-lochinvar-500 mt-4'>
              Rejoignez notre communauté de plus de 1000 dresseurs de Tamagocho ! 🌟
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSection
