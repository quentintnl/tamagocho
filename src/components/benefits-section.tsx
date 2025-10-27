import type { BenefitCardProps } from '@/types/components'

// Open/Closed Principle: BenefitCard can be extended with new color themes
function getColorClasses (colorTheme: BenefitCardProps['colorTheme']): {
  background: string
  border: string
  iconBackground: string
} {
  const colorMaps = {
    moccaccino: {
      background: 'bg-moccaccino-50',
      border: 'border-moccaccino-100',
      iconBackground: 'bg-moccaccino-500'
    },
    lochinvar: {
      background: 'bg-lochinvar-50',
      border: 'border-lochinvar-100',
      iconBackground: 'bg-lochinvar-500'
    },
    'fuchsia-blue': {
      background: 'bg-fuchsia-blue-50',
      border: 'border-fuchsia-blue-100',
      iconBackground: 'bg-fuchsia-blue-500'
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
    <div className={`text-center p-8 rounded-2xl ${colors.background} border ${colors.border}`}>
      <div className={`w-16 h-16 ${colors.iconBackground} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className='text-xl font-semibold text-gray-900 mb-4'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  )
}

// Single Responsibility: BenefitsSection orchestrates the benefits display
export default function BenefitsSection (): React.ReactNode {
  const benefits: BenefitCardProps[] = [
    {
      icon: '💖',
      title: 'Créatures Attachantes',
      description: 'Des monstres adorables avec des personnalités uniques qui évoluent selon vos soins',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🎮',
      title: 'Gameplay Engageant',
      description: 'Nourrissez, jouez et prenez soin de votre créature pour débloquer de nouvelles capacités',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🌟',
      title: 'Évolution Continue',
      description: 'Regardez votre monstre grandir et se transformer à travers différentes phases de vie',
      colorTheme: 'fuchsia-blue'
    }
  ]

  return (
    <section id='benefits' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Pourquoi choisir Tamagotcho ?
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Une expérience de jeu unique qui combine nostalgie et innovation moderne
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
