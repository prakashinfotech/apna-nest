'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    // Disable MSW for now to allow direct connection to real backend
    setMswReady(true)
  }, [])

  if (!mswReady && process.env.NODE_ENV === 'development') {
    return null // Or a loader
  }

  return <>{children}</>
}
