import React, { useState } from 'react'
import InputField from '@/components/input'
import Button from '@/components/button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignUpForm (): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'toctocCmoi@ui.fr',
    password: 'LAsecuriteESTla'
  })
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    console.log('Form submitted with credentials:', credentials)

    const { data, error } = await authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/sign-in',
      name: ''
    }, {
      onRequest: () => {
        console.log('Inscription en cours...')
      },
      onSuccess: () => {
        console.log('Inscription réussie !')
      },
      onError: (ctx) => {
        console.error('Erreur d\'inscription', ctx)
        setError(ctx.error.message)
      }
    })
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
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
          placeholder='votre@email.com'
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          placeholder='Choisissez un mot de passe sécurisé'
        />
        <div
          className='text-sm text-lochinvar-600 bg-lochinvar-50/80 backdrop-blur-sm p-4 rounded-xl border border-lochinvar-200'
        >
          <p className='flex items-center gap-2'>
            <span className='text-lg'>🔒</span>
            Conseil : Utilisez au moins 8 caractères avec des lettres et des chiffres
          </p>
        </div>
        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            className='w-full bg-gradient-to-r from-lochinvar-500 to-fuchsia-blue-500 hover:from-fuchsia-blue-500 hover:to-lochinvar-500 text-white font-semibold py-3 px-4 rounded-xl transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg'
          >
            Créer mon compte
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
