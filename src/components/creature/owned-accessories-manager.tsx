/**
 * OwnedAccessoriesManager Component
 *
 * Presentation Layer: Manage owned accessories for a monster
 *
 * Responsibilities:
 * - Display all owned accessories
 * - Allow equipping/unequipping accessories
 * - Show equipped status
 * - Handle equip/unequip actions
 *
 * Single Responsibility Principle: Orchestrates accessory management UI
 */

'use client'

import { useState, useEffect } from 'react'
import type { OwnedAccessory } from '@/types/accessory'
import type { Accessory } from '@/types/accessory'
import { getUserOwnedAccessories, equipAccessory, removeAccessory } from '@/actions/accessory.actions'
import { getAccessoryById } from '@/services/accessory.service'
import { generateAccessoryById, hasAccessorySVGSupport } from '@/services/accessories/accessory-generator'

/**
 * Props pour le composant OwnedAccessoriesManager
 */
interface OwnedAccessoriesManagerProps {
  /** ID du monstre */
  monsterId: string
  /** Accessoires actuellement équipés */
  equippedAccessories: OwnedAccessory[]
  /** Callback après équipement/déséquipement */
  onAccessoryChange?: () => void
}

/**
 * Composant de carte d'accessoire possédé
 */
interface OwnedAccessoryCardProps {
  ownedAccessory: OwnedAccessory
  accessory: Accessory
  isEquipped: boolean
  onToggleEquip: (ownedAccessoryId: string, shouldEquip: boolean) => void
  isProcessing: boolean
}

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
 */
export function OwnedAccessoriesManager ({
  monsterId,
  equippedAccessories,
  onAccessoryChange
}: OwnedAccessoriesManagerProps): React.ReactNode {
  const [ownedAccessories, setOwnedAccessories] = useState<OwnedAccessory[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  // Charger les accessoires possédés
  useEffect(() => {
    const fetchOwnedAccessories = async (): Promise<void> => {
      try {
        setLoading(true)
        const accessories = await getUserOwnedAccessories()
        if (accessories !== null) {
          setOwnedAccessories(accessories)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires :', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchOwnedAccessories()
  }, [])

  /**
   * Gérer l'équipement/déséquipement d'un accessoire
   */
  const handleToggleEquip = async (ownedAccessoryId: string, shouldEquip: boolean): Promise<void> => {
    setProcessingId(ownedAccessoryId)
    setMessage(null)

    try {
      let result
      if (shouldEquip) {
        result = await equipAccessory(ownedAccessoryId, monsterId)
      } else {
        result = await removeAccessory(ownedAccessoryId)
      }

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        // Rafraîchir les données
        const accessories = await getUserOwnedAccessories()
        if (accessories !== null) {
          setOwnedAccessories(accessories)
        }
        if (onAccessoryChange !== undefined) {
          onAccessoryChange()
        }
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      console.error('Erreur lors de l\'équipement/déséquipement :', error)
      setMessage({ type: 'error', text: 'Une erreur est survenue' })
    } finally {
      setProcessingId(null)
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  /**
   * Vérifier si un accessoire est équipé
   */
  const isAccessoryEquipped = (ownedAccessoryId: string): boolean => {
    return equippedAccessories.some(acc => acc._id === ownedAccessoryId)
  }

  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-fuchsia-blue-200'>
      {/* Header avec bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between mb-4'
      >
        <div>
          <h2 className='text-2xl font-bold text-foreground flex items-center gap-2'>
            👜 Mes Accessoires
          </h2>
          <p className='text-sm text-foreground/70'>
            {ownedAccessories.length} accessoire{ownedAccessories.length > 1 ? 's' : ''} possédé{ownedAccessories.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className='text-2xl transition-transform duration-300' style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </div>
      </button>

      {/* Contenu dépliable */}
      {isOpen && (
        <div className='mt-4'>
          {/* Message de feedback */}
          {message !== null && (
            <div
              className={`mb-4 p-3 rounded-lg border-2 ${
                message.type === 'success'
                  ? 'bg-lochinvar-50 border-lochinvar-300 text-lochinvar-800'
                  : 'bg-moccaccino-50 border-moccaccino-300 text-moccaccino-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Liste des accessoires */}
          {loading ? (
            <div className='text-center py-8 text-foreground/50'>
              <p>Chargement...</p>
            </div>
          ) : ownedAccessories.length === 0 ? (
            <div className='text-center py-8 text-foreground/50'>
              <p className='text-lg mb-2'>🎁 Vous n'avez pas encore d'accessoires</p>
              <p className='text-sm'>Achetez-en dans la boutique ci-dessous !</p>
            </div>
          ) : (
            <div className='max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-fuchsia-blue-300 scrollbar-track-slate-100'>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
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
              </div>
            </div>
          )}

          {/* Info footer */}
          <div className='mt-4 p-3 bg-fuchsia-blue-50 rounded-lg border border-fuchsia-blue-200'>
            <p className='text-xs text-fuchsia-blue-800'>
              💡 <strong>Astuce :</strong> Cliquez sur "Équiper" pour voir l'accessoire sur votre monstre !
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

