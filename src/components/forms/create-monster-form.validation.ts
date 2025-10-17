import { DEFAULT_MONSTER_LEVEL, DEFAULT_MONSTER_STATE, type MonsterDesign } from '@/types/monster'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { serializeMonsterDesign } from '../../services/monsters/monster-generator'

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
  design: MonsterDesign | null
): CreateMonsterFormValidationResult => {
  const trimmedName = draft.name.trim()

  const errors: CreateMonsterFormErrors = {}

  if (trimmedName.length === 0) errors.name = 'Le nom est requis.'
  if (design == null) errors.design = 'Générez votre créature avant de poursuivre.'

  if (Object.keys(errors).length > 0 || design == null) {
    return { errors }
  }

  return {
    errors: {},
    values: {
      name: trimmedName,
      draw: serializeMonsterDesign(design),
      level: DEFAULT_MONSTER_LEVEL,
      state: DEFAULT_MONSTER_STATE
    }
  }
}
