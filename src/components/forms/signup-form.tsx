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
    </div>
  )
}

export default SignUpForm
