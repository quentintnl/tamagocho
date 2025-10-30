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
      <div className='inline-flex items-center gap-3 rounded-full border-2 border-meadow-200/80 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-forest-700 shadow-sm'>
        <span aria-hidden='true'>🌿</span>
        <span>Hey {userDisplay.displayName}</span>
      </div>

      <h1 className='text-4xl font-black text-forest-800 sm:text-5xl leading-tight'>
        Bienvenue dans ton havre de paix 🌱
      </h1>

      <p className='text-base text-forest-600 sm:text-lg leading-relaxed'>
        Prenez soin de vos créatures adorables dans un petit écosystème zen. Observez-les grandir paisiblement au rythme de la nature.
      </p>

      <div className='flex flex-wrap items-center gap-3'>
        <Button size='lg' onClick={onCreateMonster}>
          🌸 Créer une créature
        </Button>
        <Button size='lg' variant='ghost' onClick={onLogout}>
          👋 Se déconnecter
        </Button>
      </div>
    </div>
  )
}
