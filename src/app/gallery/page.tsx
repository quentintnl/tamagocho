import { getPublicMonsters } from '@/actions/monsters'
import { GalleryPageClient } from '@/components/gallery/gallery-page-client'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'

/**
 * Page de la galerie communautaire
 *
 * Cette page server-side récupère les monstres publics initiaux
 * et affiche la galerie communautaire avec filtres et pagination.
 *
 * Responsabilité unique : récupérer les données initiales et
 * afficher la page de galerie.
 *
 * @async
 * @returns {Promise<React.ReactNode>} Page de galerie communautaire
 *
 * @example
 * // Accès direct à la route
 * // GET /gallery
 */
export default async function GalleryPage (): Promise<React.ReactNode> {
  // Récupération des monstres publics initiaux (page 1, tri par date)
  const initialData = await getPublicMonsters(
    { sortBy: 'createdAt', sortOrder: 'desc' },
    { page: 1, limit: 12 }
  )

  console.log('[GalleryPage] Initial data fetched:', initialData)
  console.log('[GalleryPage] Monsters count:', initialData.monsters.length)

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet />

      {/* Motifs décoratifs de fond animés - thème fruits & légumes */}
      <div className='pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-sunset-200/40 via-gold-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '8s' }} />
      <div className='pointer-events-none absolute -left-24 bottom-40 h-96 w-96 rounded-full bg-gradient-to-tr from-meadow-200/50 via-forest-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '10s' }} />
      <div className='pointer-events-none absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-gradient-to-bl from-lavender-200/40 via-sky-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '12s' }} />

      <div className='relative z-10 py-12'>
        <div className='container mx-auto px-4 max-w-7xl'>
          {/* En-tête de la page */}
          <header className='mb-8'>
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-100 p-8 sm:p-10 shadow-xl border-4 border-white/80'>
              {/* Motif décoratif de fond */}
              <div className='absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-blue-200/50 to-lavender-200/30 blur-2xl' aria-hidden='true' />
              <div className='absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-tr from-sky-200/50 to-meadow-200/30 blur-2xl' aria-hidden='true' />

              <div className='relative text-center space-y-4'>
                <div className='inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 shadow-md border-2 border-lavender-200/60'>
                  <span className='text-2xl' aria-hidden='true'>🌍</span>
                  <span className='text-sm font-bold text-forest-700'>
                    Galerie Communautaire
                  </span>
                </div>

                <h1 className='text-4xl sm:text-5xl font-black text-forest-800 leading-tight'>
                  Découvre les Créatures du Monde
                  <span className='ml-3 inline-block' style={{ animation: 'bounce 2s infinite' }}>🎨</span>
                </h1>

                <p className='text-lg text-forest-600 leading-relaxed max-w-2xl mx-auto'>
                  Explore les petits monstres partagés par la communauté ! Admire leurs couleurs, leurs formes et laisse-toi inspirer pour créer tes propres créatures.
                </p>
              </div>
            </div>
          </header>

          {/* Contenu client avec filtres et galerie */}
          <GalleryPageClient initialData={initialData} />
        </div>
      </div>
    </div>
  )
}
