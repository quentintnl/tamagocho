/**
 * Props pour le composant CreatureHeader
 */
interface CreatureHeaderProps {
  /** Nom du monstre */
  name: string
  /** Niveau du monstre */
  level: number
}

/**
 * En-tête de la page de détail d'une créature
 *
 * Responsabilité unique : afficher le nom et le niveau du monstre
 * dans un format visuellement attrayant.
 *
 * @param {CreatureHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête avec nom et niveau
 *
 * @example
 * <CreatureHeader name="Pikachu" level={5} />
 */
export function CreatureHeader ({ name, level }: CreatureHeaderProps): React.ReactNode {
  return (
    <div className='text-center mb-8'>
      <h1 className='text-5xl font-bold text-moccaccino-600 mb-2'>
        {name}
      </h1>
      <p className='text-lg text-lochinvar-700'>
        Niveau {level}
      </p>
    </div>
  )
}
