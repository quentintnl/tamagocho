export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'neutral'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export interface Monster {
    id?: string
    name: string
    level: number
    draw: string
    state: MonsterState
    ownerId: string
}

export interface CreateMonsterFormValues {
    name: string
    draw: string
    state: MonsterState
}

export interface MonsterFormState {
    name: string
    draw: string
    state: MonsterState
    showPreview: boolean
}

export type MonsterFormErrors = Partial<Record<keyof Omit<MonsterFormState, 'showPreview' | 'state'>, string>>
