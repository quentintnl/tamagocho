import React from 'react'
import Button from '@/components/button'
import Monster from '@/components/Monster'

const HeroSection: React.FC = () => {
  return (
    <section className='pt-32 pb-16 relative overflow-hidden'>
      {/* Arrière-plan animé */}
      <div
        className='absolute inset-0 bg-gradient-to-br from-fuchsia-blue-100 via-lochinvar-50 to-moccaccino-100 opacity-70'
      >
        <div
          className='absolute w-64 h-64 rounded-full bg-fuchsia-blue-200/30 -top-20 -left-20 blur-3xl animate-pulse'
        />
        <div
          className='absolute w-64 h-64 rounded-full bg-lochinvar-200/30 top-40 -right-20 blur-3xl animate-pulse delay-700'
        />
        <div
          className='absolute w-48 h-48 rounded-full bg-moccaccino-200/30 bottom-0 left-1/2 blur-3xl animate-pulse delay-1000'
        />
      </div>

      <div className='container mx-auto px-4 relative'>
        <div className='flex flex-col md:flex-row items-center gap-12'>
          <div className='flex-1 space-y-6'>
            <h1 className='text-5xl md:text-6xl font-bold'>
              <span className='bg-gradient-to-r from-lochinvar-600 to-fuchsia-blue-600 bg-clip-text text-transparent'>
                Adoptez votre
              </span>
              <br />
              <span
                className='bg-gradient-to-r from-fuchsia-blue-600 to-moccaccino-500 bg-clip-text text-transparent'
              >
                compagnon virtuel
              </span>
              <br />
              <span
                className='bg-gradient-to-r from-moccaccino-500 to-lochinvar-600 bg-clip-text text-transparent'
              >
                unique
              </span>
            </h1>
            <p className='text-xl text-lochinvar-700 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-xl'>
              Élevez, choyez et faites évoluer votre petit monstre adorable dans un univers magique et
              attachant.
            </p>
            <div className='flex gap-4'>
              <Button
                variant='primary'
                size='lg'
                className='bg-gradient-to-r from-fuchsia-blue-500 to-moccaccino-400 hover:from-moccaccino-400 hover:to-fuchsia-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                Commencer l'aventure
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='border-2 !border-lochinvar-400 !text-lochinvar-600 hover:!bg-lochinvar-50/50 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                En savoir plus
              </Button>
            </div>
          </div>
          <div className='flex-1 relative'>
            <div
              className='absolute w-full h-full bg-gradient-to-br from-fuchsia-blue-200/30 to-lochinvar-200/30 rounded-full blur-3xl animate-pulse'
            />
            <div className='relative transform hover:scale-105 transition-transform duration-300'>
              <Monster name='Mochi' type='happy' level={7} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
