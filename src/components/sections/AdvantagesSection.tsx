import React from 'react'

const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      title: 'Compagnon Unique',
      description: 'Chaque monstre est généré de manière unique avec sa propre personnalité',
      gradient: 'from-fuchsia-blue-500 to-lochinvar-500',
      delay: 'delay-0'
    },
    {
      title: 'Évolution Interactive',
      description: 'Regardez votre monstre grandir et évoluer selon vos interactions',
      gradient: 'from-lochinvar-500 to-moccaccino-500',
      delay: 'delay-300'
    },
    {
      title: 'Communauté Active',
      description: "Partagez et interagissez avec d'autres dresseurs de Tamagocho",
      gradient: 'from-moccaccino-500 to-fuchsia-blue-500',
      delay: 'delay-500'
    }
  ]

  return (
    <section id='avantages' className='py-20 relative overflow-hidden'>
      {/* Fond animé */}
      <div className='absolute inset-0 bg-gradient-to-tr from-fuchsia-blue-50/80 via-white to-lochinvar-50/80'>
        <div
          className='absolute w-96 h-96 bg-moccaccino-100/30 rounded-full -top-48 -right-48 blur-3xl animate-pulse'
        />
        <div
          className='absolute w-96 h-96 bg-fuchsia-blue-100/30 rounded-full -bottom-48 -left-48 blur-3xl animate-pulse delay-500'
        />
      </div>

      <div className='container mx-auto px-4 relative'>
        <h2 className='text-4xl md:text-5xl font-bold text-center mb-12'>
          <span className='bg-gradient-to-r from-lochinvar-600 to-fuchsia-blue-600 bg-clip-text text-transparent'>
            Pourquoi adopter un Tamagocho ?
          </span>
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`group p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 ${advantage.delay} animate-fade-in-up transform hover:-translate-y-2`}
            >
              <div
                className={`w-16 h-16 mb-6 rounded-full bg-gradient-to-r ${advantage.gradient} group-hover:scale-110 transition-transform duration-300`}
              />
              <h3 className={`text-xl font-semibold mb-4 bg-gradient-to-r ${advantage.gradient} bg-clip-text text-transparent`}>
                {advantage.title}
              </h3>
              <p className='text-lochinvar-600 group-hover:text-lochinvar-700 transition-colors'>
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdvantagesSection
