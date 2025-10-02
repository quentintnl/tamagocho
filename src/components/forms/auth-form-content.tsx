'use client'

import SignUpForm from '@/components/forms/signup-form'
import {useState} from "react";
import SignInForm from "@/components/forms/signin-forms";
import Button from "@/components/button";
import Monster from "@/components/Monster";

function AuthFormContent(): React.ReactNode {
    const [isSignIn, setIsSignIn] = useState<boolean>(false)
    return (
        <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative'>
            {/* Fond avec gradient */}
            <div
                className='absolute inset-0 bg-gradient-to-br from-fuchsia-blue-100 via-lochinvar-50 to-moccaccino-100 opacity-70'>
                <div
                    className='absolute w-64 h-64 rounded-full bg-fuchsia-blue-200/30 -top-20 -left-20 blur-3xl animate-pulse'/>
                <div
                    className='absolute w-64 h-64 rounded-full bg-lochinvar-200/30 top-40 -right-20 blur-3xl animate-pulse delay-700'/>
            </div>

            {/* Petits monstres animés */}
            <div className="absolute w-full h-full overflow-hidden pointer-events-none">
                {/* Monstre qui vole en haut à gauche */}
                <div className="absolute -left-8 top-20 animate-float transform hover:scale-110 transition-transform">
                    <div className="relative transform -rotate-12">
                        <Monster name="Mochi" type="happy" level={1} className="w-16 h-16"/>
                        <div
                            className="absolute -top-6 right-0 bg-white rounded-lg px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>*fait coucou* 👋</span>
                        </div>
                    </div>
                </div>

                {/* Monstre qui dort en bas à droite */}
                <div
                    className="absolute right-10 bottom-20 animate-bounce-slow transform hover:scale-110 transition-transform">
                    <div className="relative transform rotate-6">
                        <Monster name="Sleepy" type="sleeping" level={2} className="w-20 h-20"/>
                        <div className="absolute -top-8 left-0 bg-white rounded-lg px-2 py-1 text-xs shadow-lg">
                            <span>💤 Zzz...</span>
                        </div>
                    </div>
                </div>

                {/* Monstre curieux qui regarde le formulaire */}
                <div
                    className="absolute right-1/4 top-1/4 animate-wiggle transform hover:scale-110 transition-transform">
                    <div className="relative transform -rotate-6">
                        <Monster name="Peekaboo" type="curious" level={3} className="w-16 h-16"/>
                        <div
                            className="absolute -top-6 left-0 bg-white rounded-lg px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>🤔 Humm...</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteneur principal centré */}
            <div className='w-full max-w-md mx-auto relative'>
                <div
                    className='bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-lochinvar-200'>
                    {/* En-tête centré avec message humoristique */}
                    <div className='text-center mb-8'>
                        <h2 className='text-3xl font-bold bg-gradient-to-r from-fuchsia-blue-600 to-lochinvar-600 bg-clip-text text-transparent'>
                            {isSignIn ? 'Connexion' : 'Créer un compte'}
                        </h2>
                        <p className='mt-2 text-lochinvar-600'>
                            {isSignIn
                                ? 'Content de vous revoir ! Les monstres vous ont attendu avec impatience 🎉'
                                : 'Des tas de petits monstres adorables n\'attendent que vous ! 🌟'}
                        </p>
                        <p className='text-sm text-lochinvar-500 mt-2 italic'>
                            {isSignIn
                                ? '(Ils ont même rangé leur chambre... ou presque 😅)'
                                : '(Promis, ils ne mangeront pas vos chaussettes... enfin, on espère 🧦)'}
                        </p>
                    </div>

                    {/* Conteneur du formulaire avec marge auto */}
                    <div className='max-w-sm mx-auto'>
                        {isSignIn ? <SignInForm/> : <SignUpForm/>}
                    </div>

                    {/* Bouton de switch centré */}
                    <div className='mt-6 text-center'>
                        <Button
                            type='button'
                            variant='ghost'
                            className='text-lochinvar-600 hover:text-fuchsia-blue-600 transition-colors group'
                            onClick={() => setIsSignIn(!isSignIn)}
                        >
                            {isSignIn
                                ? <>Pas encore de compte ? Créez-en un ! <span
                                    className="group-hover:animate-bounce inline-block">🐣</span></>
                                : <>Déjà un compte ? Connectez-vous ! <span
                                    className="group-hover:animate-wave inline-block">👋</span></>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthFormContent
