import { getMonsters } from '@/actions/monsters.actions'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Page principale du tableau de bord utilisateur
 *
 * Cette page server-side vérifie l'authentification de l'utilisateur,
 * récupère ses monstres depuis la base de données, et affiche le contenu
 * du dashboard via le composant client DashboardContent.
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu du dashboard ou une redirection vers la page de connexion
 *
 * @throws Redirige vers /sign-in si l'utilisateur n'est pas authentifié
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

  // Récupération de tous les monstres appartenant à l'utilisateur connecté
  const monsters = await getMonsters()

  // Protection de la route : redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <DashboardContent session={session} monsters={monsters} />
  )
}

export default DashboardPage
