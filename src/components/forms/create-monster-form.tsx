'use client'

import { useState } from 'react'
import Button from '../button'
import InputField from '../input'
import Image from 'next/image'
import { CreateMonsterFormValues, MonsterFormErrors, MonsterFormState } from '@/types/monster.types'
import { validateMonsterForm } from '@/utils/validation/monster-form.validation'
import { generateMonsterDesign } from '@/services/monsters/monster-generator'

interface CreateMonsterFormProps {
    onSubmit: (values: CreateMonsterFormValues) => void
    onCancel: () => void
}

const createDefaultFormState = (): MonsterFormState => ({
    name: '',
    draw: '/fox.svg',
    state: 'happy',
    showPreview: false
})

function CreateMonsterForm({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
    const [formState, setFormState] = useState<MonsterFormState>(createDefaultFormState)
    const [errors, setErrors] = useState<MonsterFormErrors>({})

    const hasActiveErrors = Object.values(errors).some((value) => Boolean(value))

    const handleGenerateMonster = (): void => {
        const newMonster = generateMonsterDesign({
            style: 'illustrated',
            seed: Date.now().toString()
        })
        
        setFormState(prev => ({
            ...prev,
            draw: '/fox.svg',
            state: newMonster.state || 'happy',
            showPreview: true
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()

        const validationErrors = validateMonsterForm(formState)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const payload: CreateMonsterFormValues = {
            name: formState.name.trim(),
            draw: formState.draw,
            state: formState.state
        }

        onSubmit(payload)
        setFormState(createDefaultFormState())
        setErrors({})
    }

    const handleCancel = (): void => {
        setFormState(createDefaultFormState())
        setErrors({})
        onCancel()
    }

    const getStateStyles = (state: string): string => {
        const baseStyle = 'object-contain transition-all duration-300 '
        const stateStyles = {
            happy: 'brightness-100 saturate-100',
            sad: 'brightness-75 saturate-75 hue-rotate-180',
            angry: 'brightness-100 saturate-150 hue-rotate-[330deg]',
            hungry: 'brightness-90 saturate-125 hue-rotate-[45deg]',
            neutral: 'brightness-90 saturate-50'
        }
        return baseStyle + (stateStyles[state] || stateStyles.neutral)
    }

    return (
        <form className='space-y-6' onSubmit={handleSubmit}>
            <InputField
                label='Nom'
                name='name'
                value={formState.name}
                onChangeText={(value) => {
                    setFormState((previous) => ({...previous, name: value}))
                    if (errors.name !== undefined) setErrors((previous) => ({...previous, name: undefined}))
                }}
                error={errors.name}
            />

            {formState.showPreview && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-48 h-48">
                        <Image
                            src={formState.draw}
                            alt="Aperçu du monstre"
                            fill
                            className={getStateStyles(formState.state)}
                        />
                    </div>
                </div>
            )}

            <div className='flex flex-col gap-4'>
                <Button
                    onClick={handleGenerateMonster}
                    type='button'
                    className='bg-gradient-to-r from-fuchsia-blue-500 to-lochinvar-500 hover:from-lochinvar-500 hover:to-fuchsia-blue-500'
                >
                    {formState.showPreview ? 'Régénérer un monstre' : 'Générer un monstre'}
                </Button>

                <div className='flex justify-end gap-3'>
                    <Button onClick={handleCancel} type='button' variant='ghost'>
                        Annuler
                    </Button>
                    <Button
                        disabled={hasActiveErrors || !formState.showPreview}
                        type='submit'
                        className='bg-gradient-to-r from-fuchsia-blue-500 to-lochinvar-500 hover:from-lochinvar-500 hover:to-fuchsia-blue-500'
                    >
                        Créer
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default CreateMonsterForm
