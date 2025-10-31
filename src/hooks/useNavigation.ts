/**
 * Navigation Hooks
 *
 * Presentation Layer: Custom hooks for navigation logic
 *
 * Single Responsibility Principle:
 * - Separate navigation logic from UI components
 * - Extract page title determination
 * - Extract route matching logic
 */

'use client'

import { usePathname } from 'next/navigation'

/**
 * Page title configuration
 * Open/Closed Principle: Add new pages here without modifying getPageTitle logic
 */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/monsters': 'Mes Créatures',
  '/shop': 'Boutique',
  '/wallet': 'Mon Wallet',
  '/gallery': 'Galerie Communautaire',
  '/quests': 'Quêtes du Jour'
}

/**
 * Get page title based on current pathname
 *
 * @param pathname - Current route pathname
 * @returns Page title string
 */
export function getPageTitle (pathname: string | null): string {
  if (pathname === null) return 'Tamagotcho'

  // Check exact matches first
  if (pathname in PAGE_TITLES) {
    return PAGE_TITLES[pathname]
  }

  // Check dynamic routes
  if (pathname.startsWith('/creature/')) {
    return 'Ma Créature'
  }

  // Default fallback
  return 'Tamagotcho'
}

/**
 * Hook to get current page title
 *
 * @returns Current page title
 */
export function usePageTitle (): string {
  const pathname = usePathname()
  return getPageTitle(pathname)
}

/**
 * Hook to check if a route is active
 *
 * @returns Function to check if a path is active
 */
export function useActiveRoute (): (path: string) => boolean {
  const pathname = usePathname()

  return (path: string): boolean => {
    return pathname === path
  }
}

