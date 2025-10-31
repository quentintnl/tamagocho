import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { MonstersListSkeleton } from '@/components/monsters/monsters-list-skeleton'

/**
 * État de chargement pour la page de liste des monstres
 *
 * Utilise le composant réutilisable MonstersListSkeleton pour éviter
 * la duplication de code CSS et maintenir la cohérence visuelle.
 *
 * @returns {React.ReactNode} Skeleton de la page de liste
 */
export default function Loading (): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet />

      <div className='py-12'>
        <div className='container mx-auto px-4'>
          {/* Page header skeleton */}
          <div className='mb-8 space-y-4'>
            <div className='h-10 w-64 animate-pulse rounded-lg bg-slate-200' />
            <div className='h-6 w-96 animate-pulse rounded-lg bg-slate-100' />
          </div>

          {/* Monsters grid skeleton avec composant réutilisable */}
          <MonstersListSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}

