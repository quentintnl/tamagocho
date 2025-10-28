/**
 * WalletDisplay Component
 *
 * Presentation Layer: Display user's coin balance
 *
 * Responsibilities:
 * - Show coin amount with icon
 * - Handle loading state
 * - Handle error state
 *
 * Single Responsibility: Display wallet information in UI
 */

'use client'

import { useWallet } from '@/hooks/useWallet'

interface WalletDisplayProps {
  variant?: 'default' | 'compact'
}

/**
 * Displays the user's wallet balance
 *
 * @param variant - Display variant (default: full display, compact: icon + number)
 * @returns Wallet display component
 */
export default function WalletDisplay ({
  variant = 'default'
}: WalletDisplayProps): React.ReactNode {
  const { wallet, isLoading, error } = useWallet()

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center space-x-2 animate-pulse'>
        <div className='w-5 h-5 bg-gray-300 rounded-full' />
        <div className='w-12 h-4 bg-gray-300 rounded' />
      </div>
    )
  }

  // Error state
  if (error !== null || wallet === null) {
    return null
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className='flex items-center space-x-2'>
        <div className='flex items-center justify-center w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-sm'>
          <span className='text-xs font-bold text-white'>💰</span>
        </div>
        <span className='text-sm font-bold text-gray-800'>
          {wallet.coin.toLocaleString()}
        </span>
      </div>
    )
  }

  // Default variant
  return (
    <div className='flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 shadow-sm'>
      <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-md'>
        <span className='text-base font-bold text-white'>💰</span>
      </div>
      <div className='flex flex-col'>
        <span className='text-xs text-gray-500'>Pièces</span>
        <span className='text-lg font-bold text-gray-800'>
          {wallet.coin.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

