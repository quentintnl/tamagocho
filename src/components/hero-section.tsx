import Button from '@/components/button'

// Single Responsibility: Hero section handles only the main landing content
export default function HeroSection (): React.ReactNode {
  return (
    <section id='hero' className='bg-gradient-to-br from-moccaccino-50 to-fuchsia-blue-50 py-20 lg:py-32'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Adoptez votre <span className='text-moccaccino-600'>petit monstre</span>
            <br />
            et vivez une aventure <span className='text-fuchsia-blue-600'>magique</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
            Découvrez l'univers enchanteur de Tamagotcho où des créatures adorables n'attendent que vos soins et votre amour.
            Nourrissez, jouez et regardez grandir votre compagnon virtuel dans cette expérience unique !
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='xl' variant='primary'>
              Commencer l'aventure
            </Button>
            <Button size='xl' variant='outline'>
              Découvrir le jeu
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
