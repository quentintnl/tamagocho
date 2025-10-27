'use client'

import { useMonsterAction, type MonsterAction } from '@/hooks/monsters'

/**
 * Props pour le composant MonsterActions
 */
interface MonsterActionsProps {
  /** Callback appelé lorsqu'une action est déclenchée */
  onAction: (action: MonsterAction) => void
}

/**
 * Définition d'une action disponible sur un monstre
 */
interface ActionDefinition {
  /** Clé de l'action */
  action: MonsterAction
  /** Emoji représentant l'action */
  emoji: string
  /** Label textuel de l'action */
  label: string
}

/**
 * Liste des actions disponibles pour interagir avec un monstre
 */
const AVAILABLE_ACTIONS: ActionDefinition[] = [
  { action: 'feed', emoji: '🍎', label: 'Nourrir' },
  { action: 'comfort', emoji: '💙', label: 'Consoler' },
  { action: 'hug', emoji: '🤗', label: 'Câliner' },
  { action: 'wake', emoji: '⏰', label: 'Réveiller' }
]

/**
 * Props pour le composant ActionButton
 */
interface ActionButtonProps {
  /** Action associée au bouton */
  action: MonsterAction
  /** Emoji à afficher */
  emoji: string
  /** Label du bouton */
  label: string
  /** Si true, le bouton est dans son état actif */
  isActive: boolean
  /** Si true, le bouton est désactivé */
  isDisabled: boolean
  /** Callback au clic */
  onClick: () => void
}

/**
 * Bouton d'action individuel pour interagir avec un monstre
 *
 * Responsabilité unique : afficher un bouton d'action avec
 * ses états visuels (normal, actif, désactivé).
 *
 * @param {ActionButtonProps} props - Props du composant
 * @returns {React.ReactNode} Bouton stylisé
 *
 * @example
 * <ActionButton
 *   action="feed"
 *   emoji="🍎"
 *   label="Nourrir"
 *   isActive={false}
 *   isDisabled={false}
 *   onClick={handleFeed}
 * />
 */
function ActionButton ({
  emoji,
  label,
  isActive,
  isDisabled,
  onClick
}: ActionButtonProps): React.ReactNode {
  const baseClass = 'px-4 py-2 text-md rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300'
  const activeClass = isActive
    ? 'bg-moccaccino-200 text-moccaccino-400 ring-4 ring-moccaccino-300 ring-offset-2 scale-95'
    : isDisabled
      ? 'bg-moccaccino-200 text-moccaccino-400 cursor-not-allowed'
      : 'bg-moccaccino-500 hover:bg-moccaccino-700 text-white cursor-pointer active:scale-95 hover:scale-105 hover:shadow-lg'

  return (
    <button
      className={`${baseClass} ${activeClass}`}
      onClick={onClick}
      disabled={isDisabled}
      type='button'
    >
      <span className='text-2xl'>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

/**
 * Composant de gestion des actions sur un monstre
 *
 * Responsabilité unique : orchestrer l'affichage des boutons d'action
 * et gérer l'état de l'action en cours.
 *
 * Applique SRP en déléguant :
 * - La gestion de l'état d'action au hook useMonsterAction
 * - L'affichage de chaque bouton à ActionButton
 *
 * @param {MonsterActionsProps} props - Props du composant
 * @returns {React.ReactNode} Section d'actions
 *
 * @example
 * <MonsterActions onAction={(action) => console.log(action)} />
 */
export function MonsterActions ({ onAction }: MonsterActionsProps): React.ReactNode {
  const { activeAction, triggerAction } = useMonsterAction()

  /**
   * Gère le déclenchement d'une action
   * @param {MonsterAction} action - Action à déclencher
   */
  const handleAction = (action: MonsterAction): void => {
    triggerAction(action, onAction)
  }

  return (
    <div className='mt-6'>
      <h3 className='text-xl font-bold text-center text-lochinvar-700 mb-4'>
        Actions
      </h3>

      <div className='grid grid-cols-2 gap-3'>
        {AVAILABLE_ACTIONS.map(({ action, emoji, label }) => (
          <ActionButton
            key={action}
            action={action}
            emoji={emoji}
            label={label}
            isActive={activeAction === action}
            isDisabled={activeAction !== null}
            onClick={() => { handleAction(action) }}
          />
        ))}
      </div>

      {/* Indicateur d'action en cours */}
      {activeAction !== null && (
        <div className='mt-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-fuchsia-blue-100 px-4 py-2 rounded-full animate-pulse'>
            <div className='w-2 h-2 bg-fuchsia-blue-500 rounded-full animate-ping' />
            <span className='text-sm font-medium text-fuchsia-blue-700'>
              Action en cours...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
