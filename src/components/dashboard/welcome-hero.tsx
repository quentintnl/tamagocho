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
    <div className='max-w-xl space-y-6'>
      <div className='inline-flex items-center gap-3 rounded-full border border-moccaccino-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-moccaccino-500'>
        <span aria-hidden='true'>🌈</span>
        <span>Hey {userDisplay.displayName}</span>
      </div>

      <h1 className='text-4xl font-black text-slate-900 sm:text-5xl'>
        Bienvenue dans ton QG Tamagotcho
      </h1>

      <p className='text-base text-slate-600 sm:text-lg'>
        Dompte des créatures adorables, surveille leur humeur et transforme chaque journée en mini-aventure numérique.
      </p>

      <div className='flex flex-wrap items-center gap-3'>
        <Button size='lg' onClick={onCreateMonster}>
          Créer une créature
        </Button>
        <Button size='lg' variant='ghost' onClick={onLogout}>
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
