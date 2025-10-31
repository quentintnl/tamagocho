'use client'

import { redirectToDashboard } from '@/actions/navigation.actions'
import { useEffect } from 'react'
import { showErrorToast } from '@/lib/toast'

function ErrorClient (
  {
    error
  }:
  {
    error: Error | null | string
  }): React.ReactNode {
  useEffect(() => {
    showErrorToast(
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue'
    )
    void redirectToDashboard()
  }, [error])

  return (
    <div />
  )
}

export default ErrorClient
