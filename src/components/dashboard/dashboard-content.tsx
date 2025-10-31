'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import type {PopulatedMonster} from '@/types/monster'
import { showLoadingToast, updateToast } from '@/lib/toast'
import {
  useUserDisplay,
  useMonsterStats,
  useLatestAdoptionLabel,
  useFavoriteMoodMessage,
  useMonsterRefresh
} from '@/hooks/dashboard'
import CreateMonsterModal from './create-monster-modal'
import { WelcomeHero } from './welcome-hero'
import { UserProfileCard } from './user-profile-card'
import { StatsCard } from './stats-card'
import { MoodTipSection } from './mood-tip-section'
import MonstersList from '../monsters/monsters-list'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'
import { QuestsAutoRenewer } from '@/components/quests/auto-renewer'
import { DailyQuestsSection } from '@/components/quests/daily-quests-section'
import TomatokenIcon from '@/components/tomatoken-icon'

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
  const router = useRouter()
  const searchParams = useSearchParams()

  // Hook pour le rafraîchissement automatique des monstres (toutes les minutes)
  const { monsters } = useMonsterRefresh(initialMonsters, 60000)

  // Extraction des informations utilisateur
  const userDisplay = useUserDisplay(session)

  // Calcul des statistiques des monstres
  const stats = useMonsterStats(monsters)
  const latestAdoptionLabel = useLatestAdoptionLabel(stats.latestAdoption)
  const favoriteMoodMessage = useFavoriteMoodMessage(stats.favoriteMood, stats.totalMonsters)

  /**
   * Vérifie si le paramètre URL 'openModal=true' est présent
   * et ouvre le modal automatiquement si c'est le cas
   */
  useEffect(() => {
    const shouldOpenModal = searchParams.get('openModal') === 'true'
    if (shouldOpenModal) {
      setIsModalOpen(true)
      // Nettoie l'URL pour éviter d'ouvrir le modal à chaque rechargement
      router.replace('/dashboard')
    }
  }, [searchParams, router])

  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   * Mémorisée avec useCallback pour éviter les re-créations inutiles
   */
  const handleLogout = useCallback((): void => {
    void authClient.signOut()
    router.push('/sign-in')
  }, [router])

  /**
   * Ouvre le modal de création de monstre
   * Mémorisée avec useCallback pour éviter les re-créations inutiles
   */
  const handleCreateMonster = useCallback((): void => {
    setIsModalOpen(true)
  }, [])

  /**
   * Ferme le modal de création de monstre
   * Mémorisée avec useCallback pour éviter les re-créations inutiles
   */
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false)
  }, [])

  /**
   * Soumet le formulaire de création de monstre et recharge la page
   * Mémorisée avec useCallback pour éviter les re-créations inutiles
   *
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire
   */
  const handleMonsterSubmit = useCallback(async (values: CreateMonsterFormValues): Promise<void> => {
    const toastId = showLoadingToast('Création de ton monstre en cours...')

    try {
      await createMonster(values)
      updateToast(toastId, `${values.name} a été créé avec succès ! 🎉`, 'success')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      updateToast(
        toastId,
        error instanceof Error ? error.message : 'Erreur lors de la création du monstre',
        'error'
      )
    }
  }, [])

  /**
   * Redirige vers la page wallet
   * Mémorisée avec useCallback pour éviter les re-créations inutiles
   */
  const handleGoToWallet = useCallback((): void => {
    router.push('/wallet')
  }, [router])

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-meadow-50 via-sky-50 to-lavender-100'>
      {/* Système de mise à jour automatique des monstres */}
      <MonstersAutoUpdater
        userId={session.user.id}
        minInterval={60000}  // 1 minute
        maxInterval={180000} // 3 minutes
        enabled={true}
        verbose={true}
        showIndicator={false}
      />

      {/* Système de renouvellement automatique des quêtes à minuit */}
      <QuestsAutoRenewer
        userId={session.user.id}
        enabled={true}
        verbose={true}
        refreshOnRenew={true}
        showIndicator={false}
      />

      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Mon Jardin' />

      {/* Motifs décoratifs de fond - thème fruits & légumes */}
      <div className='pointer-events-none absolute -right-20 top-32 h-96 w-96 rounded-full bg-gradient-to-br from-sunset-200/40 via-gold-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '8s' }} />
      <div className='pointer-events-none absolute -left-24 bottom-32 h-96 w-96 rounded-full bg-gradient-to-tr from-meadow-200/50 via-forest-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '10s' }} />
      <div className='pointer-events-none absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-gradient-to-bl from-lavender-200/40 via-sky-200/30 to-transparent blur-3xl animate-pulse' aria-hidden='true' style={{ animationDuration: '12s' }} />

      <main className='relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8'>
        {/* Section bienvenue compacte */}
        <section className='mb-6'>
          <WelcomeHero
            userDisplay={userDisplay}
            onCreateMonster={handleCreateMonster}
            onLogout={handleLogout}
          />
        </section>

        {/* Grid principal : Stats + Profil + Wallet */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6'>
          {/* Carte profil utilisateur */}
          <div className='lg:col-span-4'>
            <UserProfileCard userDisplay={userDisplay} />
          </div>

          {/* Grille de statistiques */}
          <div className='lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4'>
            <StatsCard
              title='Compagnons'
              value={stats.totalMonsters}
              description="Petits monstres"
              color='lochinvar'
              icon='🌱'
            />
            <StatsCard
              title='Niveau Max'
              value={stats.highestLevel}
              description='Plus fort'
              color='fuchsia-blue'
              icon='⭐'
            />
            <StatsCard
              title='Dernière Adoption'
              value={latestAdoptionLabel}
              description={stats.totalMonsters === 0 ? 'Aucune encore' : 'Nouveau membre'}
              color='moccaccino'
              icon='🎉'
            />

            {/* Wallet card intégré */}
            <div className='col-span-2 md:col-span-3'>
              <button
                onClick={handleGoToWallet}
                className='w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-100 via-sunset-50 to-gold-100 p-6 shadow-lg border-2 border-gold-200/80 hover:border-gold-300 hover:shadow-xl transition-all duration-300 group'
              >
                {/* Effet brillant animé */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000' />

                <div className='relative flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400 to-sunset-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300'>
                      <TomatokenIcon size='lg' />
                    </div>
                    <div className='text-left'>
                      <p className='text-sm font-bold uppercase tracking-wider text-sunset-700'>Mon Wallet</p>
                      <p className='text-2xl font-black text-forest-800'>Gérer mes pièces</p>
                      <p className='text-xs text-forest-600 mt-1'>Tomatokens & Récompenses</p>
                    </div>
                  </div>
                  <svg className='w-8 h-8 text-sunset-500 group-hover:text-sunset-600 group-hover:translate-x-2 transition-all' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Section grille principale : Monstres + Sidebar (Quêtes + Mood) */}
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]'>
          {/* Liste des monstres */}
          <div className='order-2 lg:order-1'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-black text-forest-800 flex items-center gap-3'>
                <span className='text-3xl'>🏡</span>
                Mes Petits Monstres
              </h2>
              <span className='px-4 py-2 rounded-full bg-meadow-100 text-meadow-700 font-bold text-sm border-2 border-meadow-200'>
                {stats.totalMonsters} {stats.totalMonsters > 1 ? 'créatures' : 'créature'}
              </span>
            </div>
            <MonstersList monsters={monsters} className='mt-0' />
          </div>

          {/* Sidebar : Quêtes + Mood */}
          <aside className='order-1 lg:order-2 flex flex-col gap-6'>
            <DailyQuestsSection />
            <MoodTipSection message={favoriteMoodMessage} />
          </aside>
        </div>
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
