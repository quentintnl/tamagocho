import React from 'react'
import Monster from '@/components/Monster'

const MonstersSection: React.FC = () => {
  const monsters = [
    { name: 'Mochi', type: 'happy', level: 5, gradient: 'from-fuchsia-blue-100 to-lochinvar-100', delay: 'delay-0' },
    { name: 'Pip', type: 'sleepy', level: 3, gradient: 'from-lochinvar-100 to-moccaccino-100', delay: 'delay-200' },
    {
      name: 'Tama',
      type: 'hungry',
      level: 4,
      gradient: 'from-moccaccino-100 to-fuchsia-blue-100',
      delay: 'delay-400'
    },
    {
      name: 'Luna',
      type: 'playful',
      level: 6,
      gradient: 'from-fuchsia-blue-100 to-lochinvar-100',
      delay: 'delay-600'
    }
  ] as const

  return (
    <section id='monstres' className='py-20 relative overflow-hidden'>
      {/* Fond dynamique */}
      <div className='absolute inset-0 bg-gradient-to-br from-lochinvar-50 via-white to-fuchsia-blue-50'>
        <div
          className='absolute w-72 h-72 bg-moccaccino-100/20 rounded-full top-20 -right-20 blur-3xl animate-pulse'
        />
        <div
          className='absolute w-72 h-72 bg-fuchsia-blue-100/20 rounded-full bottom-20 -left-20 blur-3xl animate-pulse delay-300'
        />
      </div>

      <div className='container mx-auto px-4 relative'>
        <h2 className='text-4xl md:text-5xl font-bold text-center mb-12'>
          <span className='bg-gradient-to-r from-fuchsia-blue-600 to-moccaccino-500 bg-clip-text text-transparent'>
            Nos Monstres Adorables
          </span>
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {monsters.map((monster, index) => (
            <div
              key={index}
              className={`transform hover:-translate-y-2 transition-all duration-300 ${monster.delay} animate-fade-in-up`}
            >
              <div
                className={`p-4 rounded-2xl bg-gradient-to-br ${monster.gradient} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <Monster {...monster} />
              </div>
            </div>
          ))}
        </div>

        {/* Éléments décoratifs flottants */}
        <div
          className='absolute w-20 h-20 bg-fuchsia-blue-200/30 rounded-full -top-10 left-1/4 blur-xl animate-float'
        />
        <div
          className='absolute w-16 h-16 bg-lochinvar-200/30 rounded-full top-40 right-1/4 blur-xl animate-float-delayed'
        />
        <div
          className='absolute w-24 h-24 bg-moccaccino-200/30 rounded-full -bottom-10 left-1/3 blur-xl animate-float'
        />
      </div>
    </section>
  )
}

export default MonstersSection
