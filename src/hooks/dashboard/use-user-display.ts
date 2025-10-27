import { useMemo } from 'react'
import { authClient } from '@/lib/auth-client'

type Session = typeof authClient.$Infer.Session

/**
 * Extrait le nom d'affichage de l'utilisateur depuis sa session
 *
 * Essaie d'extraire le prénom depuis le nom complet,
 * sinon utilise la partie avant @ de l'email,
 * sinon retourne "Gardien.ne" par défaut
 *
 * @param {Session} session - Session utilisateur Better Auth
 * @returns {string} Nom d'affichage formaté
 *
 * @example
 * deriveDisplayName(session) // "John" ou "john.doe" ou "Gardien.ne"
 */
const deriveDisplayName = (session: Session): string => {
  const rawName = session.user?.name
  if (typeof rawName === 'string' && rawName.trim().length > 0) {
    return rawName.trim().split(' ')[0]
  }

  const fallbackEmail = session.user?.email
  if (typeof fallbackEmail === 'string' && fallbackEmail.includes('@')) {
    return fallbackEmail.split('@')[0]
  }

  return 'Gardien.ne'
}

/**
 * Interface définissant les informations utilisateur pour l'affichage
 */
export interface UserDisplay {
  /** Nom d'affichage court de l'utilisateur */
  displayName: string
  /** Email de l'utilisateur */
  email: string
  /** Initiale du prénom pour l'avatar */
  initial: string
}

/**
 * Hook personnalisé pour extraire les informations d'affichage de l'utilisateur
 *
 * Responsabilité unique : transformer les données de session en format
 * adapté pour l'affichage UI du dashboard.
 *
 * @param {Session} session - Session utilisateur Better Auth
 * @returns {UserDisplay} Informations formatées pour l'affichage
 *
 * @example
 * const { displayName, email, initial } = useUserDisplay(session)
 * // { displayName: "John", email: "john@example.com", initial: "J" }
 */
export function useUserDisplay (session: Session): UserDisplay {
  return useMemo(() => {
    const displayName = deriveDisplayName(session)
    const email = session.user?.email ?? 'gardien.ne@tamagotcho.app'
    const firstLetter = displayName.charAt(0).toUpperCase()
    const initial = firstLetter === '' ? 'G' : firstLetter

    return {
      displayName,
      email,
      initial
    }
  }, [session])
}
