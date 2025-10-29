/**
 * Success Modal Component
 *
 * Presentation Layer: Modal de confirmation de paiement avec confettis
 *
 * Responsibilities:
 * - Afficher un modal de succès après un paiement
 * - Lancer des confettis pour célébrer
 * - Permettre de fermer le modal
 *
 * Single Responsibility: Interface de confirmation de paiement réussi
 */

'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import Button from '@/components/button'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

/**
 * Lance des confettis colorés
 */
const launchConfetti = (): void => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 }
  }

  function fire (particleRatio: number, opts: confetti.Options): void {
    void confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55
  })

  fire(0.2, {
    spread: 60
  })

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 45
  })
}

/**
 * Modal de succès avec confettis
 */
export default function SuccessModal ({
  isOpen,
  onClose,
  title = 'Paiement réussi !',
  message = 'Vos coins seront ajoutés dans quelques instants.'
}: SuccessModalProps): React.ReactNode {
  useEffect(() => {
    if (isOpen) {
      // Lance les confettis quand le modal s'ouvre
      launchConfetti()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Overlay sombre */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-[scale-in_0.3s_ease-out]'>
        {/* Icône de succès */}
        <div className='flex justify-center mb-6'>
          <div className='relative'>
            <div className='w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-[bounce_0.6s_ease-in-out]'>
              <span className='text-5xl'>✅</span>
            </div>
            {/* Cercle animé en arrière-plan */}
            <div className='absolute inset-0 bg-green-400 rounded-full animate-[ping_1s_ease-out]' />
          </div>
        </div>

        {/* Titre */}
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-4'>
          {title}
        </h2>

        {/* Message */}
        <p className='text-center text-gray-600 mb-8'>
          {message}
        </p>

        {/* Bouton de fermeture */}
        <div className='w-full flex justify-center'>
          <Button
            variant='primary'
            size='lg'
            onClick={onClose}
          >
            Super ! 🎉
          </Button>
        </div>
      </div>
    </div>
  )
}

