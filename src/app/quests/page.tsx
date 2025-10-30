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
import Header from '@/components/header'
import Footer from '@/components/footer'
import { DailyQuests } from '@/components/quests'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'

export default async function QuestsPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <PageHeaderWithWallet
          title="Quêtes Quotidiennes"
        />

        <div className="mb-6 text-center text-gray-600">
          <p>Complétez vos quêtes pour gagner des Koins et de l'XP !</p>
        </div>

        <div className="mt-8">
          <DailyQuests />
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-fuchsia-blue-50 to-lochinvar-50 rounded-lg p-6 border border-fuchsia-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Astuces</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-lochinvar-500 mt-1">•</span>
              <span>Les quêtes se renouvellent automatiquement chaque jour à minuit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lochinvar-500 mt-1">•</span>
              <span>Plus la difficulté est élevée, plus les récompenses sont importantes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lochinvar-500 mt-1">•</span>
              <span>Votre progression est sauvegardée automatiquement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lochinvar-500 mt-1">•</span>
              <span>N'oubliez pas de réclamer vos récompenses avant minuit !</span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}

