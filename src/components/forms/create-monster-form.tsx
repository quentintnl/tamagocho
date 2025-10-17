'use client'

import {useEffect, useMemo, useState} from 'react'
import Button from '../button'
import InputField from '../input'
import {MonsterPreview} from '../monsters'
import {
    createInitialFormState,
    type CreateMonsterFormDraft,
    type CreateMonsterFormErrors,
    validateCreateMonsterForm
} from './create-monster-form.validation'
import {generateMonsterDesign} from '../../services/monsters/monster-generator'
import {
    DEFAULT_MONSTER_STATE,
    MONSTER_STATES,
    type MonsterBodyShape,
    type MonsterDesign,
    type MonsterDesignStyle,
    type MonsterState,
    type MonsterVariantId
} from '@/types/monster'
import type {CreateMonsterFormProps} from '@/types/forms/create-monster-form'

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
    happy: 'Heureux 😊',
    sad: 'Triste 😢',
    angry: 'Fâché 😡',
    hungry: 'Affamé 😋',
    sleepy: 'Somnolent 😴'
}

const VARIANT_LABELS: Record<MonsterVariantId, string> = {
    cat: 'Variante Féline',
    dog: 'Variante Canine',
    rabbit: 'Variante Lapine',
    panda: 'Variante Panda'
}

const BODY_SHAPE_LABELS: Record<MonsterBodyShape, string> = {
    round: 'silhouette ronde',
    oval: 'silhouette ovale',
    bean: 'silhouette haricot',
    square: 'silhouette carrée',
    pear: 'silhouette poire'
}

const DESIGN_STYLE_LABELS: Record<MonsterDesignStyle, string> = {
    illustrated: 'Style illustré détaillé',
    pixel: 'Pixel art simplifié'
}

const DESIGN_STYLE_OPTIONS: Array<{ id: MonsterDesignStyle, label: string, helper: string }> = [
    {
        id: 'illustrated',
        label: 'Illustré',
        helper: 'Détails riches et animations soignées.'
    },
    {
        id: 'pixel',
        label: 'Pixel art',
        helper: 'Sprite rétro facile à intégrer.'
    }
]

const EAR_DESCRIPTIONS: Record<MonsterDesign['features']['earShape'], string> = {
    pointy: 'oreilles pointues',
    droopy: 'oreilles tombantes',
    long: 'oreilles allongées',
    round: 'oreilles rondes'
}

const TAIL_DESCRIPTIONS: Record<MonsterDesign['features']['tailShape'], string> = {
    long: 'queue longue',
    short: 'queue courte',
    puff: 'queue pompon',
    none: 'sans queue'
}

const MUZZLE_DESCRIPTIONS: Record<MonsterDesign['features']['muzzle'], string> = {
    small: 'petit museau',
    medium: 'museau médian',
    flat: 'museau plat'
}

const MARKING_DESCRIPTIONS: Record<MonsterDesign['features']['markings'], string> = {
    plain: 'pelage uni',
    mask: 'masque facial',
    patch: 'patch contrasté'
}

function CreateMonsterForm({onSubmit, onCancel}: CreateMonsterFormProps): React.ReactNode {
    const [formState, setFormState] = useState<CreateMonsterFormDraft>(() => createInitialFormState())
    const [errors, setErrors] = useState<CreateMonsterFormErrors>({})
    const [design, setDesign] = useState<MonsterDesign | null>(null)
    const [previewState, setPreviewState] = useState<MonsterState>(DEFAULT_MONSTER_STATE)
    const [designStyle, setDesignStyle] = useState<MonsterDesignStyle>('illustrated')

    const featureSummary = useMemo(() => {
        if (design === null) return ''
        const traits: string[] = []
        traits.push(EAR_DESCRIPTIONS[design.features.earShape])
        traits.push(TAIL_DESCRIPTIONS[design.features.tailShape])
        traits.push(design.features.whiskers ? 'moustaches apparentes' : 'sans moustaches')
        traits.push(MUZZLE_DESCRIPTIONS[design.features.muzzle])
        traits.push(MARKING_DESCRIPTIONS[design.features.markings])
        traits.push(BODY_SHAPE_LABELS[design.bodyShape])
        return traits.join(' · ')
    }, [design])

    useEffect(() => {
        if (design === null) {
            setDesign(generateMonsterDesign({seed: formState.name, style: designStyle}))
        }
    }, [design, designStyle, formState.name])

    const selectedStyleOption = useMemo(() => (
        DESIGN_STYLE_OPTIONS.find((option) => option.id === designStyle) ?? DESIGN_STYLE_OPTIONS[0]
    ), [designStyle])

    const hasActiveErrors = design === null || Object.values(errors).some((value) => Boolean(value))

    const handleGenerateMonster = (): void => {
        const nextDesign = generateMonsterDesign({seed: formState.name, style: designStyle})
        setDesign(nextDesign)
        setPreviewState(DEFAULT_MONSTER_STATE)
        setErrors((previous) => ({...previous, design: undefined}))
    }

    const handleDesignStyleChange = (style: MonsterDesignStyle): void => {
        setDesignStyle(style)
        setPreviewState(DEFAULT_MONSTER_STATE)
        setDesign((previous) => (previous !== null && previous.style === style ? previous : null))
        setErrors((previous) => ({...previous, design: undefined}))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()

        const validationResult = validateCreateMonsterForm(formState, design)

        if (Object.keys(validationResult.errors).length > 0 || validationResult.values === undefined) {
            setErrors(validationResult.errors)
            return
        }

        onSubmit(validationResult.values)
        setFormState(createInitialFormState())
        setDesign(null)
        setPreviewState(DEFAULT_MONSTER_STATE)
        setDesignStyle('illustrated')
        setErrors({})
    }

    const handleCancel = (): void => {
        setFormState(createInitialFormState())
        setDesign(null)
        setPreviewState(DEFAULT_MONSTER_STATE)
        setDesignStyle('illustrated')
        setErrors({})
        onCancel()
    }

    return (
        <form className='space-y-6' onSubmit={handleSubmit}>
            <InputField
                label='Nom'
                name='name'
                value={formState.name}
                onChangeText={(value: string) => {
                    setFormState((previous) => ({...previous, name: value}))
                    if (errors.name !== undefined) {
                        setErrors((previous) => ({...previous, name: undefined}))
                    }
                }}
                error={errors.name}
            />

            <section className='space-y-4 rounded-3xl border border-moccaccino-100 bg-white/60 p-4 shadow-inner'>
                <div className='flex items-center justify-between gap-3'>
                    <h3 className='text-lg font-semibold text-gray-800'>Votre créature</h3>
                    <Button onClick={handleGenerateMonster} type='button' variant='outline'>
                        Générer mon monstre
                    </Button>
                </div>

                <div className='flex flex-col items-center gap-2'>
                    <div className='flex flex-wrap justify-center gap-2'>
                        {DESIGN_STYLE_OPTIONS.map((option) => (
                            <Button
                                key={option.id}
                                type='button'
                                size='sm'
                                variant={designStyle === option.id ? 'primary' : 'ghost'}
                                onClick={() => handleDesignStyleChange(option.id)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                    <p className='text-xs text-gray-500'>{selectedStyleOption.helper}</p>
                </div>

                <MonsterPreview design={design} state={previewState}/>

                {design !== null && (
                    <div className='space-y-1 text-center'>
                        <p className='text-sm text-gray-600'>
                            {VARIANT_LABELS[design.variant]} · {featureSummary}
                        </p>
                        <p className='text-xs text-gray-500'>{DESIGN_STYLE_LABELS[design.style]}</p>
                    </div>
                )}

                <div className='flex flex-wrap items-center justify-center gap-2'>
                    {MONSTER_STATES.map((state) => (
                        <Button
                            key={state}
                            type='button'
                            size='sm'
                            variant={state === previewState ? 'primary' : 'ghost'}
                            onClick={() => setPreviewState(state)}
                        >
                            {MONSTER_STATE_LABELS[state]}
                        </Button>
                    ))}
                </div>

                {errors.design !== undefined && (
                    <span className='text-sm text-red-500'>
            {errors.design}
          </span>
                )}
            </section>

            <div className='flex justify-end gap-3'>
                <Button onClick={handleCancel} type='button' variant='ghost'>
                    Annuler
                </Button>
                <Button disabled={hasActiveErrors} type='submit'>
                    Créer
                </Button>
            </div>
        </form>
    )
}

export default CreateMonsterForm
