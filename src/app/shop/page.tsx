/**
 * Shop Page - Boutique d'Accessoires
 *
 * Page dédiée à la boutique d'accessoires pour personnaliser les monstres
 * Applique les principes Clean Architecture avec séparation des responsabilités
 */

'use client'

import { useState, useEffect } from 'react'
import { AccessoriesList } from '@/components/wallet/accessories-list'
import { getAvailableAccessories } from '@/services/accessory.service'
import { getUserOwnedAccessoryIds, purchaseAccessoryOnly } from '@/actions/accessory.actions'
import { useWallet } from '@/hooks/useWallet'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { PurchaseConfirmationModal } from '@/components/accessories/purchase-confirmation-modal'
import { toast } from 'react-toastify'
import type { Accessory } from '@/types/accessory'

/**
 * Composant principal de la page boutique
 *
 * Responsabilités :
 * - Afficher tous les accessoires disponibles
 * - Gérer l'achat d'accessoires
 * - Vérifier le solde du wallet avant achat
 * - Afficher les accessoires déjà possédés
 *
 * @returns {React.ReactNode} Page de la boutique
 */
export default function ShopPage (): React.ReactNode {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [ownedAccessoryIds, setOwnedAccessoryIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const { wallet } = useWallet()

  // Charger les accessoires disponibles et possédés au montage
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        // Charger les accessoires disponibles
        const availableAccessories = getAvailableAccessories()
        setAccessories(availableAccessories)

        // Charger les accessoires possédés par l'utilisateur
        // L'action server vérifie la session automatiquement
        const ownedIds = await getUserOwnedAccessoryIds()
        setOwnedAccessoryIds(ownedIds)
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires:', error)
        toast.error('Erreur lors du chargement des accessoires')
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [])

  /**
   * Ouvre le modal de confirmation pour un accessoire
   *
   * @param {string} accessoryId - ID de l'accessoire à acheter
   */
  const handlePurchase = async (accessoryId: string): Promise<void> => {
    const accessory = accessories.find(acc => acc.id === accessoryId)
    if (accessory === undefined || accessory === null) {
      toast.error('Accessoire introuvable')
      return
    }

    setSelectedAccessory(accessory)
  }

  /**
   * Confirme l'achat de l'accessoire sélectionné
   */
  const handleConfirmPurchase = async (): Promise<void> => {
    if (selectedAccessory === null) return

    try {
      // Appeler l'action pour acheter l'accessoire SANS l'équiper
      const result = await purchaseAccessoryOnly(selectedAccessory.id)

      if (result.success) {
        toast.success(result.message, {
          icon: '✨',
          autoClose: 5000
        })

        // Recharger les données pour afficher l'accessoire comme possédé
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

  /**
   * Annule l'achat
   */
  const handleCancelPurchase = (): void => {
    setSelectedAccessory(null)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>🛍️</div>
          <p className='text-xl font-medium text-slate-700'>Chargement de la boutique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Boutique' showShopButton={false} />

      {/* Bulles décoratives de fond */}
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-fuchsia-blue-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-lochinvar-200/50 blur-3xl' aria-hidden='true' />

      {/* Contenu principal */}
      <main className='relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pt-24'>
        {/* En-tête de la boutique */}
        <div className='mb-8 text-center'>
          <div className='inline-block mb-4'>
            <div className='text-7xl animate-bounce'>🛍️</div>
          </div>
          <h1 className='text-4xl font-bold text-slate-900 mb-3'>
            Boutique d&apos;Accessoires
          </h1>
          <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
            Personnalisez vos monstres avec style ! Découvrez notre collection exclusive d&apos;accessoires pour rendre vos compagnons uniques.
          </p>
        </div>

        {/* Statistiques de la boutique */}
        <div className='mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto'>
          <div className='bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md ring-1 ring-white/60 text-center'>
            <p className='text-sm text-slate-600'>Articles disponibles</p>
            <p className='text-3xl font-bold text-moccaccino-600'>{accessories.length}</p>
          </div>
          <div className='bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md ring-1 ring-white/60 text-center'>
            <p className='text-sm text-slate-600'>Accessoires possédés</p>
            <p className='text-3xl font-bold text-lochinvar-600'>{ownedAccessoryIds.length}</p>
          </div>
          <div className='bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md ring-1 ring-white/60 text-center'>
            <p className='text-sm text-slate-600'>Votre solde</p>
            <p className='text-3xl font-bold text-fuchsia-blue-600'>{wallet?.coin ?? 0} 💰</p>
          </div>
        </div>

        {/* Liste des accessoires */}
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
