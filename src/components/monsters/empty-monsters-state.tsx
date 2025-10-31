import { mergeClasses } from '@/lib/utils'

/**
 * Props pour le composant EmptyMonstersState
 */
interface EmptyMonstersStateProps {
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * État vide affiché quand l'utilisateur n'a pas encore de monstres
 *
 * Responsabilité unique : afficher un message d'encouragement
 * quand la liste des monstres est vide.
 *
 * @param {EmptyMonstersStateProps} props - Props du composant
 * @returns {React.ReactNode} État vide stylisé
 *
 * @example
 * <EmptyMonstersState className="mt-10" />
 */
export function EmptyMonstersState ({ className }: EmptyMonstersStateProps): React.ReactNode {
  return (
    <div
      className={mergeClasses(
        'relative overflow-hidden w-full rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-sky-100 p-10 sm:p-12 text-center shadow-2xl border-4 border-white/90',
        className
      )}
    >
      {/* Motifs décoratifs de fond */}
      <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-lavender-300/40 to-fuchsia-blue-300/30 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-gradient-to-tr from-meadow-300/30 to-sky-300/20 blur-2xl' aria-hidden='true' />

      <div className='relative space-y-6'>
        {/* Grosse icône centrale */}
        <div className='flex justify-center'>
          <div className='relative'>
            <div className='flex items-center justify-center h-32 w-32 rounded-3xl bg-gradient-to-br from-meadow-400 to-forest-500 shadow-2xl border-4 border-white text-6xl animate-bounce' style={{ animationDuration: '2s' }}>
              🌱
            </div>
            {/* Petites étoiles autour */}
            <div className='absolute -top-2 -right-2 text-2xl animate-pulse'>✨</div>
            <div className='absolute -bottom-2 -left-2 text-2xl animate-pulse' style={{ animationDelay: '0.5s' }}>🌟</div>
          </div>
        </div>

        {/* Titre accrocheur */}
        <div className='space-y-3'>
          <h2 className='text-3xl sm:text-4xl font-black text-forest-800 leading-tight'>
            Ton Jardin est Vide !
          </h2>
          <p className='text-lg text-forest-600 leading-relaxed max-w-md mx-auto'>
            Commence ton aventure magique en créant ton premier petit monstre fruit ou légume.
          </p>
        </div>

        {/* Liste de bénéfices */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-start sm:items-center text-left sm:text-center max-w-2xl mx-auto pt-4'>
          <div className='flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border-2 border-meadow-200/60'>
            <span className='text-2xl flex-shrink-0'>🍅</span>
            <div>
              <p className='text-sm font-bold text-forest-800'>Fruits & Légumes</p>
              <p className='text-xs text-forest-600'>Mignons et colorés</p>
            </div>
          </div>

          <div className='flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border-2 border-sky-200/60'>
            <span className='text-2xl flex-shrink-0'>⭐</span>
            <div>
              <p className='text-sm font-bold text-forest-800'>Évolution</p>
              <p className='text-xs text-forest-600'>Grandir ensemble</p>
            </div>
          </div>

          <div className='flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-md border-2 border-lavender-200/60'>
            <span className='text-2xl flex-shrink-0'>🎮</span>
            <div>
              <p className='text-sm font-bold text-forest-800'>Amusement</p>
              <p className='text-xs text-forest-600'>Joue et prends soin</p>
            </div>
          </div>
        </div>

        {/* Message encourageant */}
        <div className='pt-4'>
          <p className='text-sm font-medium text-forest-500 italic'>
            "Chaque grand jardin commence par une seule graine 🌱"
          </p>
        </div>
      </div>
    </div>
  )
}
