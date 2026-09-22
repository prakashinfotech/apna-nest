'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

function AuthUrlHandlerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { openLogin, openSignup, isOpen, isHydrated, user } = useAuthStore()

  // Hydrate user from localStorage on first mount
  useEffect(() => {
    useAuthStore.getState().hydrateFromStorage()
  }, [])

  useEffect(() => {
    // Only process URL auth triggers once we have hydrated the user state
    if (!isHydrated) return

    const authAction = searchParams.get('auth')
    if (authAction === 'login') {
      if (!user) openLogin()
      // Clean up URL without full reload
      const params = new URLSearchParams(searchParams.toString())
      params.delete('auth')
      const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '')
      window.history.replaceState(null, '', newUrl)
    } else if (authAction === 'signup') {
      if (!user) openSignup()
      const params = new URLSearchParams(searchParams.toString())
      params.delete('auth')
      const newUrl = pathname + (params.toString() ? `?${params.toString()}` : '')
      window.history.replaceState(null, '', newUrl)
    }
  }, [searchParams, pathname, openLogin, openSignup, user, isHydrated])

  return null
}

export function AuthUrlHandler() {
  return (
    <Suspense fallback={null}>
      <AuthUrlHandlerContent />
    </Suspense>
  )
}
