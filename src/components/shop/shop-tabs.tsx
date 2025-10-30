/**
 * Shop Tabs Component
 *
 * Composant de navigation par onglets pour la boutique
 * Responsabilité unique : gérer l'affichage des onglets et le tab actif
 */

/**
 * Type d'onglet disponible
 */
export type ShopTab = 'accessories' | 'backgrounds'

/**
 * Props pour le composant ShopTabs
 */
interface ShopTabsProps {
  /** Onglet actuellement actif */
  activeTab: ShopTab
  /** Callback appelé lors du changement d'onglet */
  onTabChange: (tab: ShopTab) => void
  /** Nombre d'accessoires */
  accessoriesCount: number
  /** Nombre d'arrière-plans */
  backgroundsCount: number
}

/**
 * Composant d'onglets pour la boutique
 *
 * Applique SRP en se concentrant uniquement sur la navigation par onglets
 *
 * @param {ShopTabsProps} props - Props du composant
 * @returns {React.ReactNode} Onglets de navigation
 *
 * @example
 * <ShopTabs
 *   activeTab="accessories"
 *   onTabChange={setActiveTab}
 *   accessoriesCount={18}
 *   backgroundsCount={6}
 * />
 */
export function ShopTabs ({
  activeTab,
  onTabChange,
  accessoriesCount,
  backgroundsCount
}: ShopTabsProps): React.ReactNode {
  const tabs = [
    {
      id: 'accessories' as ShopTab,
      label: 'Accessoires',
      icon: '🎨',
      count: accessoriesCount
    },
    {
      id: 'backgrounds' as ShopTab,
      label: 'Arrière-plans',
      icon: '🖼️',
      count: backgroundsCount
    }
  ]

  return (
    <div className='flex justify-center mb-8'>
      <div className='inline-flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-lg ring-1 ring-white/60'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { onTabChange(tab.id) }}
            className={`
              relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-moccaccino-500 to-moccaccino-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }
            `}
          >
            <div className='flex items-center gap-2'>
              <span className='text-xl'>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`
                  inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold
                  ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }
                `}
              >
                {tab.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

