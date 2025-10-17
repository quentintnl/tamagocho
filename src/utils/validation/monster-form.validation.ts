import {MonsterFormErrors, MonsterFormState} from '@/types/monster.types'

export const validateMonsterForm = (formState: MonsterFormState): MonsterFormErrors => {
    const errors: MonsterFormErrors = {}
    const trimmedName = formState.name.trim()

    if (trimmedName.length === 0) {
        errors.name = 'Le nom est requis.'
    } else if (trimmedName.length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères.'
    }

    return errors
}
