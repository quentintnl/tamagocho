'use client'

import Image from 'next/image'
import Button from '@/components/button'
import type { NavigationItem } from '@/types/components'

// Single Responsibility: Header handles only navigation and branding
export default function Header (): React.ReactNode {
  const navigationItems: NavigationItem[] = [
    { href: '#hero', label: 'Accueil' },
    { href: '#benefits', label: 'Avantages' },
    { href: '#monsters', label: 'Créatures' },
    { href: '#actions', label: 'Actions' },
    { href: '#newsletter', label: 'Newsletter' }
  ]

  const handleSignin = (): void => {
    window.location.href = '/sign-in'
  }

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <div className='flex items-center space-x-2'>
              <Image
                src='/logo_comp.webp'
                alt='Tamagotcho Logo'
                width={40}
                height={40}
                className='w-10 h-10'
                priority
              />
              <span className='text-2xl font-bold text-moccaccino-600'>
                Tamagotcho
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className='text-gray-700 hover:text-moccaccino-600 px-3 py-2 text-sm font-medium transition-colors'
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className='flex items-center'>
            <Button variant='primary' size='md' onClick={handleSignin}>
              Créer mon monstre
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
