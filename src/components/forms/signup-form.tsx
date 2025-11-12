import { useState } from 'react'
import InputField from '../input'
import Button from '../button'
import { authClient } from '@/lib/auth-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

interface Credentials {
  email: string
  password: string
  name: string
}

function SignUpForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      callbackURL: '/dashboard'
    }, {
      onRequest: (ctx) => {
        console.log('Signing up...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed up:', ctx)
        setIsLoading(false)
        showSuccessToast('Compte créé avec succès ! Bienvenue ! 🎉')
        onError('') // Clear error on success
      },
      onError: (ctx) => {
        console.error('Sign up error:', ctx)
        const errorMsg = ctx.error.message
        onError(errorMsg)
        showErrorToast(errorMsg)
        onError(ctx.error.message)
      }
    })
  }

  const handleGitHubSignIn = (): void => {
    void authClient.signIn.social({
      provider: 'github',
      callbackURL: '/dashboard'
    })
  }

  const handleGoogleSignIn = (): void => {
    void authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard'
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          🆕 Créer un compte
        </h2>
        <p className='text-gray-600 text-sm'>
          Rejoignez l'aventure Tomatgotchi ! 🎆
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-4' onSubmit={handleSubmit}>
        <InputField
          label="Nom d'utilisateur"
          type='text'
          name='name'
          value={credentials.name}
          onChangeText={(text: string) => setCredentials({ ...credentials, name: text })}
        />
        <InputField
          label='Email'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        />
        <Button
          type='submit'
          size='lg'
          disabled={isLoading}
          variant='primary'
        >
          {isLoading ? '🔄 Création...' : '🎆 Créer mon compte'}
        </Button>
      </form>

      {/* Divider */}
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-4 bg-white/80 text-gray-500'>Ou continuer avec</span>
        </div>
      </div>

      {/* GitHub Sign In Button */}
      <div className='flex flex-col gap-3'>
        <Button
          type='button'
          size='lg'
          variant='outline'
          onClick={handleGitHubSignIn}
          disabled={isLoading}
        >
          <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
            <path fillRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' clipRule='evenodd' />
          </svg>
          Continuer avec GitHub
        </Button>

        {/* Google Sign In Button */}
        <Button
          type='button'
          size='lg'
          variant='outline'
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24' aria-hidden='true'>
            <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
            <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
            <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
            <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
          </svg>
          Continuer avec Google
        </Button>
      </div>
    </div>
  )
}

export default SignUpForm
