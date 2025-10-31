import type { BenefitCardProps } from '@/types/components'

// Open/Closed Principle: BenefitCard can be extended with new color themes
function getColorClasses (colorTheme: BenefitCardProps['colorTheme']): {
  background: string
  border: string
  iconBackground: string
} {
  const colorMaps = {
    moccaccino: {
      background: 'bg-meadow-50/80',
      border: 'border-meadow-200',
      iconBackground: 'bg-gradient-to-br from-meadow-400 to-forest-500'
    },
    lochinvar: {
      background: 'bg-sky-50/80',
      border: 'border-sky-200',
      iconBackground: 'bg-gradient-to-br from-sky-400 to-sky-600'
    },
    'fuchsia-blue': {
      background: 'bg-lavender-50/80',
      border: 'border-lavender-200',
      iconBackground: 'bg-gradient-to-br from-lavender-400 to-lavender-600'
    }
  }
  return colorMaps[colorTheme]
}

// Single Responsibility: BenefitCard displays one benefit with consistent styling
export function BenefitCard ({
  icon,
  title,
  description,
  colorTheme
}: BenefitCardProps): React.ReactNode {
  const colors = getColorClasses(colorTheme)

  return (
    <div className={`text-center p-8 rounded-3xl ${colors.background} border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
      <div className={`w-16 h-16 ${colors.iconBackground} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-md`}>
        {icon}
      </div>
      <h3 className='text-xl font-semibold text-forest-800 mb-4'>{title}</h3>
      <p className='text-forest-600 leading-relaxed'>{description}</p>
    </div>
  )
}

// Single Responsibility: BenefitsSection orchestrates the benefits display
export default function BenefitsSection (): React.ReactNode {
  const benefits: BenefitCardProps[] = [
    {
      icon: '🌸',
      title: 'Créatures Apaisantes',
      description: 'Des compagnons doux qui évoluent paisiblement dans leur petit écosystème naturel',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🍃',
      title: 'Monde Zen & Relaxant',
      description: 'Prenez soin de votre créature dans un environnement apaisant inspiré de la nature',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🌿',
      title: 'Évolution Naturelle',
      description: 'Observez votre compagnon grandir au rythme des saisons dans son petit paradis',
      colorTheme: 'fuchsia-blue'
    }
  ]

  return (
    <section id='benefits' className='py-20 bg-gradient-to-b from-transparent via-sky-50/30 to-meadow-50/30 relative overflow-hidden'>
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-meadow-200/20 rounded-full blur-3xl' />
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-forest-800 mb-4'>
            Un havre de paix pour vos créatures 🌱
          </h2>
          <p className='text-xl text-forest-600 max-w-2xl mx-auto leading-relaxed'>
            Une expérience douce et relaxante inspirée des merveilles de la nature
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}
