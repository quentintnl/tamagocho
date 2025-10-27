/**
 * Utilitaires pour le formatage de dates
 */

/**
 * Formate une date d'adoption de monstre en format français
 *
 * Responsabilité unique : convertir une date ISO en format lisible
 * pour l'affichage dans l'UI.
 *
 * @param {string | undefined} value - Date au format ISO
 * @returns {string | null} Date formatée ou null si invalide
 *
 * @example
 * formatAdoptionDate('2025-10-27T10:30:00Z')
 * // "27 oct. 2025"
 *
 * formatAdoptionDate(undefined)
 * // null
 */
export const formatAdoptionDate = (value: string | undefined): string | null => {
  if (value === undefined) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
