import Button from '../button'
import type { UserDisplay } from '@/hooks/dashboard'

/**
 * Props pour le composant WelcomeHero
 */
interface WelcomeHeroProps {
  /** Informations d'affichage de l'utilisateur */
  userDisplay: UserDisplay
  /** Callback pour créer un nouveau monstre */
  onCreateMonster: () => void
  /** Callback pour se déconnecter */
  onLogout: () => void
}

/**
 * Section héro de bienvenue du dashboard
 *
 * Responsabilité unique : afficher le message de bienvenue personnalisé
 * et les actions principales (créer un monstre, se déconnecter).
 *
 * @param {WelcomeHeroProps} props - Props du composant
 * @returns {React.ReactNode} Section de bienvenue
 *
 * @example
 * <WelcomeHero
 *   userDisplay={userDisplay}
 *   onCreateMonster={handleCreateMonster}
 *   onLogout={handleLogout}
 * />
 */
export function WelcomeHero ({
  userDisplay,
  onCreateMonster,
  onLogout
}: WelcomeHeroProps): React.ReactNode {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-meadow-100 via-white to-sky-100 p-6 sm:p-8 shadow-xl border-4 border-white/80'>
      {/* Motif décoratif de fond */}
      <div className='absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-sunset-200/50 to-gold-200/30 blur-2xl' aria-hidden='true' />
      <div className='absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-tr from-lavender-200/50 to-meadow-200/30 blur-2xl' aria-hidden='true' />

      <div className='relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
        {/* Message de bienvenue */}
        <div className='space-y-3 flex-1'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 shadow-md border-2 border-meadow-200/60'>
            <span className='text-lg' aria-hidden='true'>👋</span>
            <span className='text-sm font-bold text-forest-700'>
              Salut, {userDisplay.displayName}!
            </span>
          </div>

          <h1 className='text-3xl sm:text-4xl font-black text-forest-800 leading-tight'>
            Ton Jardin de Petits Monstres
            <span className='ml-2 inline-block animate-bounce' style={{ animationDuration: '2s' }}>🌿</span>
          </h1>

          <p className='text-base text-forest-600 leading-relaxed max-w-2xl'>
            Prends soin de tes créatures fruits & légumes ! Nourris-les, joue avec elles et regarde-les grandir.
          </p>
        </div>

        {/* Actions principales */}
        <div className='flex flex-col gap-3 sm:min-w-[200px]'>
          <Button size='lg' onClick={onCreateMonster}>
            <span className='text-lg mr-2'>🌱</span>
            Créer un monstre
          </Button>
          <Button size='md' variant='ghost' onClick={onLogout}>
            <span className='mr-2'>👋</span>
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  )
}
