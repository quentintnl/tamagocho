import type { ActionCardProps } from '@/types/components'

// Open/Closed Principle: ActionCard can be extended with new color themes
function getActionColorClasses (colorTheme: ActionCardProps['colorTheme']): string {
  const colorMaps = {
    moccaccino: 'bg-moccaccino-100',
    lochinvar: 'bg-lochinvar-100',
    'fuchsia-blue': 'bg-fuchsia-blue-100'
  }
  return colorMaps[colorTheme]
}

// Single Responsibility: ActionCard displays one action with consistent styling
export function ActionCard ({
  icon,
  title,
  description,
  colorTheme
}: ActionCardProps): React.ReactNode {
  const colorClass = getActionColorClasses(colorTheme)

  return (
    <div className='text-center'>
      <div className={`w-20 h-20 ${colorClass} rounded-full flex items-center justify-center text-3xl mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  )
}

// Single Responsibility: ActionsSection orchestrates the actions display
export default function ActionsSection (): React.ReactNode {
  const actions: ActionCardProps[] = [
    {
      icon: '🍎',
      title: 'Nourrir',
      description: 'Offrez des repas délicieux pour maintenir votre créature en bonne santé',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🎾',
      title: 'Jouer',
      description: 'Amusez-vous avec des mini-jeux pour renforcer votre relation',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🛁',
      title: 'Laver',
      description: 'Gardez votre compagnon propre et heureux avec des soins réguliers',
      colorTheme: 'fuchsia-blue'
    },
    {
      icon: '💤',
      title: 'Dormir',
      description: 'Veillez sur le sommeil de votre créature pour qu\'elle récupère',
      colorTheme: 'moccaccino'
    }
  ]

  return (
    <section id='actions' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Que pouvez-vous faire ?
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Interagissez avec votre créature de multiples façons pour créer un lien unique
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {actions.map((action, index) => (
            <ActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </section>
  )
}
