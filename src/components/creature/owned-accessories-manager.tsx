/**
 * OwnedAccessoriesManager Component
 *
 * Presentation Layer: Gestion des accessoires possédés par l'utilisateur
 *
 * Responsabilités:
 * - Orchestrer l'affichage des accessoires possédés
 * - Coordonner les interactions entre les hooks et les composants enfants
 * - Gérer le rafraîchissement après équipement/déséquipement
 *
 * Single Responsibility Principle: Orchestre uniquement l'UI de gestion des accessoires
 * Open/Closed Principle: Extensible via les composants enfants sans modification
 * Dependency Inversion: Dépend des hooks (abstractions) plutôt que de la logique directe
 *
 * Optimisations appliquées:
 * - Extraction de la logique métier dans des hooks dédiés (useOwnedAccessories, useAccessoryEquipment)
 * - Création de sous-composants réutilisables (CollapsibleSection, AccessoriesGrid, FeedbackMessage)
 * - Séparation claire des responsabilités pour faciliter les tests et la maintenance
 *
 * @module components/creature/owned-accessories-manager
 */

'use client'

import type { OwnedAccessory } from '@/types/accessory'
import type { Accessory } from '@/types/accessory'
import { getAccessoryById } from '@/services/accessory.service'
import { useOwnedAccessories, useAccessoryEquipment } from '@/hooks/accessories'
import { CollapsibleSection } from './collapsible-section'
import { AccessoriesGrid } from './accessories-grid'
import { FeedbackMessage } from './feedback-message'
import { generateAccessoryById, hasAccessorySVGSupport } from '@/services/accessories/accessory-generator'

/**
 * Props pour le composant OwnedAccessoriesManager
 */
interface OwnedAccessoriesManagerProps {
  /** ID unique du monstre concerné */
  monsterId: string
  /** Liste des accessoires actuellement équipés sur le monstre */
  equippedAccessories: OwnedAccessory[]
  /** Callback appelé après un changement d'équipement (équiper/déséquiper) */
  onAccessoryChange?: () => void
}

/**
 * Props pour le composant OwnedAccessoryCard
 *
 * Définit les propriétés nécessaires pour afficher une carte d'accessoire
 * possédé avec son état d'équipement et ses actions.
 */
interface OwnedAccessoryCardProps {
  /** Instance d'accessoire possédé (avec son ID unique) */
  ownedAccessory: OwnedAccessory
  /** Métadonnées de l'accessoire (nom, icône, etc.) */
  accessory: Accessory
  /** Indique si l'accessoire est actuellement équipé */
  isEquipped: boolean
  /** Callback pour équiper/déséquiper l'accessoire */
  onToggleEquip: (ownedAccessoryId: string, shouldEquip: boolean) => void
  /** Indique si une opération est en cours sur cet accessoire */
  isProcessing: boolean
}

/**
 * Composant de carte d'accessoire possédé
 *
 * Affiche un accessoire avec son icône, son nom et un bouton pour l'équiper/déséquiper.
 * Respecte le principe de responsabilité unique en se concentrant uniquement sur
 * l'affichage d'un seul accessoire.
 *
 * @param {OwnedAccessoryCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte d'accessoire interactive
 *
 * @example
 * <OwnedAccessoryCard
 *   ownedAccessory={ownedAcc}
 *   accessory={acc}
 *   isEquipped={true}
 *   onToggleEquip={handleToggle}
 *   isProcessing={false}
 * />
 */

function OwnedAccessoryCard ({
  ownedAccessory,
  accessory,
  isEquipped,
  onToggleEquip,
  isProcessing
}: OwnedAccessoryCardProps): React.ReactNode {
  const hasSVGSupport = hasAccessorySVGSupport(accessory.id)
  const svgContent = hasSVGSupport ? generateAccessoryById(accessory.id) : null

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl p-4 shadow-lg transition-all duration-300 ${
        isEquipped
          ? 'bg-gradient-to-br from-lochinvar-100 to-lochinvar-50 border-2 border-lochinvar-400'
          : 'bg-white border-2 border-slate-200 hover:border-lochinvar-300'
      }`}
    >
      {/* Icône de l'accessoire */}
      <div className='relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 mb-3'>
        {hasSVGSupport && svgContent !== null ? (
          <div
            className='w-20 h-20 transition-transform duration-300 group-hover:scale-110'
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <span className='text-4xl transition-transform duration-300 group-hover:scale-110' aria-label={accessory.name}>
            {accessory.icon}
          </span>
        )}

        {/* Badge équipé */}
        {isEquipped && (
          <span className='absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-lochinvar-500 px-2 py-1 text-xs font-semibold text-white shadow-md'>
            ✓ Équipé
          </span>
        )}
      </div>

      {/* Informations */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm font-semibold text-slate-900'>{accessory.name}</h3>

        {/* Bouton équiper/déséquiper */}
        <button
          onClick={() => onToggleEquip(ownedAccessory._id, !isEquipped)}
          disabled={isProcessing}
          className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
            isProcessing
              ? 'bg-slate-300 text-slate-500 cursor-wait'
              : isEquipped
                ? 'bg-gradient-to-r from-moccaccino-500 to-moccaccino-600 text-white hover:from-moccaccino-600 hover:to-moccaccino-700'
                : 'bg-gradient-to-r from-lochinvar-500 to-lochinvar-600 text-white hover:from-lochinvar-600 hover:to-lochinvar-700'
          }`}
        >
          {isProcessing ? 'En cours...' : isEquipped ? 'Déséquiper' : 'Équiper'}
        </button>
      </div>
    </div>
  )
}

/**
 * Gestionnaire d'accessoires possédés
 *
 * Composant orchestrateur qui coordonne l'affichage des accessoires possédés
 * et leur équipement sur un monstre spécifique.
 *
 * Délègue :
 * - La gestion de l'état aux hooks personnalisés (useOwnedAccessories, useAccessoryEquipment)
 * - L'affichage de la section repliable à CollapsibleSection
 * - L'affichage de la grille à AccessoriesGrid
 * - Les messages de feedback à FeedbackMessage
 * - Le rendu de chaque carte à OwnedAccessoryCard
 *
 * @param {OwnedAccessoriesManagerProps} props - Props du composant
 * @returns {React.ReactNode} Interface complète de gestion des accessoires
 *
 * @example
 * <OwnedAccessoriesManager
 *   monsterId="monster-123"
 *   equippedAccessories={equipped}
 *   onAccessoryChange={handleRefresh}
 * />
 */
export function OwnedAccessoriesManager ({
  monsterId,
  equippedAccessories,
  onAccessoryChange
}: OwnedAccessoriesManagerProps): React.ReactNode {
  // Hooks personnalisés pour la gestion de l'état
  const { ownedAccessories, loading, refresh } = useOwnedAccessories()
  const { processingId, message, toggleEquip } = useAccessoryEquipment()

  /**
   * Vérifie si un accessoire est équipé sur le monstre
   *
   * @param {string} ownedAccessoryId - ID de l'accessoire possédé
   * @returns {boolean} true si l'accessoire est équipé
   */
  const isAccessoryEquipped = (ownedAccessoryId: string): boolean => {
    return equippedAccessories.some(acc => acc._id === ownedAccessoryId)
  }

  /**
   * Gère l'équipement/déséquipement d'un accessoire
   *
   * @param {string} ownedAccessoryId - ID de l'accessoire possédé
   * @param {boolean} shouldEquip - true pour équiper, false pour déséquiper
   */
  const handleToggleEquip = async (ownedAccessoryId: string, shouldEquip: boolean): Promise<void> => {
    const success = await toggleEquip(ownedAccessoryId, shouldEquip, monsterId)

    if (success) {
      // Rafraîchir les données locales
      await refresh()
      // Notifier le parent
      if (onAccessoryChange !== undefined) {
        onAccessoryChange()
      }
    }
  }

  return (
    <CollapsibleSection
      title='Mes Accessoires'
      subtitle={`${ownedAccessories.length} accessoire${ownedAccessories.length > 1 ? 's' : ''} possédé${ownedAccessories.length > 1 ? 's' : ''}`}
      icon='👜'
      defaultOpen={true}
    >
      {/* Message de feedback */}
      {message !== null && (
        <FeedbackMessage type={message.type} text={message.text} />
      )}

      {/* Grille des accessoires */}
      <AccessoriesGrid isLoading={loading} count={ownedAccessories.length}>
        {ownedAccessories.map((ownedAccessory) => {
          const accessory = getAccessoryById(ownedAccessory.accessoryId)
          if (accessory === null) return null

          return (
            <OwnedAccessoryCard
              key={ownedAccessory._id}
              ownedAccessory={ownedAccessory}
              accessory={accessory}
              isEquipped={isAccessoryEquipped(ownedAccessory._id)}
              onToggleEquip={handleToggleEquip}
              isProcessing={processingId === ownedAccessory._id}
            />
          )
        })}
      </AccessoriesGrid>

      {/* Info footer */}
      <div className='mt-4 p-3 bg-fuchsia-blue-50 rounded-lg border border-fuchsia-blue-200'>
        <p className='text-xs text-fuchsia-blue-800'>
          💡 <strong>Astuce :</strong> Cliquez sur "Équiper" pour voir l'accessoire sur votre monstre !
        </p>
      </div>
    </CollapsibleSection>
  )
}

