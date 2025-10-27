import AuthFormContent from '@/components/forms/auth-form-content'
import { connectToDatabase } from '@/db'

async function SignInPage (): Promise<React.ReactNode> {
  await connectToDatabase()
  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-fuchsia-blue-50 to-lochinvar-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Animated floating monsters */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-20 left-10 text-6xl animate-bounce'>🥺</div>
        <div className='absolute top-32 right-20 text-5xl animate-pulse'>👾</div>
        <div className='absolute bottom-40 left-20 text-4xl animate-bounce' style={{ animationDelay: '1s' }}>🧸</div>
        <div className='absolute bottom-20 right-10 text-5xl animate-pulse' style={{ animationDelay: '2s' }}>🦄</div>
        <div className='absolute top-1/2 left-5 text-3xl animate-bounce' style={{ animationDelay: '0.5s' }}>🎀</div>
        <div className='absolute top-1/3 right-5 text-4xl animate-pulse' style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Main card container */}
      <div className='w-full max-w-md relative z-10'>
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden'>
          {/* Decorative gradient overlay */}
          <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-moccaccino-400 via-fuchsia-blue-400 to-lochinvar-400' />

          {/* Welcome message */}
          <div className='text-center mb-8'>
            <div className='text-5xl mb-4'>🎮</div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-moccaccino-600 to-fuchsia-blue-600 bg-clip-text text-transparent'>
              Bienvenue chez Tamagotcho !
            </h1>
            <p className='text-gray-600 mt-2 text-sm'>
              Vos petits monstres vous attendent 👹✨
            </p>
          </div>

          <AuthFormContent />
        </div>

        {/* Fun quote below the card */}
        <div className='text-center mt-6 text-gray-600 text-sm'>
          <span className='italic'>"Un monstre par jour éloigne l'ennui pour toujours !"</span> 🎭
        </div>
      </div>
    </div>
  )
}

export default SignInPage
