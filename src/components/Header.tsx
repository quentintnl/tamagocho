'use client'

import React from 'react'
import Button from '@/components/button'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

const Header: React.FC = () => {
    const router = useRouter()

    const handleCreateMonster = () => {
        router.push('/sign-in')
    }

    return (
        <header
            className='fixed w-full bg-gradient-to-r from-fuchsia-blue-100 via-lochinvar-50 to-fuchsia-blue-100 backdrop-blur-sm z-50 border-b border-fuchsia-blue-200'
        >
            <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
                <div className='flex items-center'>
                    <Link
                        href='/'
                        className='text-2xl font-bold bg-gradient-to-r from-lochinvar-600 to-fuchsia-blue-600 bg-clip-text text-transparent hover:from-fuchsia-blue-600 hover:to-lochinvar-600 transition-all duration-300'
                    >
                        Tamagocho
                    </Link>
                </div>

                <nav className='hidden md:flex items-center gap-8'>
                    {[
                        {href: '#avantages', label: 'Avantages', color: 'from-lochinvar-600 to-lochinvar-500'},
                        {href: '#monstres', label: 'Nos Monstres', color: 'from-fuchsia-blue-600 to-fuchsia-blue-500'},
                        {href: '#actions', label: 'Interactions', color: 'from-moccaccino-500 to-moccaccino-400'},
                        {href: '#newsletter', label: 'Newsletter', color: 'from-fuchsia-blue-500 to-lochinvar-500'}
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-transparent bg-gradient-to-r ${item.color} bg-clip-text hover:scale-105 transition-transform`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className='flex items-center gap-4'>
                    <Button
                        variant='primary'
                        size='md'
                        className='bg-gradient-to-r from-fuchsia-blue-500 to-lochinvar-500 hover:from-lochinvar-500 hover:to-fuchsia-blue-500 transition-all duration-300 animate-pulse'
                        onClick={handleCreateMonster}
                    >
                        Créer mon monstre
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header
