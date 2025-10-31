/**
 * Quests Description - Description de la page des quêtes
 *
 * Composant réutilisable pour afficher la description avec support skeleton
 */

interface QuestsDescriptionProps {
  text: string | null
}

/**
 * Composant pour afficher la description
 *
 * @param {QuestsDescriptionProps} props - Props du composant
 * @returns {React.ReactNode} Description
 */
export function QuestsDescription ({ text }: QuestsDescriptionProps): React.ReactNode {
  return (
    <div className="mb-6 text-center text-gray-600">
      {text === null
        ? <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
        : <p>{text}</p>}
    </div>
  )
}

