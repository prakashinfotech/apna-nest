'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function SignupPage() {
  const router = useRouter()
  const { openSignup } = useAuthStore()

  useEffect(() => {
    openSignup()
    router.replace('/')
  }, [openSignup, router])

  return null
}
