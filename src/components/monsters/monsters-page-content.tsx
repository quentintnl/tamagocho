'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  // Hook pour le rafraîchissement automatique des monstres (toutes les minutes)
  const { monsters } = useMonsterRefresh(initialMonsters, 60000)

  /**
   * Redirige vers la page de création de monstre avec ouverture automatique du modal
   * Mémorisée avec useCallback pour éviter les re-créations inutiles
   */
  const handleCreateMonster = useCallback((): void => {
    router.push('/dashboard?openModal=true') // Redirige vers dashboard et ouvre le modal de création
  }, [router])

  /**
   * Grille de monstres mémorisée pour éviter les re-rendus inutiles
   */
  const monstersGrid = useMemo(() => (
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
  ), [monsters])

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100'>
      {/* Système de mise à jour automatique des monstres */}
      <MonstersAutoUpdater
        userId={session.user.id}
      />

      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Ma Collection' />

      {/* Motifs décoratifs de fond animés - thème fruits & légumes */}
      <div className='pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-sunset-200/40 via-gold-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '8s' }} />
      <div className='pointer-events-none absolute -left-24 bottom-40 h-96 w-96 rounded-full bg-gradient-to-tr from-meadow-200/50 via-forest-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '10s' }} />
      <div className='pointer-events-none absolute right-1/3 top-1/3 h-80 w-80 rounded-full bg-gradient-to-bl from-lavender-200/40 via-sky-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '12s' }} />

      {/* Contenu principal */}
      <main className='container relative z-10 mx-auto px-4 py-8 sm:px-6 lg:px-8 pb-24'>

        {/* Grille de monstres ou état vide */}
        {monsters.length === 0
          ? (
            <div className='relative flex min-h-[400px] flex-col items-center justify-center'>
              <EmptyMonstersState />
            </div>
            )
          : (
            <>
              {/* Statistiques rapides */}
              <div className='mb-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-meadow-100 via-white to-forest-50 p-5 shadow-lg border-2 border-meadow-200/80 hover:shadow-xl transition-all'>
                  <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
                  <div className='relative flex items-center gap-3'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-meadow-400 to-forest-500 shadow-lg text-xl border-2 border-white/80'>
                      🌱
                    </div>
                    <div>
                      <p className='text-2xl font-black text-forest-800'>{monsters.length}</p>
                      <p className='text-xs font-bold text-meadow-700'>Total</p>
                    </div>
                  </div>
                </div>

                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-lavender-50 p-5 shadow-lg border-2 border-sky-200/80 hover:shadow-xl transition-all'>
                  <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
                  <div className='relative flex items-center gap-3'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400 to-lavender-500 shadow-lg text-xl border-2 border-white/80'>
                      ⭐
                    </div>
                    <div>
                      <p className='text-2xl font-black text-forest-800'>{Math.max(...monsters.map(m => m.level_id?.level ?? 1))}</p>
                      <p className='text-xs font-bold text-sky-700'>Niveau Max</p>
                    </div>
                  </div>
                </div>

                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-sunset-100 via-white to-gold-50 p-5 shadow-lg border-2 border-sunset-200/80 hover:shadow-xl transition-all'>
                  <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
                  <div className='relative flex items-center gap-3'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-sunset-400 to-gold-500 shadow-lg text-xl border-2 border-white/80'>
                      😊
                    </div>
                    <div>
                      <p className='text-2xl font-black text-forest-800'>{monsters.filter(m => m.state === 'happy').length}</p>
                      <p className='text-xs font-bold text-sunset-700'>Heureux</p>
                    </div>
                  </div>
                </div>

                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-lavender-100 via-white to-fuchsia-blue-50 p-5 shadow-lg border-2 border-lavender-200/80 hover:shadow-xl transition-all'>
                  <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30 blur-xl' aria-hidden='true' />
                  <div className='relative flex items-center gap-3'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-lavender-400 to-fuchsia-blue-500 shadow-lg text-xl border-2 border-white/80'>
                      😴
                    </div>
                    <div>
                      <p className='text-2xl font-black text-forest-800'>{monsters.filter(m => m.state === 'sleepy').length}</p>
                      <p className='text-xs font-bold text-lavender-700'>Endormis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grille de monstres */}
              {monstersGrid}
            </>
            )}
      </main>
    </div>
  )
}
