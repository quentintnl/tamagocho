'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters.actions'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type { DBMonster } from '@/types/monster'
import {
  useUserDisplay,
  useMonsterStats,
  useLatestAdoptionLabel,
  useFavoriteMoodMessage,
  useQuests
} from '@/hooks/dashboard'
import CreateMonsterModal from './create-monster-modal'
import { WelcomeHero } from './welcome-hero'
import { UserProfileCard } from './user-profile-card'
import { StatsCard } from './stats-card'
import { QuestsSection } from './quests-section'
import { MoodTipSection } from './mood-tip-section'
import MonstersList from '../monsters/monsters-list'

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
 * @param {DBMonster[]} props.monsters - Liste des monstres de l'utilisateur
 * @returns {React.ReactNode} Contenu complet du dashboard
 *
 * @example
 * <DashboardContent session={session} monsters={monsters} />
 */
function DashboardContent ({ session, monsters }: { session: Session, monsters: DBMonster[] }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
   * Soumet le formulaire de création de monstre
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire
   */
  const handleMonsterSubmit = (values: CreateMonsterFormValues): void => {
    void createMonster(values).then(() => {
      window.location.reload()
    })
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-moccaccino-100 via-white to-fuchsia-blue-100'>
      {/* Bulles décoratives de fond */}
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-fuchsia-blue-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-lochinvar-200/50 blur-3xl' aria-hidden='true' />

      <main className='relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8'>
        {/* Section héro avec bienvenue et profil */}
        <section className='relative overflow-hidden rounded-3xl bg-white/80 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.18)] ring-1 ring-white/60 sm:px-10'>
          {/* Bulles décoratives internes */}
          <div className='pointer-events-none absolute -right-28 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-moccaccino-200/70 via-fuchsia-blue-200/50 to-white/40 blur-3xl' aria-hidden='true' />
          <div className='pointer-events-none absolute -left-32 bottom-0 h-64 w-64 translate-y-1/2 rounded-full bg-gradient-to-tr from-lochinvar-200/60 via-white/30 to-fuchsia-blue-100/60 blur-3xl' aria-hidden='true' />

          <div className='relative flex flex-col gap-10 lg:flex-row lg:items-center'>
            {/* Message de bienvenue et actions principales */}
            <WelcomeHero
              userDisplay={userDisplay}
              onCreateMonster={handleCreateMonster}
              onLogout={handleLogout}
            />

            {/* Carte de profil et statistiques */}
            <div className='flex flex-1 flex-col gap-4 rounded-3xl bg-gradient-to-br from-lochinvar-100/80 via-white to-fuchsia-blue-100/70 p-6 ring-1 ring-white/70 backdrop-blur'>
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
