/**
 * useWallet Hook
 *
 * Presentation Layer: React hook for wallet state management
 *
 * Responsibilities:
 * - Fetch and cache wallet data
 * - Provide loading and error states
 * - Auto-refresh wallet data
 *
 * Single Responsibility: Manage wallet state in React components
 */

'use client'

import { useState, useEffect } from 'react'
import { getUserWallet } from '@/actions/wallet.actions'
import type { Wallet } from '@/types/wallet'

interface UseWalletReturn {
  wallet: Wallet | null
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

/**
 * Custom hook to manage wallet state
 *
 * @returns Wallet data, loading state, error state, and refresh function
 */
export function useWallet (): UseWalletReturn {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWallet = async (): Promise<void> => {
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
  }

  useEffect(() => {
    void fetchWallet()
  }, [])

  return {
    wallet,
    isLoading,
    error,
    refresh: fetchWallet
  }
}
