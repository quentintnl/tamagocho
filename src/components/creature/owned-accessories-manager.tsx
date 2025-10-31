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

import { useState, useMemo } from 'react'
import type { OwnedAccessory } from '@/types/accessory'
import type { Accessory } from '@/types/accessory'
import { getAccessoryById } from '@/services/accessory.service'
import { useOwnedAccessories, useAccessoryEquipment } from '@/hooks/accessories'
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
  /** Trigger de rafraîchissement externe (incrémenter pour forcer un refresh) */
  refreshTrigger?: number
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
 *   refreshTrigger={trigger}
 * />
 */
export function OwnedAccessoriesManager ({
  monsterId,
  equippedAccessories,
  onAccessoryChange,
  refreshTrigger
}: OwnedAccessoriesManagerProps): React.ReactNode {
  // État pour le filtre de catégorie
  const [activeTab, setActiveTab] = useState<'accessories' | 'backgrounds'>('accessories')

  // Hooks personnalisés pour la gestion de l'état
  const { ownedAccessories, loading, refresh } = useOwnedAccessories(refreshTrigger)
  const { processingId, message, toggleEquip } = useAccessoryEquipment()

  // Filtrer les accessoires selon l'onglet actif
  const filteredOwnedAccessories = useMemo(() => {
    return ownedAccessories.filter((ownedAcc) => {
      const accessory = getAccessoryById(ownedAcc.accessoryId)
      if (accessory === null) return false

      if (activeTab === 'accessories') {
        return accessory.category !== 'background'
      } else {
        return accessory.category === 'background'
      }
    })
  }, [ownedAccessories, activeTab])

  // Compter les accessoires par catégorie
  const counts = useMemo(() => {
    const accessoriesCount = ownedAccessories.filter((ownedAcc) => {
      const accessory = getAccessoryById(ownedAcc.accessoryId)
      return accessory !== null && accessory.category !== 'background'
    }).length

    const backgroundsCount = ownedAccessories.filter((ownedAcc) => {
      const accessory = getAccessoryById(ownedAcc.accessoryId)
      return accessory !== null && accessory.category === 'background'
    }).length

    return { accessoriesCount, backgroundsCount }
  }, [ownedAccessories])

  /**
   * Vérifie si un accessoire est équipé sur le monstre
   */
  const isAccessoryEquipped = (ownedAccessoryId: string): boolean => {
    return equippedAccessories.some(acc => acc._id === ownedAccessoryId)
  }

  /**
   * Gère l'équipement/déséquipement d'un accessoire
   */
  const handleToggleEquip = async (ownedAccessoryId: string, shouldEquip: boolean): Promise<void> => {
    const success = await toggleEquip(ownedAccessoryId, shouldEquip, monsterId)

    if (success) {
      await refresh()
      if (onAccessoryChange !== undefined) {
        onAccessoryChange()
      }
    }
  }

  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-white to-lavender-50 p-6 shadow-xl border-4 border-white/90'>
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/30 blur-xl' aria-hidden='true' />

      <div className='relative'>
        {/* En-tête */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-lavender-500 shadow-lg border-2 border-white text-2xl'>
            👜
          </div>
          <div className='flex-1'>
            <h2 className='text-2xl font-black text-forest-800'>
              Mes Accessoires
            </h2>
            {loading ? (
              <div className='h-3 bg-sky-200/50 rounded w-32 mt-1 animate-pulse' />
            ) : (
              <p className='text-xs font-medium text-forest-600'>
                {ownedAccessories.length} accessoire{ownedAccessories.length > 1 ? 's' : ''} possédé{ownedAccessories.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Message de feedback */}
        {message !== null && (
          <div className='mb-4'>
            <FeedbackMessage type={message.type} text={message.text} />
          </div>
        )}

        {loading ? (
          /* Skeleton de chargement */
          <div className='space-y-6'>
            {/* Skeleton des onglets */}
            <div className='flex justify-center'>
              <div className='inline-flex bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-lg border-2 border-white/80'>
                <div className='h-9 w-36 bg-sky-200/50 rounded-xl animate-pulse' />
                <div className='h-9 w-36 bg-sky-200/50 rounded-xl animate-pulse ml-1' />
              </div>
            </div>

            {/* Skeleton de la grille */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='relative flex flex-col overflow-hidden rounded-2xl p-4 shadow-lg bg-white border-2 border-slate-200 animate-pulse'>
                  {/* Zone icône skeleton */}
                  <div className='relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 mb-3'>
                    <div className='w-20 h-20 bg-slate-200 rounded-full' />
                  </div>
                  {/* Nom skeleton */}
                  <div className='h-4 bg-slate-200 rounded w-3/4 mb-2' />
                  {/* Bouton skeleton */}
                  <div className='h-9 bg-slate-200 rounded-lg' />
                </div>
              ))}
            </div>

            {/* Footer skeleton */}
            <div className='p-3 bg-lavender-50 rounded-xl border-2 border-lavender-200/60'>
              <div className='h-3 bg-lavender-200/50 rounded w-full' />
            </div>
          </div>
        ) : (
          <>
            {/* Onglets de navigation */}
            <div className='flex justify-center mb-6'>
              <div className='inline-flex bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-lg border-2 border-white/80'>
                <button
                  onClick={() => { setActiveTab('accessories') }}
                  className={`
                    relative px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-300
                    ${
                      activeTab === 'accessories'
                        ? 'bg-gradient-to-br from-sky-500 to-lavender-500 text-white shadow-md scale-105'
                        : 'text-forest-600 hover:text-forest-800 hover:bg-sky-50 hover:scale-105'
                    }
                  `}
                >
                  <div className='flex items-center gap-1.5'>
                    <span className='text-base'>🎨</span>
                    <span>Accessoires</span>
                    <span
                      className={`
                        inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-xs font-black border
                        ${
                          activeTab === 'accessories'
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-sky-100 text-forest-700 border-sky-200'
                        }
                      `}
                    >
                      {counts.accessoriesCount}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('backgrounds') }}
                  className={`
                    relative px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-300
                    ${
                      activeTab === 'backgrounds'
                        ? 'bg-gradient-to-br from-sky-500 to-lavender-500 text-white shadow-md scale-105'
                        : 'text-forest-600 hover:text-forest-800 hover:bg-sky-50 hover:scale-105'
                    }
                  `}
                >
                  <div className='flex items-center gap-1.5'>
                    <span className='text-base'>🖼️</span>
                    <span>Arrière-plans</span>
                    <span
                      className={`
                        inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-xs font-black border
                        ${
                          activeTab === 'backgrounds'
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-sky-100 text-forest-700 border-sky-200'
                        }
                      `}
                    >
                      {counts.backgroundsCount}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Grille des accessoires */}
            <AccessoriesGrid isLoading={loading} count={filteredOwnedAccessories.length}>
              {filteredOwnedAccessories.map((ownedAccessory) => {
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
            <div className='mt-4 p-3 bg-lavender-50 rounded-xl border-2 border-lavender-200/60'>
              <p className='text-xs text-lavender-800 font-medium'>
                💡 <strong>Astuce :</strong> Cliquez sur "Équiper" pour voir l'accessoire sur votre monstre !
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

