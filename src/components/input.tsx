import React, {useState} from 'react'

function InputField({
                        type,
                        name,
                        label,
                        value,
                        onChange,
                        onChangeText,
                        placeholder,
                        className
                    }: {
    type?: string
    name?: string
    label?: string
    value?: string
    placeholder?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onChangeText?: (text: string) => void
}): React.ReactNode {
    const [isFocused, setIsFocused] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (onChange !== undefined) onChange(e)
        if (onChangeText !== undefined) onChangeText(e.target.value)
    }

    return (
        <div className="flex flex-col space-y-2 w-full group">
            <label
                htmlFor={name}
                className={`text-sm font-medium transition-colors duration-200 ${
                    isFocused ? 'text-fuchsia-blue-600' : 'text-lochinvar-600'
                }`}
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`
                        w-full px-4 py-2.5 rounded-xl
                        border-2 border-lochinvar-200
                        bg-white/70 backdrop-blur-sm
                        transition-all duration-300
                        placeholder:text-lochinvar-400
                        focus:outline-none focus:border-fuchsia-blue-400 focus:ring-4 focus:ring-fuchsia-blue-100
                        hover:border-lochinvar-300
                        ${isFocused ? 'shadow-lg' : 'shadow-md'}
                        ${className ?? ''}
                    `}
                />
                <div className={`
                    absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-blue-400 to-lochinvar-400 opacity-0
                    transition-opacity duration-300 -z-10
                    group-hover:opacity-10
                `}/>
            </div>
        </div>
    )
}

export default InputField
