'use client'

import React, {useState} from 'react'
import InputField from '@/components/input'
import Button from '@/components/button'
import {authClient} from '@/lib/auth-client'
import {useRouter} from 'next/navigation'

interface Credentials {
    email: string
    password: string
}

function SignInForm(): React.ReactNode {
    const router = useRouter()
    const [credentials, setCredentials] = useState<Credentials>({
        email: 'toctocCmoi@ui.fr',
        password: 'LAsecuriteESTla'
    })
    const [error, setError] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setError('')
        console.log('Form submitted with credentials:', credentials)

        await authClient.signIn.email({
            email: credentials.email,
            password: credentials.password,
            callbackURL: '/dashboard'
        }, {
            onRequest: () => {
                console.log('Connexion en cours...')
            },
            onSuccess: () => {
                console.log('Connexion réussie !')
                router.push('/dashboard')
            },
            onError: (ctx) => {
                console.error('Erreur de connexion', ctx)
                setError(ctx.error.message)
            }
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const {name, value} = e.target
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className='space-y-6 w-full max-w-sm mx-auto'>
            {error && (
                <div
                    className='p-4 rounded-xl bg-moccaccino-100/80 backdrop-blur-sm border-2 border-moccaccino-500 text-moccaccino-700 animate-shake'
                >
                    <p className='text-sm font-medium'>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
                <InputField
                    label='Email'
                    type='email'
                    name='email'
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder='votre@email.com'
                />
                <InputField
                    label='Mot de passe'
                    type='password'
                    name='password'
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder='••••••••'
                />
                <div className='pt-2'>
                    <Button
                        type='submit'
                        variant='primary'
                        className='w-full bg-gradient-to-r from-fuchsia-blue-500 to-lochinvar-500 hover:from-lochinvar-500 hover:to-fuchsia-blue-500 text-white font-semibold py-3 px-4 rounded-xl transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg'
                    >
                        Se connecter
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SignInForm
