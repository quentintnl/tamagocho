/**
 * CollapsibleSection Component
 *
 * Presentation Layer: Section repliable/dépliable générique
 *
 * Responsabilités:
 * - Gérer l'état ouvert/fermé d'une section
 * - Afficher un header cliquable avec icône
 * - Afficher/masquer le contenu selon l'état
 *
 * Single Responsibility Principle: Gestion de l'affichage repliable uniquement
 * Open/Closed Principle: Réutilisable pour différents contenus via children
 *
 * @module components/creature/collapsible-section
 */

'use client'

import { useState } from 'react'
import type React from 'react'

/**
 * Props pour le composant CollapsibleSection
 */
interface CollapsibleSectionProps {
  /** Titre de la section */
  title: string
  /** Sous-titre optionnel */
  subtitle?: string
  /** Icône du titre */
  icon?: string
  /** Contenu de la section */
  children: React.ReactNode
  /** État initial (ouvert par défaut) */
  defaultOpen?: boolean
  /** Classes CSS personnalisées */
  className?: string
}

/**
 * Composant de section repliable/dépliable
 *
 * Fournit une interface utilisateur pour afficher/masquer du contenu
 * de manière interactive. Réutilisable pour différentes sections.
 *
 * @param {CollapsibleSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section avec header cliquable et contenu conditionnel
 *
 * @example
 * <CollapsibleSection
 *   title="Mes Accessoires"
 *   subtitle="5 accessoires possédés"
 *   icon="👜"
 *   defaultOpen={true}
 * >
 *   <p>Contenu de la section</p>
 * </CollapsibleSection>
 */
export function CollapsibleSection ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = true,
  className = ''
}: CollapsibleSectionProps): React.ReactNode {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  /**
   * Bascule l'état ouvert/fermé de la section
   */
  const toggleOpen = (): void => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-fuchsia-blue-200 ${className}`}>
      {/* Header cliquable */}
      <button
        onClick={toggleOpen}
        className='w-full flex items-center justify-between mb-4 transition-opacity hover:opacity-80'
        aria-expanded={isOpen}
        aria-controls='collapsible-content'
      >
        <div>
          <h2 className='text-2xl font-bold text-foreground flex items-center gap-2'>
            {icon !== null && icon !== undefined && <span aria-hidden='true'>{icon}</span>}
            {title}
          </h2>
          {subtitle !== null && subtitle !== undefined && (
            <p className='text-sm text-foreground/70 text-left'>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className='text-2xl transition-transform duration-300'
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden='true'
        >
          ▼
        </div>
      </button>

      {/* Contenu dépliable */}
      {isOpen && (
        <div id='collapsible-content' className='mt-4'>
          {children}
        </div>
      )}
    </div>
  )
}

