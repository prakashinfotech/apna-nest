import { create } from 'zustand'
import { api } from '@/lib/api'

type AuthView    = 'login' | 'signup'
type LoginTab    = 'otp' | 'email'
type SignupRole  = 'buyer' | 'owner'

export interface AuthUser {
  id:        string
  name:      string
  email:     string
  phone?:    string
  roleId:    number
  isVerified: boolean
}

interface AuthStore {
  // Modal state
  isOpen:     boolean
  view:       AuthView
  loginTab:   LoginTab
  signupRole: SignupRole

  // Auth state
  user:  AuthUser | null
  token: string | null
  isHydrated: boolean

  // Modal controls
  openLogin:     () => void
  openSignup:    () => void
  close:         () => void
  setView:       (v: AuthView) => void
  setLoginTab:   (t: LoginTab) => void
  setSignupRole: (r: SignupRole) => void

  // Auth actions
  loginWithEmail:  (email: string, password: string) => Promise<void>
  register:        (data: RegisterPayload) => Promise<void>
  logout:          () => void
  updateUser:      (user: AuthUser) => void
  hydrateFromStorage: () => void
}

export interface RegisterPayload {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  password:  string
  isOwner:   boolean
}

const TOKEN_KEY = 'apnanest_token'
const USER_KEY  = 'apnanest_user'

export const useAuthStore = create<AuthStore>((set, get) => ({
  isOpen:     false,
  view:       'login',
  loginTab:   'otp',
  signupRole: 'buyer',
  user:       null,
  token:      null,
  isHydrated: false,

  openLogin:     () => set({ isOpen: true, view: 'login' }),
  openSignup:    () => set({ isOpen: true, view: 'signup' }),
  close:         () => set({ isOpen: false }),
  setView:       (view)       => set({ view }),
  setLoginTab:   (loginTab)   => set({ loginTab }),
  setSignupRole: (signupRole) => set({ signupRole }),

  loginWithEmail: async (email, password) => {
    const res = await api.post<{ token: string; userId?: string }>('/auth/login', { email, password })
    // Persist token so lib/api.ts picks it up
    localStorage.setItem(TOKEN_KEY, res.token)

    // Fetch user profile
    try {
      const me = await api.get<AuthUser>('/auth/me')
      localStorage.setItem(USER_KEY, JSON.stringify(me))
      set({ token: res.token, user: me, isOpen: false })
    } catch {
      // Fallback: construct basic user from token payload
      const user: AuthUser = { id: '', name: email.split('@')[0], email, roleId: 1, isVerified: false }
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      set({ token: res.token, user, isOpen: false })
    }
  },

  register: async (data) => {
    const res = await api.post<{ token: string; userId: string }>('/auth/register', {
      email:     data.email,
      password:  data.password,
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone,
      isOwner:   data.isOwner,
    })
    localStorage.setItem(TOKEN_KEY, res.token)

    try {
      const me = await api.get<AuthUser>('/auth/me')
      localStorage.setItem(USER_KEY, JSON.stringify(me))
      set({ token: res.token, user: me, isOpen: false })
    } catch {
      const user: AuthUser = { id: res.userId, name: `${data.firstName} ${data.lastName}`.trim(), email: data.email, phone: data.phone, roleId: data.isOwner ? 2 : 1, isVerified: false }
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      set({ token: res.token, user, isOpen: false })
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout', {}) } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ user: null, token: null })
  },

  updateUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user })
  },

  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    if (token && raw) {
      try { 
        set({ token, user: JSON.parse(raw), isHydrated: true }) 
        return
      } catch { /* ignore */ }
    }
    set({ isHydrated: true })
  },
}))
