/**
 * Accessory Shop Client Component
 *
 * Presentation Layer: Page de la boutique d'accessoires
 *
 * Responsibilities:
 * - Afficher les accessoires disponibles
 * - Permettre l'achat d'accessoires
 * - Gérer les filtres par catégorie et rareté
 *
 * Single Responsibility: Interface de la boutique d'accessoires
 */

'use client'

import { useState, useEffect } from 'react'
import { useWalletContext } from '@/contexts/wallet-context'
import PageHeaderWithWallet from '@/components/page-header-with-wallet'
import { AccessoriesList } from './accessories-list'
import { getAvailableAccessories } from '@/services/accessory.service'
import { getUserOwnedAccessoryIds, purchaseAccessory } from '@/actions/accessory.actions'
import { getMonsters } from '@/actions/monsters'
import type { AccessoryCategory, AccessoryRarity } from '@/types/accessory'
import type { authClient } from '@/lib/auth-client'

type Session = typeof authClient.$Infer.Session

interface AccessoryShopClientProps {
  session: Session
}

/**
 * Composant client de la boutique d'accessoires
 */
export default function AccessoryShopClient ({ session }: AccessoryShopClientProps): React.ReactNode {
  const { wallet, isLoading, refreshWallet } = useWalletContext()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<AccessoryCategory | 'all'>('all')
  const [rarityFilter, setRarityFilter] = useState<AccessoryRarity | 'all'>('all')
  const [ownedAccessoryIds, setOwnedAccessoryIds] = useState<string[]>([])
  const [isLoadingOwned, setIsLoadingOwned] = useState(true)

  // Charger les accessoires possédés
  useEffect(() => {
    const loadOwnedAccessories = async (): Promise<void> => {
      try {
        const ids = await getUserOwnedAccessoryIds()
        setOwnedAccessoryIds(ids)
      } catch (error) {
        console.error('Error loading owned accessories:', error)
      } finally {
        setIsLoadingOwned(false)
      }
    }

    void loadOwnedAccessories()
  }, [])

  // Récupérer tous les accessoires
  const allAccessories = getAvailableAccessories()

  // Filtrer les accessoires
  const filteredAccessories = allAccessories.filter(accessory => {
    const matchesCategory = categoryFilter === 'all' || accessory.category === categoryFilter
    const matchesRarity = rarityFilter === 'all' || accessory.rarity === rarityFilter
    return matchesCategory && matchesRarity
  })

  /**
   * Gérer l'achat d'un accessoire
   */
  const handlePurchase = async (accessoryId: string): Promise<void> => {
    setMessage(null)

    const accessory = allAccessories.find(acc => acc.id === accessoryId)
    if (accessory === undefined) {
      setMessage({ type: 'error', text: '❌ Accessoire introuvable' })
      return
    }

    // Vérifier si le joueur a assez de coins
    if (wallet === null || wallet.coin < accessory.price) {
      setMessage({ type: 'error', text: `❌ Solde insuffisant. Il vous manque ${accessory.price - (wallet?.coin ?? 0)} coins` })
      return
    }

    try {
      // Récupérer le premier monstre de l'utilisateur
      const monsters = await getMonsters()

      if (monsters.length === 0) {
        setMessage({ type: 'error', text: '❌ Vous devez d\'abord créer un monstre' })
        return
      }

      const firstMonster = monsters[0]

      // Acheter et équiper l'accessoire
      const result = await purchaseAccessory(accessoryId, firstMonster._id.toString())

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        // Rafraîchir le wallet et les accessoires possédés
        await refreshWallet()
        const updatedIds = await getUserOwnedAccessoryIds()
        setOwnedAccessoryIds(updatedIds)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error)
      setMessage({ type: 'error', text: '❌ Une erreur est survenue lors de l\'achat' })
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-white to-lochinvar-50'>
      {/* Header avec wallet */}
      <PageHeaderWithWallet title="Boutique d'Accessoires" />

      {/* Contenu principal */}
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Message de feedback */}
        {message !== null && (
          <div
            className={`mb-6 rounded-2xl p-4 text-center font-medium transition-all ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Filtres */}
        <div className='mb-8 flex flex-wrap gap-4'>
          {/* Filtre par catégorie */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='category-filter' className='text-sm font-semibold text-slate-700'>
              Catégorie
            </label>
            <select
              id='category-filter'
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value as AccessoryCategory | 'all') }}
              className='rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all hover:border-lochinvar-300 focus:border-lochinvar-500 focus:outline-none focus:ring-2 focus:ring-lochinvar-200'
            >
              <option value='all'>Toutes</option>
              <option value='hat'>Chapeaux</option>
              <option value='glasses'>Lunettes</option>
              <option value='shoes'>Chaussures</option>
              <option value='background'>Arrière-plans</option>
              <option value='effect'>Effets</option>
            </select>
          </div>

          {/* Filtre par rareté */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='rarity-filter' className='text-sm font-semibold text-slate-700'>
              Rareté
            </label>
            <select
              id='rarity-filter'
              value={rarityFilter}
              onChange={(e) => { setRarityFilter(e.target.value as AccessoryRarity | 'all') }}
              className='rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all hover:border-lochinvar-300 focus:border-lochinvar-500 focus:outline-none focus:ring-2 focus:ring-lochinvar-200'
            >
              <option value='all'>Toutes</option>
              <option value='common'>Commun</option>
              <option value='rare'>Rare</option>
              <option value='epic'>Épique</option>
              <option value='legendary'>Légendaire</option>
            </select>
          </div>

          {/* Compteur d'accessoires */}
          <div className='ml-auto flex items-end'>
            <p className='text-sm font-medium text-slate-600'>
              {filteredAccessories.length} accessoire{filteredAccessories.length > 1 ? 's' : ''} trouvé{filteredAccessories.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Liste des accessoires */}
        {isLoading || isLoadingOwned
          ? (
            <div className='flex min-h-[400px] items-center justify-center'>
              <div className='text-center'>
                <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-lochinvar-200 border-t-lochinvar-600' />
                <p className='mt-4 text-sm text-slate-600'>Chargement...</p>
              </div>
            </div>
            )
          : (
            <AccessoriesList
              accessories={filteredAccessories}
              onPurchase={handlePurchase}
              ownedAccessoryIds={ownedAccessoryIds}
            />
            )}
      </main>
    </div>
  )
}
