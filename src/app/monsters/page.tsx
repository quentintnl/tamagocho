import { getMonsters } from '@/actions/monsters.actions'
import MonstersPageContent from '@/components/monsters/monsters-page-content'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

/**
 * Page listant tous les monstres de l'utilisateur
 *
 * Cette page server side vérifie l'authentification de l'utilisateur,
 * récupère tous ses monstres depuis la base de données, et affiche
 * une galerie complète via le composant client MonstersPageContent.
 *
 * Responsabilité unique : Servir de point d'entrée pour la page des monstres
 * avec protection d'authentification.
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu de la page monstres ou une redirection vers la page de connexion
 *
 * @throws Redirige vers /sign-in si l'utilisateur n'est pas authentifié
 *
 * @example
 * // Accès direct à la route
 * // GET /monsters
 */
async function MonstersPage (): Promise<React.ReactNode> {
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
    <MonstersPageContent session={session} monsters={monsters} />
  )
}

export default MonstersPage
