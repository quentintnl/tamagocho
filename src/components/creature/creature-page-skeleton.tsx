import PageHeaderWithWallet from '@/components/page-header-with-wallet'

/**
 * Props pour le composant CreaturePageSkeleton
 */
interface CreaturePageSkeletonProps {
  /** Afficher le header avec wallet (true par défaut pour la page de détail) */
  showHeader?: boolean
}

/**
 * Skeleton réutilisable pour la page de détail d'une créature
 *
 * Reproduit exactement la structure de CreaturePageClient pour une transition fluide.
 * Peut être utilisé dans loading.tsx ou comme état de chargement dans les composants.
 *
 * Responsabilité unique : afficher un skeleton loader cohérent avec la structure réelle.
 *
 * @param {CreaturePageSkeletonProps} props - Props du composant
 * @returns {React.ReactNode} Skeleton de la page de créature
 *
 * @example
 * // Dans loading.tsx
 * export default function Loading() {
 *   return <CreaturePageSkeleton />
 * }
 *
 * @example
 * // Dans un composant avec état de chargement conditionnel
 * {isLoading ? <CreaturePageSkeleton showHeader={false} /> : <CreatureContent />}
 */
export function CreaturePageSkeleton ({ showHeader = true }: CreaturePageSkeletonProps): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50'>
      {/* Header avec wallet et bouton retour */}
      {showHeader && <PageHeaderWithWallet />}

      <div className='py-12'>
        <div className='container mx-auto max-w-4xl px-4'>
          {/* En-tête avec nom et niveau - CreatureHeader skeleton */}
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-2 h-12 w-64 animate-pulse rounded-lg bg-moccaccino-200/50' />
            <div className='mx-auto h-6 w-32 animate-pulse rounded-lg bg-lochinvar-200/50' />
          </div>

          {/* Grille principale : monstre + informations */}
          <div className='grid gap-8 md:grid-cols-2'>
            {/* Colonne gauche : Monstre animé et actions - CreatureMonsterDisplay skeleton */}
            <div className='space-y-6'>
              <div className='rounded-3xl border-4 border-lochinvar-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm'>
                {/* Zone d'affichage du monstre animé */}
                <div className='mx-auto aspect-square max-w-md'>
                  <div className='h-full w-full animate-pulse rounded-2xl bg-gradient-to-br from-lochinvar-100 to-fuchsia-blue-100' />
                </div>

                {/* Badge d'état du monstre */}
                <div className='mt-6 text-center'>
                  <div className='mx-auto h-12 w-48 animate-pulse rounded-full border-2 border-moccaccino-300 bg-gradient-to-r from-moccaccino-100 to-fuchsia-blue-100' />
                </div>

                {/* Actions disponibles - MonsterActions skeleton */}
                <div className='mt-6 grid grid-cols-2 gap-4'>
                  <div className='h-20 animate-pulse rounded-2xl bg-gradient-to-br from-moccaccino-100 to-moccaccino-50 shadow-md' />
                  <div className='h-20 animate-pulse rounded-2xl bg-gradient-to-br from-lochinvar-100 to-lochinvar-50 shadow-md' />
                  <div className='h-20 animate-pulse rounded-2xl bg-gradient-to-br from-fuchsia-blue-100 to-fuchsia-blue-50 shadow-md' />
                  <div className='h-20 animate-pulse rounded-2xl bg-gradient-to-br from-moccaccino-100 to-moccaccino-50 shadow-md' />
                </div>
              </div>
            </div>

            {/* Colonne droite : Panneaux d'informations */}
            <div className='space-y-6'>
              {/* CreatureStatsPanel skeleton */}
              <div className='rounded-3xl border-4 border-moccaccino-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm'>
                <div className='mb-4 h-8 w-40 animate-pulse rounded-lg bg-moccaccino-200/50' />

                {/* Barre de progression XP */}
                <div className='mb-6'>
                  <div className='mb-2 flex justify-between'>
                    <div className='h-4 w-20 animate-pulse rounded bg-slate-200' />
                    <div className='h-4 w-16 animate-pulse rounded bg-slate-200' />
                  </div>
                  <div className='h-4 w-full animate-pulse rounded-full bg-slate-200' />
                </div>

                {/* Statistiques */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between border-b border-gray-200 py-2'>
                    <div className='h-5 w-20 animate-pulse rounded bg-slate-200' />
                    <div className='h-5 w-12 animate-pulse rounded bg-slate-200' />
                  </div>
                  <div className='flex items-center justify-between border-b border-gray-200 py-2'>
                    <div className='h-5 w-16 animate-pulse rounded bg-slate-200' />
                    <div className='h-5 w-24 animate-pulse rounded bg-slate-200' />
                  </div>
                  <div className='flex items-center justify-between border-b border-gray-200 py-2'>
                    <div className='h-5 w-32 animate-pulse rounded bg-slate-200' />
                    <div className='h-5 w-28 animate-pulse rounded bg-slate-200' />
                  </div>
                  <div className='flex items-center justify-between py-2'>
                    <div className='h-5 w-36 animate-pulse rounded bg-slate-200' />
                    <div className='h-5 w-28 animate-pulse rounded bg-slate-200' />
                  </div>
                </div>
              </div>

              {/* CreatureTraitsPanel skeleton */}
              <div className='rounded-3xl border-4 border-fuchsia-blue-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm'>
                <div className='mb-4 h-8 w-48 animate-pulse rounded-lg bg-fuchsia-blue-200/50' />
                <div className='space-y-3'>
                  <div className='flex items-center justify-between border-b border-fuchsia-blue-100 py-2'>
                    <div className='h-5 w-28 animate-pulse rounded bg-fuchsia-blue-200/50' />
                    <div className='h-5 w-20 animate-pulse rounded bg-fuchsia-blue-200/50' />
                  </div>
                  <div className='flex items-center justify-between border-b border-fuchsia-blue-100 py-2'>
                    <div className='h-5 w-24 animate-pulse rounded bg-fuchsia-blue-200/50' />
                    <div className='h-5 w-24 animate-pulse rounded bg-fuchsia-blue-200/50' />
                  </div>
                  <div className='flex items-center justify-between border-b border-fuchsia-blue-100 py-2'>
                    <div className='h-5 w-20 animate-pulse rounded bg-fuchsia-blue-200/50' />
                    <div className='h-5 w-28 animate-pulse rounded bg-fuchsia-blue-200/50' />
                  </div>
                  <div className='flex items-center justify-between py-2'>
                    <div className='h-5 w-24 animate-pulse rounded bg-fuchsia-blue-200/50' />
                    <div className='h-5 w-16 animate-pulse rounded bg-fuchsia-blue-200/50' />
                  </div>
                </div>
              </div>

              {/* PublicStatusToggle skeleton */}
              <div className='rounded-3xl border-4 border-lochinvar-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm'>
                <div className='flex items-center justify-between'>
                  <div className='h-6 w-40 animate-pulse rounded bg-slate-200' />
                  <div className='h-8 w-14 animate-pulse rounded-full bg-slate-200' />
                </div>
              </div>
            </div>
          </div>

          {/* Gestionnaire d'accessoires possédés - Pleine largeur - OwnedAccessoriesManager skeleton */}
          <div className='mt-8'>
            <div className='rounded-3xl border-4 border-moccaccino-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm'>
              <div className='mb-6 h-8 w-56 animate-pulse rounded-lg bg-moccaccino-200/50' />
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className='h-32 animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-md'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
