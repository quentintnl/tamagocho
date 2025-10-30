import { getPublicMonsters } from '@/actions/monsters.actions'
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

  return (
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 via-white to-fuchsia-blue-50'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet />

      <div className='py-12'>
        <div className='container mx-auto px-4 max-w-7xl'>
          {/* En-tête de la page */}
          <header className='mb-12 text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4 sm:text-5xl'>
              🎨 Galerie Communautaire
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Découvrez les créatures les plus fascinantes partagées par la communauté.
              Explorez, admirez et laissez-vous inspirer !
            </p>
          </header>

          {/* Contenu client avec filtres et galerie */}
          <GalleryPageClient initialData={initialData} />
        </div>
      </div>
    </div>
  )
}

