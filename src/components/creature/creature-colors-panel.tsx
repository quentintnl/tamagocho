import type { MonsterTraits } from '@/types/monster'

/**
 * Props pour le composant ColorSwatch
 */
interface ColorSwatchProps {
  /** Label de la couleur */
  label: string
  /** Couleur au format hexadécimal */
  color: string
}

/**
 * Échantillon de couleur avec label
 *
 * Responsabilité unique : afficher un carré coloré avec son label.
 *
 * @param {ColorSwatchProps} props - Props du composant
 * @returns {React.ReactNode} Échantillon de couleur
 *
 * @example
 * <ColorSwatch label="Corps" color="#FFB5E8" />
 */
export function ColorSwatch ({ label, color }: ColorSwatchProps): React.ReactNode {
  return (
    <div className='text-center'>
      <div
        className='w-full aspect-square rounded-xl border-2 border-gray-300 shadow-md mb-2'
        style={{ backgroundColor: color }}
      />
      <p className='text-xs text-gray-600 font-medium'>{label}</p>
    </div>
  )
}

/**
 * Props pour le composant CreatureColorsPanel
 */
interface CreatureColorsPanelProps {
  /** Traits visuels du monstre contenant les couleurs */
  traits: MonsterTraits
}

/**
 * Panneau d'affichage de la palette de couleurs du monstre
 *
 * Responsabilité unique : afficher toutes les couleurs composant
 * le monstre dans une grille d'échantillons.
 *
 * Applique SRP en déléguant l'affichage de chaque couleur à ColorSwatch.
 *
 * @param {CreatureColorsPanelProps} props - Props du composant
 * @returns {React.ReactNode} Panneau de couleurs
 *
 * @example
 * <CreatureColorsPanel traits={monsterTraits} />
 */
export function CreatureColorsPanel ({ traits }: CreatureColorsPanelProps): React.ReactNode {
  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-4 border-lochinvar-200'>
      <h2 className='text-2xl font-bold text-lochinvar-600 mb-4'>
        Palette de couleurs
      </h2>
      <div className='grid grid-cols-3 gap-3'>
        <ColorSwatch label='Corps' color={traits.bodyColor} />
        <ColorSwatch label='Accent' color={traits.accentColor} />
        <ColorSwatch label='Yeux' color={traits.eyeColor} />
        <ColorSwatch label='Antenne' color={traits.antennaColor} />
        <ColorSwatch label='Bobble' color={traits.bobbleColor} />
        <ColorSwatch label='Joues' color={traits.cheekColor} />
      </div>
    </div>
  )
}
