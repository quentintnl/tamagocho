import { getMonsters } from '@/actions/monsters'
import MonstersPageContent from '@/components/monsters/monsters-page-content'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'

/**
 * Skeleton pour une carte de monstre individuelle
 *
 * Reproduit la structure de MonsterCard pour un chargement cohérent.
 *
 * @returns {React.ReactNode} Skeleton d'une carte de monstre
 */
function MonsterCardSkeleton (): React.ReactNode {
  const decorativeBubbleClass = 'pointer-events-none absolute rounded-full blur-3xl'

  return (
    <article className='relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-white to-meadow-50/60 p-6 shadow-[0_20px_54px_rgba(22,101,52,0.12)] ring-2 ring-meadow-200/60 backdrop-blur'>
      <div
        className={`${decorativeBubbleClass} -right-16 top-20 h-40 w-40 bg-lavender-100/40`}
        aria-hidden='true'
      />
      <div
        className={`${decorativeBubbleClass} -left-20 -top-16 h-48 w-48 bg-sky-100/40`}
        aria-hidden='true'
      />

      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50/50 to-sky-50/50 p-4 ring-1 ring-meadow-200/50 shadow-inner'>
          <div className='h-48 w-full animate-pulse rounded-2xl bg-gradient-to-br from-meadow-100 to-sky-100' />
        </div>

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
 * État de chargement pour la page de liste des monstres
 *
 * @returns {React.ReactNode} Skeleton de la page de liste
 */
function MonstersLoadingSkeleton (): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50'>
      <PageHeaderWithWallet />

      <div className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='mb-8 space-y-4'>
            <div className='h-10 w-64 animate-pulse rounded-lg bg-slate-200' />
            <div className='h-6 w-96 animate-pulse rounded-lg bg-slate-100' />
          </div>

          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <MonsterCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Composant asynchrone pour charger les monstres
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu de la page monstres
 */
async function MonstersContent (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  const monsters = await getMonsters()

  return (
    <MonstersPageContent session={session} monsters={monsters} />
  )
}

/**
 * Page listant tous les monstres de l'utilisateur
 *
 * Cette page server side vérifie l'authentification de l'utilisateur,
 * récupère tous ses monstres depuis la base de données, et affiche
 * une galerie complète via le composant client MonstersPageContent.
 *
 * Utilise Suspense pour afficher un skeleton pendant le chargement.
 *
 * Responsabilité unique : Servir de point d'entrée pour la page des monstres
 * avec protection d'authentification et gestion du chargement.
 *
 * @returns {React.ReactNode} Le contenu de la page monstres avec Suspense
 *
 * @example
 * // Accès direct à la route
 * // GET /monsters
 */
export default function MonstersPage (): React.ReactNode {
  return (
    <Suspense fallback={<MonstersLoadingSkeleton />}>
      <MonstersContent />
    </Suspense>
  )
}

