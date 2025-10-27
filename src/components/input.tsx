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
        <label className='text-sm font-medium text-gray-700 ml-1'>
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm
          transition-all duration-300 text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-moccaccino-400 focus:border-moccaccino-400
          hover:border-moccaccino-300 hover:bg-white/70
          ${(error != null && error.length > 0) ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}
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
