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
    case 'primary': return disabled ? 'bg-moccaccino-200 text-moccaccino-400' : 'bg-moccaccino-500 hover:bg-moccaccino-700 text-white'
    case 'ghost': return disabled ? 'bg-transparent text-moccaccino-200' : 'bg-transparent text-moccaccino-500 hover:bg-moccaccino-100/10'
    case 'underline': return disabled ? 'underline text-moccaccino-200' : 'underline hover:no-underline underline-offset-6'
    case 'outline': return disabled ? 'border border-moccaccino-200 text-moccaccino-400' : 'border border-moccaccino-500 text-moccaccino-500 hover:bg-moccaccino-100/10'
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
