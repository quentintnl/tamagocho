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
import { PurchaseConfirmationModal } from '@/components/accessories/purchase-confirmation-modal'
import { ShopTabs, type ShopTab } from '@/components/shop/shop-tabs'
import { ShopTabsSkeleton } from '@/components/shop/shop-tabs-skeleton'
import { AccessoriesGridSkeleton } from '@/components/shop/accessories-grid-skeleton'
import { ShopLayout } from '@/components/shop/shop-layout'
import { ShopStats } from '@/components/shop/shop-stats'
import { ShopSectionHeader } from '@/components/shop/shop-section-header'
import Button from '@/components/button'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
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
  const [hideOwned, setHideOwned] = useState(false)
  const { wallet } = useWallet()

  // Filtrer les accessoires selon l'onglet actif et le statut de possession
  const filteredAccessories = useMemo(() => {
    let filtered: Accessory[]

    if (activeTab === 'accessories') {
      // Tout sauf les backgrounds
      filtered = accessories.filter(acc => acc.category !== 'background')
    } else {
      // Seulement les backgrounds
      filtered = accessories.filter(acc => acc.category === 'background')
    }

    // Filtrer les accessoires possédés si hideOwned est activé
    if (hideOwned) {
      filtered = filtered.filter(acc => !ownedAccessoryIds.includes(acc.id))
    }

    return filtered
  }, [accessories, activeTab, hideOwned, ownedAccessoryIds])

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
        showErrorToast('Erreur lors du chargement des accessoires')
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
      showErrorToast('Accessoire introuvable')
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
        showSuccessToast(result.message, { autoClose: 5000 })

        // Recharger les données pour afficher l'accessoire comme possédé
        const updatedOwnedIds = await getUserOwnedAccessoryIds()
        setOwnedAccessoryIds(updatedOwnedIds)
      } else {
        showErrorToast(result.message, { autoClose: 5000 })
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error)
      showErrorToast('Une erreur est survenue lors de l\'achat. Veuillez réessayer.')
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

  return (
    <ShopLayout>
      {/* Statistiques de la boutique */}
      <ShopStats
        totalItems={isLoading ? null : accessories.length}
        ownedItems={isLoading ? null : ownedAccessoryIds.length}
        balance={isLoading ? null : (wallet?.coin ?? 0)}
      />

      {/* Onglets de navigation */}
      {isLoading
        ? <ShopTabsSkeleton />
        : (
          <ShopTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            accessoriesCount={counts.accessories}
            backgroundsCount={counts.backgrounds}
          />
          )}

      {/* En-tête de section */}
      <ShopSectionHeader
        title={isLoading ? null : (activeTab === 'accessories' ? '🎨 Accessoires' : '🖼️ Arrière-plans')}
        subtitle={isLoading ? null : `${filteredAccessories.length} ${activeTab === 'accessories' ? 'accessoires' : 'arrière-plans'} disponibles`}
      />

      {/* Bouton de filtre pour masquer/afficher les accessoires possédés */}
      {!isLoading && (
        <div className='mb-6 flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { setHideOwned(!hideOwned) }}
          >
            {hideOwned ? '👁️ Afficher les possédés' : '🙈 Masquer les possédés'}
          </Button>
        </div>
      )}

      {/* Liste des accessoires */}
      {isLoading
        ? <AccessoriesGridSkeleton />
        : (
          <AccessoriesList
            accessories={filteredAccessories}
            onPurchase={handlePurchase}
            ownedAccessoryIds={ownedAccessoryIds}
          />
          )}

      {/* Modal de confirmation */}
      {selectedAccessory !== null && (
        <PurchaseConfirmationModal
          accessory={selectedAccessory}
          onConfirm={handleConfirmPurchase}
          onCancel={handleCancelPurchase}
          currentBalance={wallet?.coin ?? 0}
        />
      )}
    </ShopLayout>
  )
}
