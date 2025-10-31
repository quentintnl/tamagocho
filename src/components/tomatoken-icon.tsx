/**
 * TomatokenIcon Component
 *
 * Presentation Layer: Display tomatoken coin icon
 *
 * Responsibilities:
 * - Display tomatoken SVG icon with configurable size
 * - Provide consistent icon across the app
 *
 * Single Responsibility: Render tomatoken icon
 */

import Image from 'next/image'

interface TomatokenIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48
}

/**
 * Tomatoken icon component
 * Displays the tomatoken.svg icon with configurable size
 */
export default function TomatokenIcon ({
  size = 'md',
  className = ''
}: TomatokenIconProps): React.ReactNode {
  const dimension = sizeMap[size]

  return (
    <Image
      src='/tomatokens.svg'
      alt='Tomatoken'
      width={dimension}
      height={dimension}
      className={className}
      aria-hidden='true'
    />
  )
}
