/**
 * Utilitaires pour les composants UI
 */

/**
 * Fusionne plusieurs classes CSS en une seule chaîne
 *
 * Responsabilité unique : combiner les classes CSS conditionnelles
 * en filtrant les valeurs falsy.
 *
 * @param {...Array<string | undefined>} values - Classes CSS à fusionner
 * @returns {string} Chaîne de classes CSS combinées
 *
 * @example
 * mergeClasses('btn', isActive && 'btn-active', 'btn-lg')
 * // "btn btn-active btn-lg"
 *
 * mergeClasses('card', undefined, 'shadow')
 * // "card shadow"
 */
export const mergeClasses = (...values: Array<string | undefined>): string =>
  values.filter(Boolean).join(' ')
