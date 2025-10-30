import type { ActionCardProps } from '@/types/components'

// Open/Closed Principle: ActionCard can be extended with new color themes
function getActionColorClasses (colorTheme: ActionCardProps['colorTheme']): string {
  const colorMaps = {
    moccaccino: 'bg-gradient-to-br from-meadow-200 to-meadow-300',
    lochinvar: 'bg-gradient-to-br from-sky-200 to-sky-300',
    'fuchsia-blue': 'bg-gradient-to-br from-lavender-200 to-lavender-300'
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
    <div className='text-center transform hover:scale-105 transition-all duration-300'>
      <div className={`w-20 h-20 ${colorClass} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className='text-lg font-semibold text-forest-800 mb-2'>{title}</h3>
      <p className='text-forest-600 leading-relaxed'>{description}</p>
    </div>
  )
}

// Single Responsibility: ActionsSection orchestrates the actions display
export default function ActionsSection (): React.ReactNode {
  const actions: ActionCardProps[] = [
    {
      icon: '🍎',
      title: 'Nourrir',
      description: 'Offrez des repas naturels pour que votre créature s\'épanouisse',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🎾',
      title: 'Jouer',
      description: 'Profitez de moments de joie dans votre petit écosystème',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🛁',
      title: 'Prendre soin',
      description: 'Gardez votre compagnon heureux avec des soins doux',
      colorTheme: 'fuchsia-blue'
    },
    {
      icon: '💤',
      title: 'Se reposer',
      description: 'Laissez votre créature se ressourcer paisiblement',
      colorTheme: 'moccaccino'
    }
  ]

  return (
    <section id='actions' className='py-20 bg-gradient-to-b from-transparent to-sky-50/30 relative overflow-hidden'>
      {/* Nature elements */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-10 left-10 text-9xl'>☁️</div>
        <div className='absolute top-20 right-20 text-9xl'>☁️</div>
        <div className='absolute bottom-10 left-1/3 text-7xl'>🌤️</div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-forest-800 mb-4'>
            Prenez soin de votre petit monde 🌍
          </h2>
          <p className='text-xl text-forest-600 max-w-2xl mx-auto leading-relaxed'>
            Créez un lien unique avec votre créature à travers des interactions douces et apaisantes
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
