import type { MonsterTraits } from '@/types/monster'

/**
 * Utilitaires pour la manipulation des données monstres
 */

/**
 * Parse une chaîne JSON en objet MonsterTraits
 *
 * Responsabilité unique : désérialiser les traits d'un monstre
 * stockés en format JSON dans la base de données.
 *
 * @param {string} rawTraits - Chaîne JSON représentant les traits
 * @returns {MonsterTraits | null} Traits parsés ou null si invalide
 *
 * @example
 * parseMonsterTraits('{"bodyColor": "#FFB5E8", ...}')
 * // { bodyColor: '#FFB5E8', ... }
 *
 * parseMonsterTraits('invalid json')
 * // null
 */
export const parseMonsterTraits = (rawTraits: string): MonsterTraits | null => {
  if (typeof rawTraits !== 'string' || rawTraits.trim().length === 0) return null
  try {
    return JSON.parse(rawTraits) as MonsterTraits
  } catch (error) {
    console.error('Unable to parse monster traits', error)
    return null
  }
}
