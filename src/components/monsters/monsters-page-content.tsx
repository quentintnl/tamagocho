'use client'

import { authClient } from '@/lib/auth-client'
import type { PopulatedMonster } from '@/types/monster'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'
import { MonsterCard } from '@/components/monsters/monster-card'
import { EmptyMonstersState } from '@/components/monsters/empty-monsters-state'
import { useMonsterRefresh } from '@/hooks/dashboard'
import Button from '@/components/button'

type Session = typeof authClient.$Infer.Session

/**
 * Props pour le composant MonstersPageContent
 */
interface MonstersPageContentProps {
  /** Session utilisateur Better Auth */
  session: Session
  /** Liste initiale des monstres de l'utilisateur */
  monsters: PopulatedMonster[]
}

/**
 * Composant principal de la page de galerie de monstres
 *
 * Responsabilité unique : afficher tous les monstres de l'utilisateur
 * dans une galerie complète avec mise à jour automatique.
 *
 * Applique les principes SOLID :
 * - SRP : Délègue l'affichage de chaque monstre à MonsterCard
 * - OCP : Extensible via l'ajout de filtres/tris
 * - DIP : Dépend du hook useMonsterRefresh pour la mise à jour
 *
 * @param {MonstersPageContentProps} props - Props du composant
 * @returns {React.ReactNode} Page complète avec galerie de monstres
 *
 * @example
 * <MonstersPageContent session={session} monsters={monsters} />
 */
export default function MonstersPageContent ({
  session,
  monsters: initialMonsters
}: MonstersPageContentProps): React.ReactNode {
  // Hook pour le rafraîchissement automatique des monstres
  const { monsters } = useMonsterRefresh(initialMonsters, 1000)


  /**
   * Redirige vers la page de création de monstre
   */
  const handleCreateMonster = (): void => {
    window.location.href = '/sign-in' // ou la route de création appropriée
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-moccaccino-100 via-white to-fuchsia-blue-100'>
      {/* Système de mise à jour automatique des monstres */}
      <MonstersAutoUpdater
        userId={session.user.id}
      />

      {/* Header avec wallet */}
      <PageHeaderWithWallet
        title='Mes Monstres'
        showBackButton={true}
        backUrl='/dashboard'
        showDashboardButton={false}
        showMonstersButton={false}
      />

      {/* Contenu principal */}
      <main className='container relative mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {/* Décoration de fond */}
        <div
          className='pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-lochinvar-200/30 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute bottom-40 right-1/4 h-96 w-96 rounded-full bg-fuchsia-blue-200/30 blur-3xl'
          aria-hidden='true'
        />

        {/* Section de bienvenue */}
        <div className='relative mb-8 text-center'>
          <h1 className='mb-2 text-4xl font-bold text-slate-900 sm:text-5xl'>
            🎮 Ma Collection de Monstres
          </h1>
          <p className='text-lg text-slate-600'>
            {monsters.length === 0
              ? 'Adoptez votre premier monstre pour commencer l\'aventure !'
              : `Vous avez ${monsters.length} monstre${monsters.length > 1 ? 's' : ''} dans votre collection`}
          </p>
        </div>

        {/* Grille de monstres ou état vide */}
        {monsters.length === 0
          ? (
            <div className='relative flex min-h-[500px] flex-col items-center justify-center gap-6'>
              <EmptyMonstersState />
              <Button
                variant='primary'
                size='lg'
                onClick={handleCreateMonster}
              >
                ➕ Créer mon premier monstre
              </Button>
            </div>
            )
          : (
            <div className='relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {monsters.map((monster) => (
                <MonsterCard
                  key={monster._id}
                  id={monster._id}
                  name={monster.name}
                  traits={monster.traits}
                  state={monster.state}
                  level={monster.level_id?.level ?? 1}
                  createdAt={String(monster.createdAt)}
                  updatedAt={String(monster.updatedAt)}
                />
              ))}
            </div>
            )}

        {/* Actions rapides */}
        {monsters.length > 0 && (
          <div className='relative mt-12 flex justify-center gap-4'>
            <Button
              variant='primary'
              size='lg'
              onClick={handleCreateMonster}
            >
              ➕ Créer un nouveau monstre
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

