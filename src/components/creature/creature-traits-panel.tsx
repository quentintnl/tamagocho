import {
  getBodyStyleLabel,
  getEyeStyleLabel,
  getAntennaStyleLabel,
  getAccessoryLabel
} from '@/lib/utils'
import type { MonsterTraits } from '@/types/monster'

/**
 * Props pour le composant TraitItem
 */
interface TraitItemProps {
  /** Label de la caractéristique */
  label: string
  /** Valeur de la caractéristique */
  value: string
}

/**
 * Élément de caractéristique (ligne label/valeur)
 *
 * Responsabilité unique : afficher une paire label/valeur
 * dans le style des caractéristiques.
 *
 * @param {TraitItemProps} props - Props du composant
 * @returns {React.ReactNode} Ligne de caractéristique
 *
 * @example
 * <TraitItem label="Forme du corps" value="Rond" />
 */
export function TraitItem ({ label, value }: TraitItemProps): React.ReactNode {
  return (
    <div className='flex justify-between items-center py-3 px-4 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-lavender-200/40 hover:border-lavender-300/60 transition-all'>
      <span className='text-lavender-700 font-bold text-sm'>{label}</span>
      <span className='text-lavender-900 font-black text-base'>{value}</span>
    </div>
  )
}

/**
 * Props pour le composant CreatureTraitsPanel
 */
interface CreatureTraitsPanelProps {
  /** Traits visuels du monstre */
  traits: MonsterTraits
}

/**
 * Panneau d'affichage des caractéristiques physiques du monstre
 *
 * Responsabilité unique : afficher les caractéristiques visuelles
 * du monstre (forme, yeux, antenne, accessoire).
 *
 * Applique SRP en déléguant :
 * - L'affichage de chaque trait à TraitItem
 * - Le formatage des labels aux fonctions utils
 *
 * @param {CreatureTraitsPanelProps} props - Props du composant
 * @returns {React.ReactNode} Panneau de caractéristiques
 *
 * @example
 * <CreatureTraitsPanel traits={monsterTraits} />
 */
export function CreatureTraitsPanel ({ traits }: CreatureTraitsPanelProps): React.ReactNode {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-50 p-6 shadow-xl border-4 border-white/90'>
      {/* Motif décoratif */}
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl' aria-hidden='true' />

      <div className='relative'>
        {/* En-tête */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-lg border-2 border-white text-2xl'>
            ✨
          </div>
          <h2 className='text-2xl font-black text-forest-800'>
            Caractéristiques
          </h2>
        </div>

        <div className='space-y-3'>
          <TraitItem label='Forme du corps' value={getBodyStyleLabel(traits.bodyStyle)} />
          <TraitItem label="Type d'yeux" value={getEyeStyleLabel(traits.eyeStyle)} />
          <TraitItem label='Antenne' value={getAntennaStyleLabel(traits.antennaStyle)} />
          <TraitItem label='Accessoire' value={getAccessoryLabel(traits.accessory)} />
        </div>
      </div>
    </div>
  )
}
