'use client'

import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import whiteLogo from '@assets/images/logo-white.png'
import logo from '@assets/images/main-logo.png'
import LanguageDropdown from '@src/shared/common/LanguageDropdown'
import { LAYOUT_MODE_TYPES, SIDEBAR_COLOR } from '@src/shared/constants/layout'
import Button from '@src/shared/custom/buttons/button'
import {
  changeLayoutMode,
  changeSidebarColor,
} from '@src/store/features/layout'
import { useAppDispatch, useAppSelector } from '@src/store/hooks'
import { Moon, PanelRightOpen, Search, Sun } from 'lucide-react'
import Flatpickr from 'react-flatpickr'

interface TopBarProps {
  searchMenu: (value: string) => void
  searchText: string
  toggleSidebar: () => void
}

const Topbar: React.FC<TopBarProps> = ({
  searchMenu,
  searchText,
  toggleSidebar,
}) => {
  const { layoutMode, layoutSidebarColor } = useAppSelector(
    (state) => state.Layout
  )
  const dispatch = useAppDispatch()
  const [scrolled, setScrolled] = useState(false)
  const flatpickrRef = useRef<Flatpickr | null>(null)
  const [isOpen] = useState(false)

  useEffect(() => {
    if (isOpen && flatpickrRef.current) {
      flatpickrRef.current.flatpickr.open()
    }
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // change layout mode
  const handleChangeLayoutMode = (value: LAYOUT_MODE_TYPES) => {
    dispatch(changeLayoutMode(value))
  }

  return (
    <React.Fragment>
      <div
        className={`main-topbar group/topbar navbar ${
          scrolled
            ? 'group-data-[layout=boxed]:top-0 group-data-[layout=semibox]:top-0 nav-sticky'
            : ''
        }`}>
        <div className="main-topbar-wrapper group-data-[nav-type=pattern]:!border-primary-400 group-data-[nav-type=pattern]:group-[&.nav-sticky]/topbar:!bg-primary-500 group-data-[nav-type=pattern]:group-[&.nav-sticky]/topbar:!border-primary-400">
          <div className="flex items-center w-full ltr:pr-4 rtl:pl-4">
            {/* Logo */}
            <div className="navbar-brand">
              <div className="logos">
                <Link href="/dashboards/ecommerce">
                  <Image
                    src={logo}
                    aria-label="Read more about Seminole tax hike"
                    alt="logo"
                    className="h-6 group-data-[layout=modern]:hidden inline-block dark:hidden"
                    height={24}
                    width={132}
                  />
                  <Image
                    src={whiteLogo}
                    aria-label="Read more about Seminole tax hike"
                    alt="logo"
                    className="h-6 hidden dark:inline-block group-data-[layout=modern]:hidden"
                    height={24}
                    width={132}
                  />
                </Link>
              </div>

              <button
                onClick={() => toggleSidebar()}
                className="sidebar-toggle group-data-[layout=horizontal]:lg:hidden"
                title="sidebar-toggle">
                <PanelRightOpen className="size-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative items-center hidden lg:flex">
              <Search className="absolute size-4 text-topbar top-3 ltr:left-2 rtl:right-2 group-data-[nav-type=pattern]:text-white/75"></Search>
              <input
                type="search"
                className="border-0 w-72 ltr:pl-8 rtl:pr-8 form-input focus:outline-hidden group-data-[nav-type=pattern]:bg-transparent group-data-[nav-type=pattern]:placeholder:text-white/50 group-data-[nav-type=pattern]:text-white"
                placeholder="Search for Domiex"
                value={searchText}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  searchMenu(e.target.value)
                }
              />
            </div>

            <div className="flex items-center gap-2 ltr:ml-auto rtl:mr-auto">
              {/* Light & Dark Modal */}
              <button
                className="topbar-link"
                title="Toggle Layout Mode"
                onClick={() => {
                  handleChangeLayoutMode(
                    layoutMode === LAYOUT_MODE_TYPES.LIGHT
                      ? LAYOUT_MODE_TYPES.DARK
                      : LAYOUT_MODE_TYPES.LIGHT
                  )
                  if (layoutSidebarColor === SIDEBAR_COLOR.DARK) {
                    dispatch(changeSidebarColor(SIDEBAR_COLOR.LIGHT))
                  }
                }}>
                {layoutMode === LAYOUT_MODE_TYPES.LIGHT ||
                layoutMode === LAYOUT_MODE_TYPES.DEFAULT ||
                layoutMode === LAYOUT_MODE_TYPES.BLACK_WHITE ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className={'size-4 '} />
                )}
              </button>
              <LanguageDropdown />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Topbar
