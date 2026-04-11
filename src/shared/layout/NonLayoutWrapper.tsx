'use client'

import { ReactNode, useEffect } from 'react'

import { usePathname } from 'next/navigation'

import Layout2 from '@src/layout/Layout2'

import { routes } from '../common/DynamicTitle'

interface LayoutWrapperProps {
  children: ReactNode
}

export default function NonLayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const route = routes.find((r) => r.path === pathname)

  useEffect(() => {
    document.title = route ? `${route.title} | Skolo` : 'Skolo'
  }, [route])

  return <Layout2>{children}</Layout2>
}
