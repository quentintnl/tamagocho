'use client'

import Button from '../button'
import CreateMonsterForm from '../forms/create-monster-form'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'

interface CreateMonsterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateMonsterFormValues) => void
}

function CreateMonsterModal ({ isOpen, onClose, onSubmit }: CreateMonsterModalProps): React.ReactNode {
  if (!isOpen) return null

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) onClose()
  }

  const handleSubmit = (values: CreateMonsterFormValues): void => {
    onSubmit(values)
    onClose()
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='create-monster-title'
    >
      <div className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-moccaccino-100'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <h2 className='text-2xl font-bold text-gray-900' id='create-monster-title'>
            Créer une nouvelle créature
          </h2>
          <Button onClick={onClose} size='sm' type='button' variant='ghost'>
            Fermer
          </Button>
        </div>
        <CreateMonsterForm onCancel={onClose} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export type { CreateMonsterFormValues }
export default CreateMonsterModal
