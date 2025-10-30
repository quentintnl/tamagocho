/**
 * Middleware Next.js - Gestion basique des redirections
 *
 * IMPORTANT: Ce middleware s'exécute dans l'Edge Runtime et ne peut pas
 * utiliser Better Auth ou MongoDB directement (pas de module crypto Node.js).
 *
 * Les vérifications d'authentification sont déléguées aux Server Components
 * des pages elles-mêmes.
 *
 * Ce middleware gère uniquement:
 * - Les redirections simples basées sur les cookies de session Better Auth
 *
 * @module middleware
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Routes publiques accessibles uniquement si NON connecté
 */
const AUTH_ROUTES = ['/sign-in']

/**
 * Middleware Next.js simplifié
 *
 * @param {NextRequest} request - Requête Next.js entrante
 * @returns {NextResponse} Réponse avec redirection si nécessaire
 */
export function middleware (request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Vérification basique de la présence d'un cookie de session Better Auth
  const sessionCookie = request.cookies.get('better-auth.session_token')
  const isAuthenticated = sessionCookie !== undefined

  // Route spéciale: Page d'accueil "/"
  if (pathname === '/') {
    if (isAuthenticated) {
      // Utilisateur connecté → Redirection vers dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Utilisateur non connecté → Reste sur la landing page
    return NextResponse.next()
  }

  // Routes publiques (sign-in) : redirection si déjà connecté
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    // Déjà connecté → Redirection vers dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Pas de redirection nécessaire
  // Note: Les routes protégées sont gérées par les Server Components
  return NextResponse.next()
}

/**
 * Configuration du matcher pour optimiser les performances
 */
export const config = {
  matcher: [
    /*
     * Match uniquement les routes critiques pour les redirections
     */
    '/',
    '/sign-in'
  ]
}

