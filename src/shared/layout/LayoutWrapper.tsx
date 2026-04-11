'use client'

import { ReactNode, useEffect } from 'react'

import { usePathname } from 'next/navigation'

import Layout from '@src/layout/Layout'
import { useAppSelector } from '@src/store/hooks'
import { ToastContainer } from 'react-toastify'

import AuthGuard from '../common/AuthGuard'
import { routes } from '../common/DynamicTitle'
import { LAYOUT_DIRECTION } from '../constants/layout'

interface LayoutWrapperProps {
  children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { layoutMode, layoutDirection } = useAppSelector(
    (state) => state.Layout
  )

  const pathname = usePathname()
  const route = routes.find((r) => r.path === pathname)

  useEffect(() => {
    document.title = route ? `${route.title} | Skolo` : 'Skolo'
  }, [route])

  return (
    <AuthGuard>
      <ToastContainer
        theme={layoutMode}
        rtl={layoutDirection === LAYOUT_DIRECTION.RTL}
        position={
          layoutDirection === LAYOUT_DIRECTION.RTL ? 'top-left' : 'top-right'
        }
      />
      <Layout>{children}</Layout>
    </AuthGuard>
  )
}
