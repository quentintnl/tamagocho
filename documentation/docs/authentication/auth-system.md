---
sidebar_position: 1
---

# Système d'Authentification

Documentation complète du système d'authentification basé sur **Better Auth** dans Tamagotcho.

## Vue d'ensemble

Tamagotcho utilise **Better Auth 1.3.24**, une solution d'authentification moderne et sécurisée pour Next.js, avec support de :
- ✅ Email/Password (connexion classique)
- ✅ GitHub OAuth (connexion sociale)
- ✅ MongoDB comme base de données
- ✅ Sessions sécurisées
- ✅ Protection des routes

## Architecture

```
┌─────────────────────────────────────────┐
│        Client (Browser)                 │
│  - auth-client.ts (Better Auth Client)  │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
┌──────────────┴──────────────────────────┐
│        Server (Next.js API)             │
│  - auth.ts (Better Auth Server)         │
│  - API Route: /api/auth/[...all]        │
└──────────────┬──────────────────────────┘
               │ Adapter
┌──────────────┴──────────────────────────┐
│        Database (MongoDB)               │
│  - users collection                     │
│  - sessions collection                  │
│  - accounts collection                  │
└─────────────────────────────────────────┘
```

## Configuration Server-Side

### Fichier: src/lib/auth.ts

Configuration de Better Auth côté serveur.

```typescript
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/db'

export const auth = betterAuth({
  database: mongodbAdapter(
    client.db(process.env.MONGODB_DATABASE_NAME as string)
  ),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  }
})
```

### Options de configuration

| Option | Description | Valeur |
|--------|-------------|--------|
| `database` | Adapter MongoDB | `mongodbAdapter(client.db(...))` |
| `emailAndPassword.enabled` | Activer email/password | `true` |
| `socialProviders.github.enabled` | Activer GitHub OAuth | `true` |
| `socialProviders.github.clientId` | ID client GitHub | Depuis `.env` |
| `socialProviders.github.clientSecret` | Secret client GitHub | Depuis `.env` |

## Configuration Client-Side

### Fichier: src/lib/auth-client.ts

Client d'authentification pour le navigateur.

```typescript
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL
})

export const {
  signIn,
  signUp,
  signOut,
  useSession
} = authClient
```

### Hooks et fonctions disponibles

| Fonction/Hook | Type | Description |
|---------------|------|-------------|
| `signIn()` | Function | Connexion utilisateur |
| `signUp()` | Function | Inscription utilisateur |
| `signOut()` | Function | Déconnexion |
| `useSession()` | Hook | Récupère la session active |

## Variables d'environnement

### Fichier: .env.local

```bash
# MongoDB
MONGODB_URI="mongodb+srv://..."
MONGODB_DATABASE_NAME="tamagotcho"

# Better Auth
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

### Configuration GitHub OAuth

1. **Créer une OAuth App sur GitHub**
   - Aller sur [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
   - Cliquer sur "New OAuth App"

2. **Remplir les informations**
   - **Application name**: Tamagotcho
   - **Homepage URL**: `http://localhost:3000` (dev) ou votre URL de production
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

3. **Récupérer les credentials**
   - Copier le **Client ID**
   - Générer et copier le **Client Secret**
   - Ajouter dans `.env.local`

## Route API d'authentification

### Fichier: src/app/api/auth/[...all]/route.ts

Route catch-all pour gérer toutes les requêtes d'authentification.

```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

:::info Routes générées automatiquement
Better Auth génère automatiquement les routes suivantes :
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-up`
- `POST /api/auth/sign-out`
- `GET /api/auth/callback/github`
- `GET /api/auth/session`
:::

## Composants de formulaires

### SignInForm

Formulaire de connexion avec email/password.

```typescript
'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth-client'
import { Button, Input } from '@/components'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn.email({
        email,
        password,
        callbackURL: '/dashboard'
      })
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  )
}
```

### SignUpForm

Formulaire d'inscription.

```typescript
'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth-client'
import { Button, Input } from '@/components'

export function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp.email({
        name,
        email,
        password,
        callbackURL: '/dashboard'
      })
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </Button>
    </form>
  )
}
```

### GitHub OAuth Button

Bouton de connexion via GitHub.

```typescript
'use client'

import { signIn } from '@/lib/auth-client'
import { Button } from '@/components'

export function GitHubSignInButton() {
  const handleGitHubSignIn = async () => {
    await signIn.social({
      provider: 'github',
      callbackURL: '/dashboard'
    })
  }

  return (
    <Button onClick={handleGitHubSignIn} variant="outline">
      <GitHubIcon /> Continuer avec GitHub
    </Button>
  )
}
```

## Protection des routes

### Server-Side (Server Components)

```typescript
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div>
      <h1>Bienvenue {session.user.name}</h1>
      {/* Contenu protégé */}
    </div>
  )
}
```

### Client-Side (Client Components)

```typescript
'use client'

import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedComponent() {
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      redirect('/sign-in')
    }
  }, [session, isPending])

  if (isPending) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      <p>Contenu protégé pour {session.user.name}</p>
    </div>
  )
}
```

## Hook useSession

### Utilisation basique

```typescript
'use client'

import { useSession } from '@/lib/auth-client'

export function UserProfile() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div>Chargement...</div>
  }

  if (!session) {
    return <div>Non connecté</div>
  }

  return (
    <div>
      <img src={session.user.image} alt={session.user.name} />
      <h2>{session.user.name}</h2>
      <p>{session.user.email}</p>
    </div>
  )
}
```

### Structure de l'objet session

```typescript
interface Session {
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
  expiresAt: Date
}
```

## Server Actions avec authentification

```typescript
'use server'

import { auth } from '@/lib/auth'
import { MonsterModel } from '@/db/models/monster.model'

export async function createMonster(name: string) {
  // Vérification de l'authentification
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Non authentifié')
  }

  // Action protégée
  const monster = await MonsterModel.create({
    name,
    ownerId: session.user.id,
    // ...
  })

  return monster
}
```

## Déconnexion

### Bouton de déconnexion

```typescript
'use client'

import { signOut } from '@/lib/auth-client'
import { Button } from '@/components'

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({
      callbackURL: '/'
    })
  }

  return (
    <Button onClick={handleSignOut} variant="ghost">
      Se déconnecter
    </Button>
  )
}
```

## Collections MongoDB

Better Auth crée automatiquement les collections suivantes :

### users

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "emailVerified": false,
  "image": "https://...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### sessions

```json
{
  "_id": "ObjectId",
  "userId": "user_id",
  "expiresAt": "2024-02-01T00:00:00.000Z",
  "token": "session_token",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### accounts

```json
{
  "_id": "ObjectId",
  "userId": "user_id",
  "providerId": "github",
  "providerUserId": "github_user_id",
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Sécurité

### Meilleures pratiques

- ✅ **Jamais de secrets côté client** : `GITHUB_CLIENT_SECRET` uniquement dans `.env.local`
- ✅ **HTTPS en production** : Toujours utiliser HTTPS pour les requêtes d'auth
- ✅ **Validation serveur** : Toujours vérifier la session côté serveur
- ✅ **Expiration de session** : Sessions expirées automatiquement
- ✅ **Protection CSRF** : Gérée automatiquement par Better Auth

### Variables à ne JAMAIS exposer

```bash
# ❌ NE JAMAIS préfixer avec NEXT_PUBLIC_
GITHUB_CLIENT_SECRET="secret"
MONGODB_URI="mongodb+srv://..."

# ✅ OK pour le client
NEXT_PUBLIC_APP_URL="https://..."
```

## Validation des formulaires

### Avec Zod (recommandé)

```typescript
import { z } from 'zod'

const signUpSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

export function SignUpForm() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validation
    const result = signUpSchema.safeParse({ name, email, password })
    
    if (!result.success) {
      console.error(result.error.errors)
      return
    }
    
    // Inscription
    await signUp.email(result.data)
  }
}
```

## Gestion des erreurs

```typescript
'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth-client'

export function SignInForm() {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await signIn.email({ email, password })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Une erreur est survenue')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Champs de formulaire */}
    </form>
  )
}
```

## Tests recommandés

```typescript
describe('Authentication', () => {
  it('devrait connecter un utilisateur valide', async () => {
    const result = await signIn.email({
      email: 'test@example.com',
      password: 'password123'
    })
    
    expect(result.user).toBeDefined()
    expect(result.user.email).toBe('test@example.com')
  })

  it('devrait rejeter un mot de passe invalide', async () => {
    await expect(
      signIn.email({
        email: 'test@example.com',
        password: 'wrong'
      })
    ).rejects.toThrow()
  })
})
```

## Ressources

- [Better Auth Documentation](https://www.better-auth.com)
- [GitHub OAuth Apps](https://github.com/settings/developers)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [MongoDB Adapter](https://www.better-auth.com/docs/adapters/mongodb)
