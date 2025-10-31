import type { UserDisplay } from '@/hooks/dashboard'

/**
 * Props pour le composant UserProfileCard
 */
interface UserProfileCardProps {
  /** Informations d'affichage de l'utilisateur */
  userDisplay: UserDisplay
}

/**
 * Carte de profil utilisateur affichée dans le dashboard
 *
 * Responsabilité unique : afficher l'avatar, le rôle et l'email
 * de l'utilisateur connecté.
 *
 * @param {UserProfileCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de profil utilisateur
 *
 * @example
 * <UserProfileCard userDisplay={userDisplay} />
 */
export function UserProfileCard ({ userDisplay }: UserProfileCardProps): React.ReactNode {
  return (
    <div className='h-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-50 p-6 shadow-xl border-4 border-white/80 hover:shadow-2xl transition-shadow duration-300'>
      {/* Motif décoratif de fond */}
      <div className='absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-lavender-300/40 to-sky-300/30 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-tr from-meadow-300/30 to-gold-300/20 blur-2xl' aria-hidden='true' />

      <div className='relative flex flex-col items-center text-center space-y-4'>
        {/* Avatar avec badge */}
        <div className='relative'>
          <div className='flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br from-sunset-400 to-sunset-600 text-4xl font-black text-white shadow-2xl border-4 border-white transform hover:scale-110 transition-transform duration-300'>
            {userDisplay.initial}
          </div>
          {/* Badge gardien */}
          <div className='absolute -bottom-2 -right-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full px-3 py-1 shadow-lg border-2 border-white'>
            <span className='text-white text-xs font-black'>🌟</span>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className='space-y-2'>
          <div className='inline-flex items-center gap-2 rounded-full bg-lavender-100 border-2 border-lavender-200 px-4 py-1.5 shadow-sm'>
            <span className='text-xs' aria-hidden='true'>🏅</span>
            <span className='text-xs font-bold uppercase tracking-wider text-lavender-700'>
              Gardien·ne
            </span>
          </div>

          <h3 className='text-xl font-black text-forest-800'>
            {userDisplay.displayName}
          </h3>

          <p className='text-sm text-forest-600 font-medium'>
            {userDisplay.email}
          </p>
        </div>

        {/* Petite décoration en bas */}
        <div className='flex items-center gap-1 pt-2'>
          <span className='text-2xl' aria-hidden='true'>🌱</span>
          <span className='text-2xl' aria-hidden='true'>🍅</span>
          <span className='text-2xl' aria-hidden='true'>🥕</span>
        </div>
      </div>
    </div>
  )
}
