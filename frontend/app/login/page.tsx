'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { openLogin } = useAuthStore()

  useEffect(() => {
    openLogin()
    router.replace('/')
  }, [openLogin, router])

  return null
}
