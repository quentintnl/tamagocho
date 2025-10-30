function InputField ({
  type,
  name,
  label,
  value,
  onChange,
  onChangeText,
  error
}: {
  type?: string
  name?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
  error?: string
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <div className='flex flex-col space-y-2'>
      {(label != null && label.length > 0) && (
        <label className='text-sm font-medium text-forest-700 ml-1'>
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-2xl border-2 bg-white/60 backdrop-blur-sm
          transition-all duration-300 text-forest-800 placeholder-forest-400
          focus:outline-none focus:ring-2 focus:ring-meadow-400 focus:border-meadow-500
          hover:border-meadow-300 hover:bg-white/80
          ${(error != null && error.length > 0) ? 'border-red-400 bg-red-50/50' : 'border-meadow-200'}
        `}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={`Saisissez votre ${label?.toLowerCase().replace(':', '') ?? 'information'}`}
      />
      {(error != null && error.length > 0) && (
        <span className='text-sm text-red-500 ml-1'>
          {error}
        </span>
      )}
    </div>
  )
}

export default InputField
