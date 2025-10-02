import React from 'react'

const ActionsSection: React.FC = () => {
  const actions = [
    {
      action: 'Nourrir',
      color: 'from-moccaccino-100 to-moccaccino-200',
      icon: '🍎',
      gradient: 'from-moccaccino-400 to-moccaccino-500'
    },
    {
      action: 'Jouer',
      color: 'from-fuchsia-blue-100 to-fuchsia-blue-200',
      icon: '🎮',
      gradient: 'from-fuchsia-blue-400 to-fuchsia-blue-500'
    },
    {
      action: 'Éduquer',
      color: 'from-lochinvar-100 to-lochinvar-200',
      icon: '📚',
      gradient: 'from-lochinvar-400 to-lochinvar-500'
    },
    {
      action: 'Soigner',
      color: 'from-moccaccino-100 to-moccaccino-200',
      icon: '💊',
      gradient: 'from-moccaccino-400 to-moccaccino-500'
    },
    {
      action: 'Câliner',
      color: 'from-fuchsia-blue-100 to-fuchsia-blue-200',
      icon: '💝',
      gradient: 'from-fuchsia-blue-400 to-fuchsia-blue-500'
    },
    {
      action: 'Entraîner',
      color: 'from-lochinvar-100 to-lochinvar-200',
      icon: '💪',
      gradient: 'from-lochinvar-400 to-lochinvar-500'
    },
    {
      action: 'Explorer',
      color: 'from-moccaccino-100 to-moccaccino-200',
      icon: '🗺️',
      gradient: 'from-moccaccino-400 to-moccaccino-500'
    },
    {
      action: 'Socialiser',
      color: 'from-fuchsia-blue-100 to-fuchsia-blue-200',
      icon: '👥',
      gradient: 'from-fuchsia-blue-400 to-fuchsia-blue-500'
    }
  ]

  return (
    <section id='actions' className='py-20 relative overflow-hidden bg-white'>
      {/* Fond dynamique */}
      <div className='absolute inset-0 bg-gradient-to-br from-white via-lochinvar-50/30 to-fuchsia-blue-50/30'>
        <div
          className='absolute w-96 h-96 bg-fuchsia-blue-100/20 rounded-full -top-48 -right-48 blur-3xl animate-pulse'
        />
        <div
          className='absolute w-96 h-96 bg-moccaccino-100/20 rounded-full -bottom-48 -left-48 blur-3xl animate-pulse delay-500'
        />
      </div>

      <div className='container mx-auto px-4 relative'>
        <h2 className='text-4xl md:text-5xl font-bold text-center mb-12'>
          <span
            className='bg-gradient-to-r from-lochinvar-600 via-fuchsia-blue-600 to-moccaccino-500 bg-clip-text text-transparent'
          >
            Interactions Possibles
          </span>
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {actions.map(({ action, color, icon, gradient }, index) => (
            <div
              key={index}
              className={`group p-6 rounded-xl bg-gradient-to-br ${color} hover:scale-105 transform transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl`}
            >
              <div className='flex flex-col items-center space-y-4'>
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300`}
                >
                  {icon}
                </div>
                <h3 className='text-lg font-semibold bg-gradient-to-r from-lochinvar-700 to-fuchsia-blue-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform'>
                  {action}
                </h3>
              </div>
              <div
                className='absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActionsSection
