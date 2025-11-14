import { getMonsters } from '@/actions/monsters'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tomatgotchi',
  description: 'Gérez vos créatures Tomatgotchi'
}

/**
 * Page principale du tableau de bord utilisateur
 *
 * Cette page server-side vérifie l'authentification de l'utilisateur,
 * récupère ses monstres depuis la base de données, et affiche le contenu
 * du dashboard via le composant client DashboardContent.
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu du dashboard ou redirection vers /sign-in
 *
 * @example
 * // Accès direct à la route
 * // GET /dashboard
 */
async function DashboardPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur via Better Auth
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Protection de la route : redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  // Récupération de tous les monstres appartenant à l'utilisateur connecté
  const monsters = await getMonsters()

  return (
    <DashboardContent session={session} monsters={monsters} />
  )
}

export default DashboardPage
