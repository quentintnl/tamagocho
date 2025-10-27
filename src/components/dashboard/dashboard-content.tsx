'use client'
import { useMemo, useState } from 'react'
import Button from '../button'
import CreateMonsterModal from './create-monster-modal'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters.actions'
import MonstersList, { type DashboardMonster } from '../monsters/monsters-list'

type Session = typeof authClient.$Infer.Session

const MOOD_LABELS: Record<string, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

const deriveDisplayName = (session: Session): string => {
  const rawName = session.user?.name
  if (typeof rawName === 'string' && rawName.trim().length > 0) {
    return rawName.trim().split(' ')[0]
  }

  const fallbackEmail = session.user?.email
  if (typeof fallbackEmail === 'string' && fallbackEmail.includes('@')) {
    return fallbackEmail.split('@')[0]
  }

  return 'Gardien.ne'
}

function DashboardContent ({ session, monsters }: { session: Session, monsters: DashboardMonster[] }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayName = useMemo(() => deriveDisplayName(session), [session])
  const sessionEmail = session.user?.email ?? 'gardien.ne@tamagotcho-correction.app'
  const firstLetter = displayName.charAt(0).toUpperCase()
  const userInitial = firstLetter === '' ? 'G' : firstLetter

  const stats = useMemo(() => {
    if (!Array.isArray(monsters) || monsters.length === 0) {
      return {
        totalMonsters: 0,
        highestLevel: 1,
        latestAdoption: null as Date | null,
        favoriteMood: null as string | null,
        moodVariety: 0
      }
    }

    let highestLevel = 1
    let latestAdoption: Date | null = null
    const moodCounter: Record<string, number> = {}
    const moodSet = new Set<string>()

    monsters.forEach((monster) => {
      const level = monster.level ?? 1
      if (level > highestLevel) {
        highestLevel = level
      }

      const rawDate = monster.updatedAt ?? monster.createdAt
      if (rawDate !== undefined) {
        const parsed = new Date(rawDate)
        if (!Number.isNaN(parsed.getTime()) && (latestAdoption === null || parsed > latestAdoption)) {
          latestAdoption = parsed
        }
      }

      const mood = typeof monster.state === 'string' ? monster.state : null
      if (mood !== null && mood.length > 0) {
        moodCounter[mood] = (moodCounter[mood] ?? 0) + 1
        moodSet.add(mood)
      }
    })

    const favoriteMood = Object.entries(moodCounter)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    return {
      totalMonsters: monsters.length,
      highestLevel,
      latestAdoption,
      favoriteMood,
      moodVariety: moodSet.size
    }
  }, [monsters])

  const latestAdoptionLabel = useMemo(() => {
    if (stats.latestAdoption === null) {
      return 'À toi de créer ton premier compagnon ✨'
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(stats.latestAdoption)
  }, [stats.latestAdoption])

  const favoriteMoodLabel = stats.favoriteMood !== null ? (MOOD_LABELS[stats.favoriteMood] ?? stats.favoriteMood) : null

  const favoriteMoodMessage = useMemo(() => {
    if (stats.totalMonsters === 0) {
      return 'Pas encore de vibe détectée. Crée ton premier monstre pour lancer la fête !'
    }

    if (favoriteMoodLabel === null) {
      return 'Tes créatures attendent encore de montrer leur humeur préférée. Essaie de les cajoler ou de leur donner un snack !'
    }

    return `Aujourd'hui, ta bande est plutôt ${favoriteMoodLabel.toLowerCase()}. Prévois une activité assortie pour maintenir la bonne humeur !`
  }, [favoriteMoodLabel, stats.totalMonsters])

  const quests = useMemo(() => [
    {
      id: 'create',
      label: stats.totalMonsters > 0 ? 'Imagine une nouvelle créature multicolore' : 'Crée ta toute première créature magique',
      complete: stats.totalMonsters > 0
    },
    {
      id: 'level',
      label: "Fais évoluer un compagnon jusqu'au niveau 5",
      complete: stats.highestLevel >= 5
    },
    {
      id: 'moods',
      label: 'Découvre au moins 3 humeurs différentes',
      complete: stats.moodVariety >= 3
    }
  ], [stats.highestLevel, stats.moodVariety, stats.totalMonsters])

  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  const handleCreateMonster = (): void => {
    setIsModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
  }

  const handleMonsterSubmit = (values: CreateMonsterFormValues): void => {
    void createMonster(values).then(() => {
      window.location.reload()
    })
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-moccaccino-100 via-white to-fuchsia-blue-100'>
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-fuchsia-blue-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-lochinvar-200/50 blur-3xl' aria-hidden='true' />

      <main className='relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8'>
        <section className='relative overflow-hidden rounded-3xl bg-white/80 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.18)] ring-1 ring-white/60 sm:px-10'>
          <div className='pointer-events-none absolute -right-28 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-moccaccino-200/70 via-fuchsia-blue-200/50 to-white/40 blur-3xl' aria-hidden='true' />
          <div className='pointer-events-none absolute -left-32 bottom-0 h-64 w-64 translate-y-1/2 rounded-full bg-gradient-to-tr from-lochinvar-200/60 via-white/30 to-fuchsia-blue-100/60 blur-3xl' aria-hidden='true' />

          <div className='relative flex flex-col gap-10 lg:flex-row lg:items-center'>
            <div className='max-w-xl space-y-6'>
              <div className='inline-flex items-center gap-3 rounded-full border border-moccaccino-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-moccaccino-500'>
                <span aria-hidden='true'>🌈</span>
                <span>Hey {displayName}</span>
              </div>
              <h1 className='text-4xl font-black text-slate-900 sm:text-5xl'>Bienvenue dans ton QG Tamagotcho</h1>
              <p className='text-base text-slate-600 sm:text-lg'>Dompte des créatures adorables, surveille leur humeur et transforme chaque journée en mini-aventure numérique.</p>
              <div className='flex flex-wrap items-center gap-3'>
                <Button size='lg' onClick={handleCreateMonster}>
                  Créer une créature
                </Button>
                <Button size='lg' variant='ghost' onClick={handleLogout}>
                  Se déconnecter
                </Button>
              </div>
            </div>

            <div className='flex flex-1 flex-col gap-4 rounded-3xl bg-gradient-to-br from-lochinvar-100/80 via-white to-fuchsia-blue-100/70 p-6 ring-1 ring-white/70 backdrop-blur'>
              <div className='flex items-center gap-4'>
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-2xl font-bold text-moccaccino-500 shadow-inner'>
                  {userInitial}
                </div>
                <div>
                  <p className='text-xs uppercase tracking-[0.25em] text-slate-500'>Gardien.ne</p>
                  <p className='text-lg font-semibold text-slate-800'>{sessionEmail}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='rounded-2xl bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-lochinvar-200/60'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-lochinvar-500'>Compagnons</p>
                  <p className='mt-2 text-3xl font-black text-slate-900'>{stats.totalMonsters}</p>
                  <p className='text-xs text-slate-500'>Monstres prêts pour l&apos;aventure</p>
                </div>
                <div className='rounded-2xl bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-fuchsia-blue-200/60'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-fuchsia-blue-500'>Niveau max</p>
                  <p className='mt-2 text-3xl font-black text-slate-900'>{stats.highestLevel}</p>
                  <p className='text-xs text-slate-500'>Ton monstre le plus expérimenté</p>
                </div>
                <div className='sm:col-span-2 rounded-2xl bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-moccaccino-200/60'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-moccaccino-500'>Dernière adoption</p>
                  <p className='mt-2 text-lg font-semibold text-slate-800'>{latestAdoptionLabel}</p>
                  <p className='text-xs text-slate-500'>{stats.totalMonsters === 0 ? 'Ton prochain compagnon est à un clic !' : 'Continue de créer pour agrandir ta bande.'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
          <div>
            <MonstersList monsters={monsters} className='mt-0' />
          </div>
          <aside className='flex flex-col gap-6'>
            <div className='rounded-3xl bg-white/80 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur'>
              <div className='flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-lochinvar-100 text-2xl'>🪄</span>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.2em] text-lochinvar-500'>Quêtes du jour</p>
                  <p className='text-base text-slate-600'>À toi de jouer !</p>
                </div>
              </div>
              <ul className='mt-5 space-y-4'>
                {quests.map((quest) => (
                  <li key={quest.id} className='flex items-start gap-3'>
                    <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-lg ${quest.complete ? 'bg-moccaccino-100 text-moccaccino-600' : 'bg-slate-100 text-slate-400'}`}>
                      {quest.complete ? '✨' : '•'}
                    </span>
                    <div>
                      <p className='text-sm font-medium text-slate-800'>{quest.label}</p>
                      <p className='text-xs text-slate-500'>{quest.complete ? 'Mission accomplie !' : 'Clique et amuse-toi pour valider.'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-3xl bg-gradient-to-br from-fuchsia-blue-100/90 via-white to-lochinvar-100/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.14)] ring-1 ring-white/60 backdrop-blur'>
              <p className='text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-blue-500'>Astuce mood</p>
              <p className='mt-3 text-base font-medium text-slate-800'>{favoriteMoodMessage}</p>
              <p className='mt-2 text-xs text-slate-600'>Observe tes créatures pour débloquer toutes les humeurs et récolter des surprises.</p>
            </div>
          </aside>
        </section>
      </main>

      <CreateMonsterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMonsterSubmit}
      />
    </div>
  )
}

export default DashboardContent
