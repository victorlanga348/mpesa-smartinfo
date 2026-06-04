import { User } from '../types'

const STORAGE_KEY = 'smartinfo_user'
const STORAGE_USERS_KEY = 'smartinfo_users'

// Simple in-memory user storage (swappable with backend)
const users: Map<string, User> = new Map()

export const authService = {
  // Register a new user
  async register(name: string, phone: string, role: 'customer' | 'agent' | 'admin', neighborhood?: string): Promise<User> {
    const existingUser = Array.from(users.values()).find((u) => u.phone === phone)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      role,
      neighborhood,
      createdAt: new Date(),
    }

    users.set(user.id, user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(Array.from(users.values())))

    return user
  },

  // Login user
  async login(phone: string): Promise<User> {
    let user = Array.from(users.values()).find((u) => u.phone === phone)

    if (!user) {
      // For demo, create user if doesn't exist
      user = await this.register('Demo User', phone, 'customer')
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
  },

  // Get current user
  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  },

  // Logout
  logout(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser()
  },

  // Initialize mock users from storage
  initializeFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_USERS_KEY)
    if (stored) {
      try {
        const usersList = JSON.parse(stored)
        usersList.forEach((u: User) => users.set(u.id, u))
      } catch (e) {
        console.error('Failed to load users from storage', e)
      }
    }
  },
}

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
  authService.initializeFromStorage()
}
