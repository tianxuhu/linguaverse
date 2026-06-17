import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Language, Level } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => void
  logout: () => void
  register: (email: string, name: string, targetLanguage: Language, level: Level) => void
  updateUser: (patch: Partial<User>) => void
  setTargetLanguage: (lang: Language) => void
}

const defaultUser: User = {
  id: 'guest_default',
  email: 'learner@linguaverse.app',
  name: '小语',
  avatar: '语',
  targetLanguage: 'en',
  currentLevel: 'A1',
  totalPoints: 0,
  joinedAt: new Date().toISOString(),
  streak: { current: 0, longest: 0, lastActiveAt: new Date().toISOString() },
  abilities: { vocab: 30, grammar: 25, speaking: 18, listening: 22, reading: 28, writing: 20 },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email, name) => {
        const u: User = {
          ...defaultUser,
          id: 'u_' + email.split('@')[0],
          email,
          name: name || email.split('@')[0],
          avatar: (name || email[0] || 'U').slice(0, 2).toUpperCase(),
        }
        set({ user: u, isAuthenticated: true })
      },
      register: (email, name, targetLanguage, level) => {
        const u: User = {
          ...defaultUser,
          id: 'u_' + email.split('@')[0],
          email,
          name,
          avatar: name.slice(0, 2),
          targetLanguage,
          currentLevel: level,
          joinedAt: new Date().toISOString(),
        }
        set({ user: u, isAuthenticated: true })
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (patch) => set({ user: get().user ? { ...get().user!, ...patch } : null }),
      setTargetLanguage: (lang) =>
        set({ user: get().user ? { ...get().user!, targetLanguage: lang } : null }),
    }),
    { name: 'linguaverse:auth' },
  ),
)
