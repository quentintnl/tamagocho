import React from 'react'

interface MonsterProps {
  name: string
  type: 'happy' | 'sleepy' | 'hungry' | 'playful'
  level?: number
}

const Monster: React.FC<MonsterProps> = ({ name, type, level = 1 }) => {
  const getMonsterColor = () => {
    switch (type) {
      case 'happy':
        return 'bg-fuchsia-blue-200'
      case 'sleepy':
        return 'bg-lochinvar-200'
      case 'hungry':
        return 'bg-moccaccino-200'
      case 'playful':
        return 'bg-fuchsia-blue-300'
      default:
        return 'bg-gray-200'
    }
  }

  const getMonsterExpression = () => {
    switch (type) {
      case 'happy':
        return '◠‿◠'
      case 'sleepy':
        return '(￣～￣)'
      case 'hungry':
        return '◕ ︵ ◕'
      case 'playful':
        return '(◕‿◕)'
      default:
        return '◉_◉'
    }
  }

  return (
    <div
      className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getMonsterColor()}`}
    >
      <div className='flex flex-col items-center space-y-4'>
        {/* Corps du monstre */}
        <div className='relative w-32 h-32'>
          <div
            className='absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-4xl'
          >
            {getMonsterExpression()}
          </div>
          {/* Petites décorations */}
          <div className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/30' />
          <div className='absolute bottom-0 left-0 w-4 h-4 rounded-full bg-white/30' />
          <div className='absolute top-1/2 right-0 w-3 h-3 rounded-full bg-white/30' />
        </div>

        {/* Informations du monstre */}
        <div className='text-center'>
          <h3 className='font-bold text-lg text-lochinvar-900'>{name}</h3>
          <p className='text-sm text-lochinvar-600'>Niveau {level}</p>
          <p className='text-xs mt-1 text-lochinvar-500 capitalize'>{type}</p>
        </div>

        {/* Effet de brillance */}
        <div className='absolute top-0 left-1/4 w-1/2 h-1 bg-white/40 rounded-full blur-sm' />
      </div>
    </div>
  )
}

export default Monster
