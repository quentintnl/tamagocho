function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-sm'
    case 'md': return 'px-4 py-2 text-md'
    case 'lg': return 'px-6 py-3 text-lg'
    case 'xl': return 'px-8 py-4 text-xl'
  }
}

function getVariant (variant: 'primary' | 'ghost' | 'underline' | 'outline', disabled: boolean): string {
  switch (variant) {
    case 'primary': return disabled ? 'bg-meadow-200 text-meadow-400' : 'bg-gradient-to-r from-meadow-500 to-forest-500 hover:from-meadow-600 hover:to-forest-600 text-white shadow-md hover:shadow-lg'
    case 'ghost': return disabled ? 'bg-transparent text-meadow-200' : 'bg-transparent text-forest-600 hover:bg-meadow-100/50'
    case 'underline': return disabled ? 'underline text-meadow-200' : 'underline hover:no-underline underline-offset-6 text-forest-600'
    case 'outline': return disabled ? 'border-2 border-meadow-200 text-meadow-400' : 'border-2 border-meadow-500 text-forest-700 hover:bg-meadow-50 hover:border-forest-500'
  }
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  type
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}): React.ReactNode {
  return (
    <button
      className={`rounded-md  ${disabled ? '' : 'transition-all duration-300 cursor-pointer active:scale-95'} ${getSize(size)} ${getVariant(variant, disabled)}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
