/**
 * Accessories Demo Page
 *
 * Page de démonstration des accessoires sans authentification
 * Pour tester visuellement les cartes d'accessoires
 */

'use client'

import { useState, useEffect } from 'react'
import { AccessoriesList } from '@/components/wallet/accessories-list'
import { getAvailableAccessories } from '@/services/accessory.service'
import { getUserOwnedAccessoryIds, purchaseAccessoryOnly } from '@/actions/accessory.actions'
import { PurchaseConfirmationModal } from '@/components/accessories/purchase-confirmation-modal'
import { useWallet } from '@/hooks/useWallet'
import { toast } from 'react-toastify'
import type { Accessory } from '@/types/accessory'

export default function AccessoriesDemoPage (): React.ReactNode {
  const [accessories] = useState(getAvailableAccessories())
  const [ownedAccessoryIds, setOwnedAccessoryIds] = useState<string[]>([])
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const { wallet } = useWallet()

  // Charger les accessoires possédés
  useEffect(() => {
    const loadOwnedAccessories = async (): Promise<void> => {
      try {
        const ownedIds = await getUserOwnedAccessoryIds()
        setOwnedAccessoryIds(ownedIds)
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires possédés:', error)
      }
    }

    void loadOwnedAccessories()
  }, [])

  const handlePurchase = async (id: string): Promise<void> => {
    const accessory = accessories.find(acc => acc.id === id)
    if (accessory === undefined) {
      toast.error('Accessoire introuvable')
      return
    }

    setSelectedAccessory(accessory)
  }

  const handleConfirmPurchase = async (): Promise<void> => {
    if (selectedAccessory === null) return

    try {
      const result = await purchaseAccessoryOnly(selectedAccessory.id)

      if (result.success) {
        toast.success(result.message, {
          autoClose: 5000
        })

        // Recharger les accessoires possédés
        const updatedOwnedIds = await getUserOwnedAccessoryIds()
        setOwnedAccessoryIds(updatedOwnedIds)
      } else {
        toast.error(result.message, {
          autoClose: 5000
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error)
      toast.error('Une erreur est survenue lors de l\'achat. Veuillez réessayer.')
    } finally {
      setSelectedAccessory(null)
    }
  }

  const handleCancelPurchase = (): void => {
    setSelectedAccessory(null)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50'>
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <h1 className='text-4xl font-bold text-slate-900'>
            🎨 Boutique d&apos;Accessoires
          </h1>
          <p className='mt-2 text-lg text-slate-600'>
            Personnalisez vos monstres avec style !
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <main className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h2 className='text-2xl font-semibold text-slate-900'>
            Tous les accessoires disponibles
          </h2>
          <p className='mt-2 text-sm text-slate-600'>
            {accessories.length} accessoires trouvés
          </p>
        </div>

        <AccessoriesList
          accessories={accessories}
          onPurchase={handlePurchase}
          ownedAccessoryIds={ownedAccessoryIds}
        />
      </main>

      {/* Modal de confirmation */}
      {selectedAccessory !== null && (
        <PurchaseConfirmationModal
          accessory={selectedAccessory}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCancelPurchase}
          currentBalance={wallet?.coin ?? 0}
        />
      )}
    </div>
  )
}

