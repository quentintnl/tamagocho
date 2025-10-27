import { getMonsterById } from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import { CreaturePageClient } from '@/components/creature/creature-page-client'

/**
 * Page de détail d'une créature/monstre
 *
 * Cette page server-side récupère les informations d'un monstre spécifique
 * par son identifiant et affiche soit la page de détail, soit une erreur
 * si le monstre n'existe pas ou n'appartient pas à l'utilisateur.
 *
 * Responsabilité unique : récupérer les données du monstre et gérer
 * les cas d'erreur (monstre introuvable).
 *
 * @async
 * @param {Object} props - Props du composant
 * @param {Object} props.params - Paramètres de route dynamique
 * @param {string} props.params.id - Identifiant du monstre
 * @returns {Promise<React.ReactNode>} Page de détail ou page d'erreur
 *
 * @example
 * // Accès direct à la route
 * // GET /creature/507f1f77bcf86cd799439011
 */
export default async function Page ({ params }: { params: Promise<{ id: string | string[] }> }): Promise<React.ReactNode> {
  // Résolution asynchrone des params (Next.js 15 fournit des params awaités)
  const resolved = await params
  // Extraction de l'ID depuis les paramètres de route
  const id = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id

  // Récupération du monstre depuis la base de données
  const monster = await getMonsterById(id)

  // Gestion du cas où le monstre n'existe pas
  if (monster === null || monster === undefined) {
    return <ErrorClient error='Creature not found.' />
  }

  // Affichage de la page de détail
  return <CreaturePageClient monster={monster} />
}
