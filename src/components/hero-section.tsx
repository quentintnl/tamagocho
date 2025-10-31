import Button from '@/components/button'

// Single Responsibility: Hero section handles only the main landing content
export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='relative bg-gradient-to-b from-sky-100 via-meadow-50 to-transparent py-20 lg:py-32 overflow-hidden nature-bg'>
      {/* Decorative nature elements */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-10 left-10 text-6xl floating-leaf'>🍃</div>
        <div className='absolute top-20 right-20 text-5xl floating-leaf' style={{ animationDelay: '2s' }}>🌿</div>
        <div className='absolute bottom-20 left-1/4 text-4xl floating-leaf' style={{ animationDelay: '4s' }}>🌱</div>
        <div className='absolute top-1/3 right-1/3 text-3xl floating-leaf' style={{ animationDelay: '1s' }}>🍂</div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-forest-800 mb-6'>
            Adoptez votre <span className='bg-gradient-to-r from-meadow-600 to-forest-600 bg-clip-text text-transparent'>petit compagnon</span>
            <br />
            et vivez dans un <span className='bg-gradient-to-r from-sky-500 to-lavender-500 bg-clip-text text-transparent'>écosystème apaisant</span>
          </h1>
          <p className='text-xl text-forest-700 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Découvrez un univers zen et naturel où vos créatures évoluent dans un petit paradis verdoyant.
            Prenez soin de votre compagnon, observez-le grandir au rythme de la nature 🌸
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='xl' variant='primary'>
              🌱 Commencer l'aventure
            </Button>
            <Button size='xl' variant='outline'>
              🌿 Découvrir le monde
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom grass decoration */}
      <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-meadow-100/50 to-transparent pointer-events-none' />
    </section>
  )
}
