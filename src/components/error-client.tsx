'use client'

import { redirectToDashboard } from '@/actions/navigation.actions'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

function ErrorClient (
  {
    error
  }:
  {
    error: Error | null | string
  }): React.ReactNode {
  useEffect(() => {
    toast.error(
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'An unexpected error occurred'
    )
    void redirectToDashboard()
  }, [error])

  return (
    <div />
  )
}

export default ErrorClient
