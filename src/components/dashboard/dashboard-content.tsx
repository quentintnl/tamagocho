'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters.actions'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type {PopulatedMonster} from '@/types/monster'
import {
  useUserDisplay,
  useMonsterStats,
  useLatestAdoptionLabel,
  useFavoriteMoodMessage,
  useQuests,
  useMonsterRefresh
} from '@/hooks/dashboard'
import CreateMonsterModal from './create-monster-modal'
import { WelcomeHero } from './welcome-hero'
import { UserProfileCard } from './user-profile-card'
import { StatsCard } from './stats-card'
import { QuestsSection } from './quests-section'
import { MoodTipSection } from './mood-tip-section'
import MonstersList from '../monsters/monsters-list'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'

type Session = typeof authClient.$Infer.Session

/**
 * Composant principal du contenu du dashboard
 *
 * Responsabilité unique : orchestrer l'affichage des différentes sections
 * du dashboard (bienvenue, statistiques, quêtes, monstres, etc.).
 *
 * Applique les principes SOLID :
 * - SRP : Délègue le calcul des stats et l'affichage UI aux hooks et sous-composants
 * - OCP : Extensible via l'ajout de nouveaux hooks/composants
 * - DIP : Dépend des abstractions (hooks) plutôt que des implémentations concrètes
 *
 * @param {Object} props - Props du composant
 * @param {Session} props.session - Session utilisateur Better Auth
 * @param {PopulatedMonster[]} props.monsters - Liste des monstres de l'utilisateur
 * @returns {React.ReactNode} Contenu complet du dashboard
 *
 * @example
 * <DashboardContent session={session} monsters={monsters} />
 */
function DashboardContent ({ session, monsters: initialMonsters }: { session: Session, monsters: PopulatedMonster[] }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hook pour le rafraîchissement automatique des monstres
  const { monsters } = useMonsterRefresh(initialMonsters, 1000)

  // Extraction des informations utilisateur
  const userDisplay = useUserDisplay(session)

  // Calcul des statistiques des monstres
  const stats = useMonsterStats(monsters)
  const latestAdoptionLabel = useLatestAdoptionLabel(stats.latestAdoption)
  const favoriteMoodMessage = useFavoriteMoodMessage(stats.favoriteMood, stats.totalMonsters)

  // Génération des quêtes
  const quests = useQuests(stats)

  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   */
  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  /**
   * Ouvre le modal de création de monstre
   */
  const handleCreateMonster = (): void => {
    setIsModalOpen(true)
  }

  /**
   * Ferme le modal de création de monstre
   */
  const handleCloseModal = (): void => {
    setIsModalOpen(false)
  }

  /**
   * Soumet le formulaire de création de monstre et recharge la page
   *
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire
   */
  const handleMonsterSubmit = (values: CreateMonsterFormValues): void => {
    void createMonster(values).then(() => {
      window.location.reload()
    })
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-meadow-50 to-lavender-50'>
      {/* Système de mise à jour automatique des monstres */}
      <MonstersAutoUpdater
        userId={session.user.id}
        minInterval={60000}  // 1 minute
        maxInterval={180000} // 3 minutes
        enabled={true}
        verbose={true}
        showIndicator={false}
      />

      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Dashboard' />

      {/* Bulles décoratives de fond - thème nature */}
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-meadow-200/50 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl' aria-hidden='true' />

      <main className='relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8'>
        {/* Section héro avec bienvenue et profil */}
        <section className='relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm px-6 py-10 shadow-[0_20px_60px_rgba(22,101,52,0.15)] ring-1 ring-meadow-200/60 sm:px-10'>
          {/* Bulles décoratives internes - thème nature */}
          <div className='pointer-events-none absolute -right-28 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-meadow-200/70 via-sky-200/50 to-white/40 blur-3xl' aria-hidden='true' />
          <div className='pointer-events-none absolute -left-32 bottom-0 h-64 w-64 translate-y-1/2 rounded-full bg-gradient-to-tr from-lavender-200/60 via-white/30 to-meadow-100/60 blur-3xl' aria-hidden='true' />

          <div className='relative flex flex-col gap-10 lg:flex-row lg:items-center'>
            {/* Message de bienvenue et actions principales */}
            <WelcomeHero
              userDisplay={userDisplay}
              onCreateMonster={handleCreateMonster}
              onLogout={handleLogout}
            />

            {/* Carte de profil et statistiques */}
            <div className='flex flex-1 flex-col gap-4 rounded-3xl bg-gradient-to-br from-meadow-100/80 via-white to-sky-100/70 p-6 ring-1 ring-meadow-200/70 backdrop-blur shadow-lg'>
              <UserProfileCard userDisplay={userDisplay} />

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <StatsCard
                  title='Compagnons'
                  value={stats.totalMonsters}
                  description="Monstres prêts pour l'aventure"
                  color='lochinvar'
                />
                <StatsCard
                  title='Niveau max'
                  value={stats.highestLevel}
                  description='Ton monstre le plus expérimenté'
                  color='fuchsia-blue'
                />
                <StatsCard
                  title='Dernière adoption'
                  value={latestAdoptionLabel}
                  description={stats.totalMonsters === 0 ? 'Ton prochain compagnon est à un clic !' : 'Continue de créer pour agrandir ta bande.'}
                  color='moccaccino'
                  fullWidth
                />
              </div>

              {/* Lien vers la page wallet */}
              <button
                onClick={() => { window.location.href = '/wallet' }}
                className='mt-4 w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sunset-50 to-sunset-100 rounded-2xl border-2 border-sunset-200 hover:border-sunset-300 hover:shadow-lg transition-all duration-200 group'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sunset-400 to-sunset-600 rounded-full shadow-md group-hover:scale-110 transition-transform'>
                    <span className='text-xl'>💰</span>
                  </div>
                  <div className='text-left'>
                    <p className='text-sm font-medium text-forest-600'>Mon Wallet</p>
                    <p className='text-lg font-bold text-forest-800'>Gérer mes pièces</p>
                  </div>
                </div>
                <svg className='w-5 h-5 text-forest-400 group-hover:text-meadow-600 group-hover:translate-x-1 transition-all' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Section grille principale : liste des monstres + sidebar */}
        <section className='mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
          <div>
            <MonstersList monsters={monsters} className='mt-0' />
          </div>

          <aside className='flex flex-col gap-6'>
            <QuestsSection quests={quests} />
            <MoodTipSection message={favoriteMoodMessage} />
          </aside>
        </section>
      </main>

      {/* Modal de création de monstre */}
      <CreateMonsterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMonsterSubmit}
      />
    </div>
  )
}

export default DashboardContent
