/**
 * Authentication Service Interface & Implementation
 *
 * Application Layer: User authentication abstraction
 *
 * Dependency Inversion Principle:
 * - Actions depend on IAuthService abstraction
 * - This file provides Better Auth implementation
 * - Allows easy mocking for tests
 * - Enables switching auth providers without changing actions
 *
 * Single Responsibility:
 * - Only handles user session retrieval
 */

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Authenticated user data
 */
export interface AuthenticatedUser {
  id: string
  email: string
  name: string
}

/**
 * Authentication Service Interface
 * Abstraction for authentication operations
 */
export interface IAuthService {
  /**
   * Get current authenticated user session
   * @returns User data or null if not authenticated
   */
  getCurrentUser: () => Promise<AuthenticatedUser | null>
}

/**
 * Better Auth implementation of Authentication Service
 * Implements IAuthService using Better Auth
 */
export class BetterAuthService implements IAuthService {
  /**
   * Get current authenticated user from session
   */
  async getCurrentUser (): Promise<AuthenticatedUser | null> {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return null
    }

    const { user } = session

    return {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }
}

/**
 * Default auth service instance
 * Can be replaced with mock for testing
 */
export const authService: IAuthService = new BetterAuthService()
