import type { MonsterCardProps } from '@/types/components'

// Single Responsibility: MonsterCard displays one monster's info
export function MonsterCard ({
  emoji,
  name,
  personality
}: MonsterCardProps): React.ReactNode {
  return (
    <div className='bg-gradient-to-br from-white/80 to-meadow-50/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-meadow-200/50'>
      <div className='text-6xl text-center mb-4 transform hover:scale-110 transition-transform'>{emoji}</div>
      <h3 className='text-lg font-semibold text-center text-forest-800 mb-2'>{name}</h3>
      <p className='text-sm text-forest-600 text-center leading-relaxed'>{personality}</p>
    </div>
  )
}

// Single Responsibility: MonstersSection orchestrates the monster gallery
export default function MonstersSection (): React.ReactNode {
  const monsters: MonsterCardProps[] = [
    {
      emoji: '🐱',
      name: 'Miaou',
      personality: 'Joueur et affectueux'
    },
    {
      emoji: '🐶',
      name: 'Woufy',
      personality: 'Loyal et énergique'
    },
    {
      emoji: '🐰',
      name: 'Lapinou',
      personality: 'Doux et curieux'
    },
    {
      emoji: '🐼',
      name: 'Pandou',
      personality: 'Calme et sage'
    }
  ]

  return (
    <section id='monsters' className='py-20 bg-gradient-to-b from-meadow-50/30 to-transparent relative overflow-hidden'>
      {/* Nature decorations */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-10 left-1/4 text-8xl'>🌳</div>
        <div className='absolute bottom-10 right-1/4 text-8xl'>🌲</div>
        <div className='absolute top-1/2 left-10 text-6xl'>🌻</div>
        <div className='absolute top-1/3 right-10 text-6xl'>🌺</div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-forest-800 mb-4'>
            Rencontrez vos futurs compagnons 🐾
          </h2>
          <p className='text-xl text-forest-600 max-w-2xl mx-auto leading-relaxed'>
            Chaque créature a sa propre personnalité et vit en harmonie avec la nature
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-6'>
          {monsters.map((monster, index) => (
            <MonsterCard key={index} {...monster} />
          ))}
        </div>
      </div>

      {/* Grass decoration at bottom */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-meadow-100/40 to-transparent pointer-events-none' />
    </section>
  )
}
