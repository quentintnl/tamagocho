import type { MonsterState } from '@/types/monster'

export interface CreateMonsterFormValues {
  name: string
  draw: string
  level: number
  state: MonsterState
}

export interface CreateMonsterFormProps {
  onSubmit: (values: CreateMonsterFormValues) => void
  onCancel: () => void
}
