/**
 * Shop Page - Boutique d'Accessoires
 *
 * Page dédiée à la boutique d'accessoires pour personnaliser les monstres
 * Applique les principes Clean Architecture avec séparation des responsabilités
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { AccessoriesList } from '@/components/wallet/accessories-list'
import { getAvailableAccessories } from '@/services/accessory.service'
import { getUserOwnedAccessoryIds, purchaseAccessoryOnly } from '@/actions/accessory.actions'
import { useWallet } from '@/hooks/useWallet'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { PurchaseConfirmationModal } from '@/components/accessories/purchase-confirmation-modal'
import { ShopTabs, type ShopTab } from '@/components/shop/shop-tabs'
import { ShopSkeleton } from '@/components/shop/shop-skeleton'
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
  const [activeTab, setActiveTab] = useState<ShopTab>('accessories')
  const { wallet } = useWallet()

  // Filtrer les accessoires selon l'onglet actif
  const filteredAccessories = useMemo(() => {
    if (activeTab === 'accessories') {
      // Tout sauf les backgrounds
      return accessories.filter(acc => acc.category !== 'background')
    } else {
      // Seulement les backgrounds
      return accessories.filter(acc => acc.category === 'background')
    }
  }, [accessories, activeTab])

  // Compter les accessoires par catégorie
  const counts = useMemo(() => {
    return {
      accessories: accessories.filter(acc => acc.category !== 'background').length,
      backgrounds: accessories.filter(acc => acc.category === 'background').length
    }
  }, [accessories])

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
    return <ShopSkeleton />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-100 via-meadow-50 to-lavender-50 relative overflow-hidden'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet title='Boutique' />

      {/* Bulles décoratives de fond - thème nature */}
      <div className='pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-meadow-200/50 blur-3xl' aria-hidden='true' />
      <div className='pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl' aria-hidden='true' />

      {/* Contenu principal */}
      <main className='relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pt-6'>

        {/* Statistiques de la boutique */}
        <div className='mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto'>
          <div className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-meadow-200/60 text-center hover:shadow-xl transition-shadow'>
            <p className='text-sm text-forest-600 font-medium'>Articles disponibles</p>
            <p className='text-3xl font-bold text-meadow-600'>{accessories.length}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-sky-200/60 text-center hover:shadow-xl transition-shadow'>
            <p className='text-sm text-forest-600 font-medium'>Accessoires possédés</p>
            <p className='text-3xl font-bold text-sky-600'>{ownedAccessoryIds.length}</p>
          </div>
          <div className='bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-2 ring-sunset-200/60 text-center hover:shadow-xl transition-shadow'>
            <p className='text-sm text-forest-600 font-medium'>Votre solde</p>
            <p className='text-3xl font-bold text-sunset-600'>{wallet?.coin ?? 0} 💰</p>
          </div>
        </div>

        {/* Onglets de navigation */}
        <ShopTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accessoriesCount={counts.accessories}
          backgroundsCount={counts.backgrounds}
        />

        {/* En-tête de section */}
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold text-forest-800'>
            {activeTab === 'accessories' ? '🎨 Accessoires' : '🖼️ Arrière-plans'}
          </h2>
          <p className='mt-2 text-sm text-forest-600'>
            {filteredAccessories.length} {activeTab === 'accessories' ? 'accessoires' : 'arrière-plans'} disponibles
          </p>
        </div>

        {/* Liste des accessoires */}
        <AccessoriesList
          accessories={filteredAccessories}
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
