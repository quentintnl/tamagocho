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
 * Single Responsibility Principle Applied:
 * - Only displays wallet information
 * - Navigation handled by parent component via onClick prop
 */

'use client'

import { useWalletContext } from '@/contexts/wallet-context'
import TomatokenIcon from './tomatoken-icon'

interface WalletDisplayProps {
  variant?: 'default' | 'compact'
  onClick?: () => void
}

/**
 * Displays the user's wallet balance
 *
 * @param variant - Display variant (default: full display, compact: icon + number)
 * @param onClick - Optional click handler (for navigation)
 * @returns Wallet display component
 */
export default function WalletDisplay ({
  variant = 'default',
  onClick
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

  // Compact variant
  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className='flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-meadow-50 transition-all duration-200 cursor-pointer group'
        title='Gérer mon wallet'
      >
        <div className='flex items-center justify-center w-6 h-6 bg-gradient-to-br from-sunset-400 to-sunset-600 rounded-full shadow-sm group-hover:scale-110 transition-transform'>
          <TomatokenIcon size='xs' />
        </div>
        <span className='text-sm font-bold text-forest-800 group-hover:text-meadow-600 transition-colors'>
          {wallet.coin.toLocaleString()}
        </span>
      </button>
    )
  }

  // Default variant
  return (
    <button
      onClick={onClick}
      className='flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-sunset-50 to-sunset-100 rounded-2xl border-2 border-sunset-200 shadow-md hover:shadow-lg hover:border-sunset-300 transition-all duration-200 cursor-pointer group'
      title='Gérer mon wallet'
    >
      <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-sunset-400 to-sunset-600 rounded-full shadow-md group-hover:scale-110 transition-transform'>
        <TomatokenIcon size='sm' />
      </div>
      <div className='flex flex-col'>
        <span className='text-xs text-forest-600 font-medium'>Pièces</span>
        <span className='text-lg font-bold text-forest-800 group-hover:text-meadow-600 transition-colors'>
          {wallet.coin.toLocaleString()}
        </span>
      </div>
    </button>
  )
}

