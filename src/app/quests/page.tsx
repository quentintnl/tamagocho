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
import { QuestsDescription } from '@/components/quests/quests-description'
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
      <QuestsDescription text="Complétez vos quêtes pour gagner des Tomatokens et de l'XP !" />

      <div className="mt-8">
        <DailyQuests />
      </div>

      <QuestsTips show={true} />
    </QuestsLayout>
  )
}

