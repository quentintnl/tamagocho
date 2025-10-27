'use client'

import { useEffect, useState } from 'react'
import Button from '../button'
import InputField from '../input'
import { PixelMonster } from '../monsters'
import {
  createInitialFormState,
  validateCreateMonsterForm,
  type CreateMonsterFormDraft,
  type CreateMonsterFormErrors
} from './create-monster-form.validation'
import { generateRandomTraits } from '../../services/monsters/monster-generator'
import {
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterTraits,
  type MonsterState
} from '@/types/monster'
import type { CreateMonsterFormProps } from '@/types/forms/create-monster-form'

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux 😊',
  sad: 'Triste 😢',
  angry: 'Fâché 😡',
  hungry: 'Affamé 😋',
  sleepy: 'Somnolent 😴'
}

function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formState, setFormState] = useState<CreateMonsterFormDraft>(() => createInitialFormState())
  const [errors, setErrors] = useState<CreateMonsterFormErrors>({})
  const [traits, setTraits] = useState<MonsterTraits | null>(null)
  const [previewState, setPreviewState] = useState<MonsterState>(DEFAULT_MONSTER_STATE)

  useEffect(() => {
    if (traits === null) {
      setTraits(generateRandomTraits())
    }
  }, [traits])

  const hasActiveErrors = traits === null || Object.values(errors).some((value) => Boolean(value))

  const handleGenerateMonster = (): void => {
    const nextTraits = generateRandomTraits()
    setTraits(nextTraits)
    setPreviewState(DEFAULT_MONSTER_STATE)
    setErrors((previous) => ({ ...previous, design: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const validationResult = validateCreateMonsterForm(formState, traits)

    if (Object.keys(validationResult.errors).length > 0 || validationResult.values === undefined) {
      setErrors(validationResult.errors)
      return
    }

    onSubmit(validationResult.values)
    setFormState(createInitialFormState())
    setTraits(null)
    setPreviewState(DEFAULT_MONSTER_STATE)
    setErrors({})
  }

  const handleCancel = (): void => {
    setFormState(createInitialFormState())
    setTraits(null)
    setPreviewState(DEFAULT_MONSTER_STATE)
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
          setFormState((previous) => ({ ...previous, name: value }))
          if (errors.name !== undefined) {
            setErrors((previous) => ({ ...previous, name: undefined }))
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

        <div className='flex items-center justify-center rounded-3xl bg-slate-50/70 p-4'>
          {traits !== null && (
            <PixelMonster traits={traits} state={previewState} level={1} />
          )}
        </div>

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
