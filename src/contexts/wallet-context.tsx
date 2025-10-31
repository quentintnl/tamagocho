/**
 * WalletContext
 *
 * Application Layer: Global wallet state management
 *
 * Responsibilities:
 * - Provide wallet data to all components
 * - Expose refresh function to update wallet
 * - Handle loading and error states globally
 *
 * Single Responsibility: Centralize wallet state management
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getUserWallet } from '@/actions/wallet.actions'
import type { Wallet } from '@/types/wallet'

interface WalletContextValue {
  wallet: Wallet | null
  isLoading: boolean
  error: Error | null
  refreshWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextValue | null>(null)

interface WalletProviderProps {
  children: ReactNode
}

/**
 * Provider component for wallet context
 *
 * Wraps the application to provide global wallet state
 *
 * @param children - Child components
 */
export function WalletProvider ({ children }: WalletProviderProps): ReactNode {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWallet = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUserWallet()
      setWallet(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch wallet'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchWallet()
  }, [fetchWallet])

  const value: WalletContextValue = {
    wallet,
    isLoading,
    error,
    refreshWallet: fetchWallet
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

/**
 * Hook to use wallet context
 *
 * Must be used within a WalletProvider
 *
 * @returns Wallet context value
 * @throws Error if used outside WalletProvider
 */
export function useWalletContext (): WalletContextValue {
  const context = useContext(WalletContext)

  if (context === null) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }

  return context
}
