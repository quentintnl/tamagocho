import { DEFAULT_MONSTER_LEVEL, DEFAULT_MONSTER_STATE, type MonsterTraits } from '@/types/monster'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'

export interface CreateMonsterFormDraft {
  name: string
}

export type CreateMonsterFormErrors = Partial<Record<'name' | 'design', string>>

export interface CreateMonsterFormValidationResult {
  errors: CreateMonsterFormErrors
  values?: CreateMonsterFormValues
}

export const createInitialFormState = (): CreateMonsterFormDraft => ({
  name: ''
})

export const validateCreateMonsterForm = (
  draft: CreateMonsterFormDraft,
  traits: MonsterTraits | null
): CreateMonsterFormValidationResult => {
  const trimmedName = draft.name.trim()

  const errors: CreateMonsterFormErrors = {}

  if (trimmedName.length === 0) errors.name = 'Le nom est requis.'
  if (traits == null) errors.design = 'Générez votre créature avant de poursuivre.'

  if (Object.keys(errors).length > 0 || traits == null) {
    return { errors }
  }

  return {
    errors: {},
    values: {
      name: trimmedName,
      traits: JSON.stringify(traits),
      level: DEFAULT_MONSTER_LEVEL,
      state: DEFAULT_MONSTER_STATE
    }
  }
}
