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
  return (
    <article className='relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50/30 to-meadow-50/40 p-6 shadow-xl border-4 border-white/90 backdrop-blur animate-pulse'>
      {/* Motifs décoratifs */}
      <div className='absolute -right-12 top-16 h-32 w-32 rounded-full bg-lavender-200/20 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-12 -top-12 h-36 w-36 rounded-full bg-sunset-200/15 blur-2xl' aria-hidden='true' />

      <div className='relative flex flex-col gap-5'>
        {/* Zone de rendu du monstre skeleton */}
        <div className='flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-50 via-white to-sky-50 p-6 border-3 border-meadow-200/50 shadow-inner'>
          <div className='h-48 w-48 rounded-2xl bg-gradient-to-br from-meadow-100 to-sky-100' />
        </div>

        {/* Informations skeleton */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1 space-y-2'>
              <div className='h-7 w-32 rounded-lg bg-forest-200/50' />
              <div className='h-4 w-24 rounded-lg bg-forest-100/50' />
            </div>
            <div className='h-9 w-24 rounded-2xl bg-gold-200/50' />
          </div>
          {/* Barre de progression skeleton */}
          <div className='flex gap-1'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-1.5 flex-1 rounded-full bg-forest-100/50' />
            ))}
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
    <div className='min-h-screen bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100'>
      <PageHeaderWithWallet />

      <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {/* En-tête skeleton */}
        <div className='mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-100 via-white to-sky-100 p-8 shadow-xl border-4 border-white/80 animate-pulse'>
          <div className='text-center space-y-4'>
            <div className='h-12 w-48 mx-auto rounded-full bg-white/50' />
            <div className='h-12 w-96 max-w-full mx-auto rounded-lg bg-forest-200/30' />
            <div className='h-6 w-64 max-w-full mx-auto rounded-lg bg-forest-100/30' />
            <div className='h-12 w-64 mx-auto rounded-xl bg-meadow-200/30' />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className='mb-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='rounded-2xl bg-white/60 p-5 shadow-lg border-2 border-meadow-200/50 animate-pulse'>
              <div className='flex items-center gap-3'>
                <div className='h-12 w-12 rounded-xl bg-meadow-200/50' />
                <div className='space-y-2'>
                  <div className='h-8 w-12 rounded bg-forest-200/50' />
                  <div className='h-3 w-16 rounded bg-forest-100/50' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grille skeleton */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {[...Array(8)].map((_, i) => (
            <MonsterCardSkeleton key={i} />
          ))}
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

