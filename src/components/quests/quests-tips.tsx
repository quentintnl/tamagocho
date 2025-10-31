/**
 * Quests Tips - Section astuces pour les quêtes
 *
 * Composant réutilisable pour afficher les astuces avec support skeleton
 */

interface QuestsTipsProps {
  show: boolean | null
}

/**
 * Composant pour afficher les astuces
 *
 * @param {QuestsTipsProps} props - Props du composant
 * @returns {React.ReactNode} Section astuces
 */
export function QuestsTips ({ show }: QuestsTipsProps): React.ReactNode {
  if (show === null) {
    // Skeleton mode
    return (
      <div className="mt-12 bg-gradient-to-r from-fuchsia-blue-50 to-lochinvar-50 rounded-lg p-6 border border-fuchsia-blue-200 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-32 mb-3" />
        <ul className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-lochinvar-500 mt-1">•</span>
              <div className="h-4 bg-gray-200 rounded w-full" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (!show) return null

  return (
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
  )
}

