import type { DBMonster } from '@/types/monster'
import { EmptyMonstersState } from './empty-monsters-state'
import { MonsterCard } from './monster-card'

/**
 * Props pour le composant MonstersList
 */
interface MonstersListProps {
  /** Liste des monstres de l'utilisateur */
  monsters: DBMonster[]
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * Liste d'affichage de tous les monstres de l'utilisateur
 *
 * Responsabilité unique : orchestrer l'affichage de la grille de monstres
 * ou de l'état vide selon le contenu.
 *
 * Applique SRP en déléguant :
 * - L'affichage de l'état vide à EmptyMonstersState
 * - L'affichage de chaque monstre à MonsterCard
 *
 * @param {MonstersListProps} props - Props du composant
 * @returns {React.ReactNode} Grille de monstres ou état vide
 *
 * @example
 * <MonstersList monsters={monsters} className="mt-12" />
 */
function MonstersList ({ monsters, className }: MonstersListProps): React.ReactNode {
  // Affichage de l'état vide si aucun monstre
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return <EmptyMonstersState className={className} />
  }

  return (
    <section className={`mt-12 w-full space-y-8 ${className ?? ''}`}>
      <header className='space-y-2'>
        <h2 className='text-2xl font-bold text-slate-900'>Tes compagnons animés</h2>
        <p className='text-sm text-slate-600'>
          Un coup d&apos;oeil rapide sur ta ménagerie digitale pour préparer la prochaine aventure.
        </p>
      </header>

      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {monsters.map((monster) => {
          const cardKey = monster._id

          return (
            <MonsterCard
              key={cardKey}
              id={cardKey}
              name={monster.name}
              traits={monster.traits}
              state={monster.state}
              level={monster.level}
              createdAt={String(monster.createdAt)}
              updatedAt={String(monster.updatedAt)}
            />
          )
        })}
      </div>
    </section>
  )
}

export default MonstersList
