import type { MonsterState } from '@/types/monster'

export interface CreateMonsterFormValues {
  name: string
  traits: string
  state: MonsterState
}

export interface CreateMonsterFormProps {
  onSubmit: (values: CreateMonsterFormValues) => void
  onCancel: () => void
}
