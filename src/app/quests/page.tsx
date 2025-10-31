/**
 * Quests Page
 *
 * Presentation Layer: Daily quests view page
 *
 * Responsibilities:
 * - Display user's daily quests
 * - Allow quest completion and reward claiming
 * - Show quest progress
 *
 * Clean Architecture: Page composition layer
 */

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { DailyQuests } from '@/components/quests'
import { QuestsLayout } from '@/components/quests/quests-layout'
import { QuestsTips } from '@/components/quests/quests-tips'

export default async function QuestsPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <QuestsLayout>
      {/* En-tête de la page */}
      <div className='relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-gold-100 via-white to-sunset-100 p-8 sm:p-10 shadow-xl border-4 border-white/80'>
        {/* Motif décoratif de fond */}
        <div className='absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-sunset-200/50 to-gold-200/30 blur-2xl' aria-hidden='true' />
        <div className='absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-gradient-to-tr from-gold-200/50 to-meadow-200/30 blur-2xl' aria-hidden='true' />

        <div className='relative text-center space-y-4'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 shadow-md border-2 border-gold-200/60'>
            <span className='text-2xl' aria-hidden='true'>🎯</span>
            <span className='text-sm font-bold text-forest-700'>
              Missions Quotidiennes
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl font-black text-forest-800 leading-tight'>
            Tes Quêtes du Jour
            <span className='ml-3 inline-block' style={{ animation: 'bounce 2s infinite' }}>✨</span>
          </h1>

          <p className='text-lg text-forest-600 leading-relaxed max-w-2xl mx-auto'>
            Complète tes quêtes quotidiennes pour gagner des <strong className='text-gold-600'>Tomatokens</strong> et de l'<strong className='text-sunset-600'>XP</strong> ! Reviens chaque jour pour de nouvelles missions.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <DailyQuests />
      </div>

      <QuestsTips show={true} />
    </QuestsLayout>
  )
}

