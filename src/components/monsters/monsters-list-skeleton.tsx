/**
 * Skeleton pour une carte de monstre individuelle
 *
 * Reproduit la structure de MonsterCard pour un chargement cohérent.
 *
 * Responsabilité unique : afficher un skeleton d'une carte de monstre.
 *
 * @returns {React.ReactNode} Skeleton d'une carte de monstre
 *
 * @example
 * <MonsterCardSkeleton />
 */
export function MonsterCardSkeleton (): React.ReactNode {
  return (
    <article className='relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white to-meadow-50/60 p-6 shadow-[0_20px_54px_rgba(22,101,52,0.12)] ring-2 ring-meadow-200/60 backdrop-blur'>
      {/* Bulles décoratives - thème nature */}
      <div
        className='pointer-events-none absolute -right-16 top-20 h-40 w-40 rounded-full bg-lavender-100/40 blur-3xl'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-sky-100/40 blur-3xl'
        aria-hidden='true'
      />

      <div className='relative flex flex-col gap-5'>
        {/* Zone de rendu du monstre */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50/50 to-sky-50/50 p-4 ring-1 ring-meadow-200/50 shadow-inner'>
          <div className='h-48 w-full animate-pulse rounded-2xl bg-gradient-to-br from-meadow-100 to-sky-100' />
        </div>

        {/* Informations textuelles */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 space-y-2'>
              <div className='h-6 w-32 animate-pulse rounded-lg bg-forest-200/50' />
              <div className='h-4 w-24 animate-pulse rounded-lg bg-forest-100/50' />
            </div>
            <div className='h-8 w-20 animate-pulse rounded-full bg-sunset-100/50' />
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Props pour le composant MonstersListSkeleton
 */
interface MonstersListSkeletonProps {
  /** Nombre de cartes skeleton à afficher */
  count?: number
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * Skeleton pour la liste complète de monstres
 *
 * Affiche une grille de cartes skeleton pendant le chargement.
 *
 * Responsabilité unique : orchestrer l'affichage de plusieurs skeletons de cartes.
 *
 * @param {MonstersListSkeletonProps} props - Props du composant
 * @returns {React.ReactNode} Grille de skeletons de monstres
 *
 * @example
 * <MonstersListSkeleton count={6} />
 */
export function MonstersListSkeleton ({ count = 6, className }: MonstersListSkeletonProps): React.ReactNode {
  return (
    <section className={`mt-12 w-full space-y-8 ${className ?? ''}`}>
      <header className='space-y-2'>
        <div className='h-8 w-64 animate-pulse rounded-lg bg-slate-200' />
        <div className='h-5 w-96 animate-pulse rounded-lg bg-slate-100' />
      </header>

      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {[...Array(count)].map((_, i) => (
          <MonsterCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}

