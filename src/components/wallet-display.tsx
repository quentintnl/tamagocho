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

import { useWalletContext } from '@/contexts/wallet-context'

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
  const { wallet, isLoading, error } = useWalletContext()

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

  /**
   * Redirige vers la page wallet
   */
  const handleClick = (): void => {
    window.location.href = '/wallet'
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className='flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group'
        title='Gérer mon wallet'
      >
        <div className='flex items-center justify-center w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-sm group-hover:scale-110 transition-transform'>
          <span className='text-xs font-bold text-white'>💰</span>
        </div>
        <span className='text-sm font-bold text-gray-800 group-hover:text-moccaccino-600 transition-colors'>
          {wallet.coin.toLocaleString()}
        </span>
      </button>
    )
  }

  // Default variant
  return (
    <button
      onClick={handleClick}
      className='flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md hover:border-yellow-300 transition-all duration-200 cursor-pointer group'
      title='Gérer mon wallet'
    >
      <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-md group-hover:scale-110 transition-transform'>
        <span className='text-base font-bold text-white'>💰</span>
      </div>
      <div className='flex flex-col'>
        <span className='text-xs text-gray-500'>Pièces</span>
        <span className='text-lg font-bold text-gray-800 group-hover:text-moccaccino-600 transition-colors'>
          {wallet.coin.toLocaleString()}
        </span>
      </div>
    </button>
  )
}

