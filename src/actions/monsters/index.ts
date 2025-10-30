/**
 * Index des actions monsters
 *
 * Ce fichier sert de point d'entrée pour toutes les actions liées aux monstres.
 * Il permet de conserver la compatibilité avec les imports existants.
 */

// Actions de création
export { createMonster } from './monsters.create.actions'

// Actions de récupération
export { getMonsters, getMonsterById } from './monsters.get.actions'

// Actions d'interaction
export { doActionOnMonster, type ActionResult } from './monsters.do-action.actions'

// Actions de visibilité
export { toggleMonsterPublicStatus } from './monsters.toggle-public.actions'

// Actions de galerie publique
export {
  getPublicMonsters,
  type GalleryFilters,
  type PaginationOptions,
  type PublicMonsterWithOwner,
  type GalleryResult
} from './monsters.get-public.actions'

