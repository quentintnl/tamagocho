/**
 * Composant pour le renouvellement automatique des quêtes quotidiennes
 *
 * Presentation Layer: Wrapper du hook useAutoRenewQuests
 *
 * Responsabilités :
 * - Encapsuler la logique de renouvellement automatique
 * - Fournir un indicateur visuel optionnel
 * - Rafraîchir la page après renouvellement (optionnel)
 *
 * Architecture :
 * - Wrapper simple du hook useAutoRenewQuests
 * - Aucune logique métier, juste de la présentation
 * - Single Responsibility: Gestion de l'UI du renouvellement
 *
 * @example
 * ```tsx
 * <QuestsAutoRenewer
 *   userId={session.user?.id}
 *   enabled
 *   verbose
 *   refreshOnRenew
 * />
 * ```
 */

'use client'

import { useRouter } from 'next/navigation'
import { useAutoRenewQuests } from '@/hooks/use-auto-renew-quests'

interface QuestsAutoRenewerProps {
  /** ID de l'utilisateur (optionnel) */
  userId?: string | null
  /** Active ou désactive le renouvellement automatique */
  enabled?: boolean
  /** Active les logs détaillés dans la console */
  verbose?: boolean
  /** Rafraîchit la page après renouvellement */
  refreshOnRenew?: boolean
  /** Affiche un indicateur visuel */
  showIndicator?: boolean
}

/**
 * Composant pour gérer le renouvellement automatique des quêtes
 * Utilise le hook useAutoRenewQuests en interne
 */
export function QuestsAutoRenewer ({
  userId = null,
  enabled = true,
  verbose = false,
  refreshOnRenew = true,
  showIndicator = false
}: QuestsAutoRenewerProps): React.ReactNode {
  const router = useRouter()

  useAutoRenewQuests({
    userId,
    enabled,
    verbose,
    onRenewed: (data) => {
      console.log('✅ Quêtes renouvelées', data)

      // Rafraîchir la page pour afficher les nouvelles quêtes
      if (refreshOnRenew) {
        router.refresh()
      }
    },
    onError: (error) => {
      console.error('❌ Erreur renouvellement quêtes:', error)
    }
  })

  // Indicateur visuel optionnel
  if (showIndicator && enabled) {
    return (
      <div className='fixed bottom-4 right-4 z-50'>
        <div className='bg-lochinvar-500 text-white px-3 py-1 rounded-full text-sm shadow-lg flex items-center gap-2'>
          <span className='animate-pulse'>🌙</span>
          <span>Renouvellement auto</span>
        </div>
      </div>
    )
  }

  return null
}
