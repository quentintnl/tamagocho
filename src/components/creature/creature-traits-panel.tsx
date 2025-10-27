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
    <div className='flex justify-between items-center py-2 border-b border-fuchsia-blue-100 last:border-b-0'>
      <span className='text-fuchsia-blue-700 font-medium'>{label}</span>
      <span className='text-fuchsia-blue-900 font-bold'>{value}</span>
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
    <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-fuchsia-blue-200'>
      <h2 className='text-2xl font-bold text-fuchsia-blue-600 mb-4'>
        Caractéristiques
      </h2>
      <div className='space-y-3'>
        <TraitItem label='Forme du corps' value={getBodyStyleLabel(traits.bodyStyle)} />
        <TraitItem label="Type d'yeux" value={getEyeStyleLabel(traits.eyeStyle)} />
        <TraitItem label='Antenne' value={getAntennaStyleLabel(traits.antennaStyle)} />
        <TraitItem label='Accessoire' value={getAccessoryLabel(traits.accessory)} />
      </div>
    </div>
  )
}
