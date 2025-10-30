import Image from 'next/image'
import type { FooterLinkGroup } from '@/types/components'

// Single Responsibility: FooterLinkGroupComponent displays one group of links
function FooterLinkGroupComponent ({ title, links }: FooterLinkGroup): React.ReactNode {
  return (
    <div>
      <h3 className='text-lg font-semibold mb-4 text-meadow-200'>{title}</h3>
      <ul className='space-y-2 text-meadow-100/70'>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className='hover:text-meadow-200 transition-colors'>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Single Responsibility: Footer handles site footer information and navigation
export default function Footer (): React.ReactNode {
  const linkGroups: FooterLinkGroup[] = [
    {
      title: 'Liens utiles',
      links: [
        { label: 'Comment jouer', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Support', href: '#' },
        { label: 'Communauté', href: '#' }
      ]
    },
    {
      title: 'Légal',
      links: [
        { label: 'Conditions d\'utilisation', href: '#' },
        { label: 'Politique de confidentialité', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'CGV', href: '#' }
      ]
    }
  ]

  return (
    <footer className='bg-gradient-to-b from-forest-900 to-forest-950 text-white py-16 relative overflow-hidden'>
      {/* Nature decorative elements */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute bottom-0 left-0 text-9xl'>🌲</div>
        <div className='absolute bottom-0 right-0 text-9xl'>🌳</div>
        <div className='absolute top-10 left-1/3 text-6xl'>⭐</div>
        <div className='absolute top-5 right-1/4 text-5xl'>✨</div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid md:grid-cols-4 gap-8'>
          {/* Logo & Description */}
          <div className='col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <Image
                src='/logo_comp.webp'
                alt='Tamagotcho Logo'
                width={32}
                height={32}
                className='w-8 h-8'
              />
              <span className='text-2xl font-bold bg-gradient-to-r from-meadow-300 to-sky-300 bg-clip-text text-transparent'>
                Tamagotcho
              </span>
            </div>
            <p className='text-meadow-100/80 mb-6 max-w-md leading-relaxed'>
              L'expérience Tamagotchi nouvelle génération dans un univers zen et naturel. Adoptez, soignez et regardez grandir votre créature dans son petit paradis 🌿
            </p>
          </div>

          {/* Link Groups */}
          {linkGroups.map((group, index) => (
            <FooterLinkGroupComponent key={index} {...group} />
          ))}
        </div>

        <div className='border-t border-meadow-800/30 mt-12 pt-8 text-center text-meadow-100/70'>
          <p>&copy; 2025 Tamagotcho. Tous droits réservés. Créé avec 💚 pour My Digital School.</p>
        </div>
      </div>
    </footer>
  )
}
