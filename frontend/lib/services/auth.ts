import { getApiUrl } from '@/lib/socket'
import { User } from '@/lib/types'

const STORAGE_KEY = 'smartinfo_user'
const STORAGE_USERS_KEY = 'smartinfo_users'

const users: Map<string, User> = new Map()

type AuthSession = User & {
  token?: string
  type?: 'customer' | 'agent' | 'admin'
}

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || 'Nao foi possivel concluir a autenticacao.')
  }

  return data
}

function storeUser(user: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function storeUsers() {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(Array.from(users.values())))
}

export const authService = {
  async createLocalUser(name: string, phone: string, role: 'customer' | 'agent' | 'admin', neighborhood?: string): Promise<User> {
    const existingUser = Array.from(users.values()).find((user) => user.phone === phone)
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
    storeUser(user)
    storeUsers()

    return user
  },

  async loginLocal(phone: string): Promise<User> {
    let user = Array.from(users.values()).find((item) => item.phone === phone)

    if (!user) {
      user = await this.createLocalUser('Demo User', phone, 'customer')
    }

    storeUser(user)
    return user
  },

  async registerClient(name: string, phone?: string) {
    const data = await postJson('/user/register', { name, phone })

    if (data && typeof data === 'object' && 'token' in data && 'user' in data) {
      storeUser({ ...(data as { user: AuthSession; token: string }).user, token: (data as { token: string }).token, role: 'customer', type: 'customer' })
    }

    return data
  },

  async loginClient(name: string, code: string) {
    const data = await postJson('/user/login', { name, code })
    const { token, user } = data as { token: string; user: AuthSession }
    storeUser({ ...user, token, role: 'customer', type: 'customer' })
    return data
  },

  async loginAdmin(email: string, password: string) {
    const data = await postJson('/admin/login', { email, password })
    const { token, user } = data as { token: string; user: AuthSession }
    storeUser({ ...user, token, role: 'admin', type: 'admin' })
    return data
  },

  async loginAgent(name: string, code: string) {
    const data = await postJson('/agent/login', { name, code })
    const { token, agent } = data as { token: string; agent: AuthSession }
    storeUser({ ...agent, token, role: 'agent', type: 'agent' })
    return data
  },

  async registerAgent(name: string, phone: string, code: string) {
    return postJson('/agent/register', { name, phone, code })
  },

  async register(name: string, phone: string, roleOrNeighborhood: 'customer' | 'agent' | 'admin' | string, neighborhoodOrType?: string) {
    if (roleOrNeighborhood === 'customer' || roleOrNeighborhood === 'agent' || roleOrNeighborhood === 'admin') {
      return this.createLocalUser(name, phone, roleOrNeighborhood, neighborhoodOrType)
    }

    const neighborhood = roleOrNeighborhood
    const type = neighborhoodOrType as 'customer' | 'agent'
    if (type === 'agent') {
      throw new Error('Agentes devem ser criados pela equipa operacional com nome e codigo.')
    }

    const data = await this.registerClient(name, phone)
    return data && typeof data === 'object' && 'user' in data
      ? { ...(data as { user: AuthSession; token: string }).user, token: (data as { token: string }).token, role: 'customer', type: 'customer', neighborhood }
      : data
  },

  async login(identifier: string, secret?: string, type?: 'customer' | 'agent' | 'admin') {
    if (!secret || !type) {
      return this.loginLocal(identifier)
    }

    if (type === 'admin') return this.loginAdmin(identifier, secret)
    if (type === 'agent') return this.loginAgent(identifier, secret)
    return this.loginClient(identifier, secret)
  },

  async registerLegacy(name: string, phone: string, neighborhood: string, type: 'customer' | 'agent') {
    if (type === 'agent') {
      throw new Error('Agentes devem ser criados pela equipa operacional com nome e codigo.')
    }

    const data = await this.registerClient(name, phone)
    return data && typeof data === 'object' && 'user' in data
      ? { ...(data as { user: AuthSession; token: string }).user, token: (data as { token: string }).token, role: 'customer', type: 'customer' }
      : data
  },

  getCurrentUser(): AuthSession | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser()
  },

  initializeFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_USERS_KEY)
    if (!stored) return

    try {
      const usersList = JSON.parse(stored)
      usersList.forEach((user: User) => users.set(user.id, user))
    } catch (error) {
      console.error('Failed to load users from storage', error)
    }
  },
}

if (typeof window !== 'undefined') {
  authService.initializeFromStorage()
}
