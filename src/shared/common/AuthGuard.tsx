'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useVerifyTokenQuery } from '@src/store/services/authApi'

import { STORAGE_KEYS } from '../constants/enums'
import { MESSAGES } from '../constants/messages'
import { routeRoles } from '../constants/routeRoles'
import { paths } from './DynamicTitle'

interface AuthGuardProps {
  children: React.ReactNode
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">
        {MESSAGES.COMMON.LOADING.VERIFYING_AUTH}
      </p>
    </div>
  </div>
)

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [hasCheckedToken, setHasCheckedToken] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const { data, error, isLoading } = useVerifyTokenQuery(undefined, {
    skip: !hasCheckedToken || !hasToken,
  })

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null

    setHasToken(Boolean(token))
    setHasCheckedToken(true)
  }, [])

  useEffect(() => {
    if (hasCheckedToken && !hasToken) {
      router.replace(paths.AUTH.SIGNIN_BASIC)
    }
  }, [hasCheckedToken, hasToken, router])

  useEffect(() => {
    if (error) {
      router.replace(paths.AUTH.SIGNIN_BASIC)
    }
  }, [error, router])

  // Redirect to dashboard if user role is not allowed on current route
  useEffect(() => {
    if (data) {
      const userRole = data.data?.role ?? ''
      const allowedRoles = routeRoles[pathname]

      if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        router.replace(paths.DASHBOARD)
      }
    }
  }, [data, pathname, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <LoadingSpinner />
  }

  if (!hasCheckedToken || !hasToken) {
    return <LoadingSpinner />
  }

  if (data) {
    const userRole = data.data?.role ?? ''
    const allowedRoles = routeRoles[pathname]

    // If user role is not allowed, show loading while redirect happens
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      return <LoadingSpinner />
    }

    return <>{children}</>
  }

  return <LoadingSpinner />
}
