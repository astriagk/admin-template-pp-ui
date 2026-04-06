'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import profileImage from '@assets/images/avatar/profile.png'
import logoSmDark from '@assets/images/logo-sm-dark.png'
import logoSm from '@assets/images/logo-sm-white.png'
import logoWhite from '@assets/images/logo-white.png'
import mainLogo from '@assets/images/main-logo.png'
import { MainMenu, MegaMenu, SubMenu } from '@src/dtos'
import { paths } from '@src/shared/common/DynamicTitle'
import { STORAGE_KEYS, UserRolesType } from '@src/shared/constants/enums'
import { LAYOUT_TYPES, SIDEBAR_SIZE } from '@src/shared/constants/layout'
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownPosition,
} from '@src/shared/custom/dropdown/dropdown'
import { useAppSelector } from '@src/store/hooks'
import LocalStorage from '@src/utils/LocalStorage'
import {
  AlignStartVertical,
  Bell,
  BellDot,
  BookOpen,
  Box,
  Bus,
  Calendar,
  CalendarDays,
  ChartBarBig,
  ChartScatter,
  ChevronDown,
  Clipboard,
  ClipboardList,
  CreditCard,
  Dna,
  Feather,
  FileText,
  Folders,
  Gauge,
  Gem,
  GraduationCap,
  Headset,
  Hospital,
  IndianRupee,
  KeyRound,
  LifeBuoy,
  LogOut,
  Mail,
  Map,
  MapPin,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Monitor,
  PencilRuler,
  Plus,
  Presentation,
  QrCode,
  RemoveFormatting,
  School,
  Settings,
  Shapes,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Star,
  Table2,
  TextQuote,
  TrendingDown,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SimpleBar from 'simplebar-react'

interface SidebarProps {
  searchSidebar: MegaMenu[]
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({
  searchSidebar,
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) => {
  const { t } = useTranslation()
  const appRouter = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    appRouter.push(paths.AUTH.SIGNIN_BASIC)
  }

  const [sidebarDropdownPosition, setSidebarDropdownPosition] =
    useState<DropdownPosition>('top-right')
  const router = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { layoutType, layoutSidebar } = useAppSelector((state) => state.Layout)
  const user = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
    ? JSON.parse(LocalStorage.getItem(STORAGE_KEYS.ADMIN)!)
    : null

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (layoutType === 'horizontal') {
      setSidebarDropdownPosition('')
    } else {
      setSidebarDropdownPosition('top-right')
    }
  }, [layoutType])

  const getLucideIcon = (icon: string, className: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      gauge: <Gauge className={className} />,
      box: <Box className={className} />,
      'messages-square': <MessagesSquare className={className} />,
      calendar: <Calendar className={className} />,
      mail: <Mail className={className} />,
      'shopping-bag': <ShoppingBag className={className} />,
      folders: <Folders className={className} />,
      monitor: <Monitor className={className} />,
      shapes: <Shapes className={className} />,
      trophy: <Trophy className={className} />,
      hospital: <Hospital className={className} />,
      school: <School className={className} />,
      'file-text': <FileText className={className} />,
      'users-round': <UsersRound className={className} />,
      'align-start-vertical': <AlignStartVertical className={className} />,
      'key-round': <KeyRound className={className} />,
      gem: <Gem className={className} />,
      'pencil-ruler': <PencilRuler className={className} />,
      'book-open': <BookOpen className={className} />,
      'remove-formatting': <RemoveFormatting className={className} />,
      clipboard: <Clipboard className={className} />,
      'text-quote': <TextQuote className={className} />,
      'table-2': <Table2 className={className} />,
      'bar-chart-3': <ChartBarBig className={className} />,
      'trending-up-down': <TrendingDown className={className} />,
      dna: <Dna className={className} />,
      'scatter-chart': <ChartScatter className={className} />,
      map: <Map className={className} />,
      'life-buoy': <LifeBuoy className={className} />,
      'file-textt': <FileText className={className} />,
      feather: <Feather className={className} />,
      'layout-dashboard': <Gauge className={className} />,
      'shield-user': <Shield className={className} />,
      'map-pin': <MapPin className={className} />,
      'clipboard-list': <ClipboardList className={className} />,
      'credit-card': <CreditCard className={className} />,
      'qr-code': <QrCode className={className} />,
      'graduation-cap': <GraduationCap className={className} />,
      bus: <Bus className={className} />,
      'calendar-days': <CalendarDays className={className} />,
      'message-square': <MessageSquare className={className} />,
      'shield-check': <ShieldCheck className={className} />,
      'indian-rupee': <IndianRupee className={className} />,
      megaphone: <Megaphone className={className} />,
      shield: <Shield className={className} />,
      star: <Star className={className} />,
      bell: <Bell className={className} />,
      settings: <Settings className={className} />,
      add: <Plus className={className} />,
    }
    return icons[icon]
  }

  // Function to match menu items with current route
  // Supports both exact matches and parent path matching
  const isPathMatch = (menuPath: string, currentPath: string): boolean => {
    if (!menuPath || menuPath === '#') return false
    // Exact match
    if (menuPath === currentPath) return true
    // Parent path match (e.g., /users/drivers matches /users/drivers/list)
    if (currentPath.startsWith(menuPath + '/')) return true
    return false
  }

  const isActive = (menuItem: MegaMenu | MainMenu | SubMenu): boolean => {
    if (isPathMatch(menuItem.link || '', router)) return true
    if (!menuItem.children) return false
    return menuItem.children.some((child) => {
      if (isPathMatch(child.link || '', router)) return true
      if (child.children && child.children.length > 0) return isActive(child)
      return false
    })
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      {isSidebarOpen === true && (
        <>
          <div
            id="main-sidebar"
            className={`main-sidebar group-data-[layout=boxed]:top-[calc(theme('spacing.topbar')_+_theme('spacing.sidebar-boxed'))]  lg:block ${
              scrolled ? 'group-data-[layout=boxed]:!top-topbar' : 'scrolled'
            }`}>
            {/* Sidebar content goes here */}
            <div className="sidebar-wrapper">
              <div>
                <div className="navbar-brand">
                  <Link
                    href="#!"
                    className="inline-flex items-center justify-center w-full">
                    <div className="group-data-[sidebar=small]:hidden">
                      <Image
                        src={mainLogo}
                        aria-label="logo"
                        alt="logo"
                        className="h-6 mx-auto group-data-[sidebar-colors=light]:dark:hidden group-data-[sidebar-colors=dark]:hidden group-data-[sidebar-colors=brand]:hidden group-data-[sidebar-colors=purple]:hidden group-data-[sidebar-colors=sky]:hidden"
                        width={132}
                        height={24}
                      />
                      <Image
                        src={logoWhite}
                        aria-label="logo"
                        alt="logo"
                        className="h-6 mx-auto group-data-[sidebar-colors=light]:hidden group-data-[sidebar-colors=light]:dark:inline-block"
                        width={132}
                        height={24}
                      />
                    </div>
                    <div className="hidden group-data-[sidebar=small]:inline-block">
                      <Image
                        src={logoSmDark}
                        aria-label="logo"
                        alt="logo"
                        className="h-6 mx-auto group-data-[sidebar-colors=light]:dark:hidden group-data-[sidebar-colors=dark]:hidden group-data-[sidebar-colors=brand]:hidden group-data-[sidebar-colors=purple]:hidden group-data-[sidebar-colors=sky]:hidden"
                        width={24}
                        height={24}
                      />
                      <Image
                        src={logoSm}
                        aria-label="logo"
                        alt="logo"
                        className="h-6 mx-auto group-data-[sidebar-colors=light]:hidden group-data-[sidebar-colors=light]:dark:inline-block"
                        width={24}
                        height={24}
                      />
                    </div>
                  </Link>
                </div>

                <div className="relative group-data-[layout=horizontal]:hidden group-data-[sidebar=small]:w-full">
                  <div className="block dropdown">
                    <Dropdown
                      toggleSidebar={toggleSidebar}
                      position=""
                      trigger="click"
                      dropdownClassName="dropdown w-full">
                      <DropdownButton colorClass="flex items-center w-full gap-2 p-4 text-left group-data-[sidebar=small]:px-0">
                        <Image
                          src={profileImage}
                          alt="user"
                          className="h-10 rounded-md shrink-0 group-data-[sidebar=small]:mx-auto"
                          width={40}
                          height={40}
                        />
                        <div className="grow group-data-[sidebar=icon]:hidden group-data-[sidebar=small]:hidden overflow-hidden text-new-500">
                          <h6 className="font-medium truncate text-sidebar-text-active">
                            {user?.username || 'User Name'}
                          </h6>
                          <p className="text-menu-title text-14">
                            {UserRolesType[
                              user?.admin_role as keyof typeof UserRolesType
                            ] || 'Admin Role'}
                          </p>
                        </div>
                        <div className="shrink-0 text-sidebar-text group-data-[sidebar=icon]:hidden group-data-[sidebar=small]:hidden group-data-[sidebar=medium]:hidden">
                          <ChevronDown className="size-4" />
                        </div>
                      </DropdownButton>
                      <DropdownMenu menuClass="z-50 p-5 bg-white rounded-md shadow-lg !w-64 !left-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={profileImage}
                            alt="user"
                            className="rounded-full size-10"
                          />
                          <div>
                            <h6>Hello</h6>
                            <p>
                              <Link href="#!" className="link link-primary">
                                {user?.email || 'Email Address'}
                              </Link>
                            </p>
                          </div>
                        </div>
                        {/* <div className="pt-2 mt-3 border-t border-gray-200 dark:border-dark-800">
                          <ul>
                            <li>
                              <Link
                                href="/page/user-activity"
                                className="inline-block py-2 text-gray-500 dark:text-dark-500 before:hidden ltr:text-left rtl:text-right link hover:text-primary-500 dark:hover:text-primary-500">
                                <BellDot className="inline-block mr-2 size-4" />{' '}
                                Profile Activity
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/page/user-projects"
                                className="inline-block py-2 text-gray-500 dark:text-dark-500 before:hidden ltr:text-left rtl:text-right link hover:text-primary-500 dark:hover:text-primary-500">
                                <Presentation className="inline-block mr-2 size-4" />{' '}
                                Manage Projects
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/page/account-settings"
                                className="inline-block py-2 text-gray-500 dark:text-dark-500 before:hidden ltr:text-left rtl:text-right link hover:text-primary-500 dark:hover:text-primary-500">
                                <Settings className="inline-block mr-2 size-4" />{' '}
                                Account Settings
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/page/help-center"
                                className="inline-block py-2 text-gray-500 dark:text-dark-500 before:hidden ltr:text-left rtl:text-right link hover:text-primary-500 dark:hover:text-primary-500">
                                <Headset className="inline-block mr-2 size-4" />{' '}
                                Help Center
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/page/pricing"
                                className="inline-block py-2 text-gray-500 dark:text-dark-500 before:hidden ltr:text-left rtl:text-right link hover:text-primary-500 dark:hover:text-primary-500">
                                <Gem className="inline-block mr-2 size-4" />{' '}
                                Upgrade Plan
                              </Link>{' '}
                            </li>
                          </ul>
                        </div> */}
                        <div className="pt-2 mt-3 border-t border-gray-200 dark:border-dark-800">
                          <button
                            className="!px-0 !py-1.5 before:hidden link link-primary"
                            onClick={handleLogout}>
                            <LogOut className="inline-block mr-2 size-4" /> Log
                            Out
                          </button>
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="fixed top-0 bottom-0 left-0 w-20 bg-white bg-light hidden group-data-[layout=doulcolumn]:block"></div>
              <SimpleBar className="navbar-menu" id="navbar-menu-list">
                <ul
                  className="group-data-[layout=horizontal]:md:flex group-data-[layout=horizontal]:*:shrink-0"
                  id="sidebar">
                  {searchSidebar && searchSidebar.length > 0
                    ? searchSidebar.map((item: MegaMenu, index: number) => (
                        <li
                          key={index}
                          className={
                            item.separator ? 'menu-title' : 'relative'
                          }>
                          {/* Check for separator */}
                          {!(item.children?.length ?? 0) && item.separator && (
                            <span className="group-data-[sidebar=small]:hidden">
                              {t(item.lang)}
                            </span>
                          )}

                          {/* If it has children */}
                          {!item.separator &&
                            (item.children ?? []).length > 0 && (
                              <Dropdown
                                position={sidebarDropdownPosition}
                                trigger="click"
                                isActive={
                                  layoutSidebar !== SIDEBAR_SIZE.SMALL
                                    ? isActive(item)
                                    : false
                                }
                                toggleSidebar={toggleSidebar}
                                closeOnOutsideClick={
                                  layoutType === LAYOUT_TYPES.HORIZONTAL ||
                                  layoutSidebar === SIDEBAR_SIZE.SMALL
                                }
                                closeOnOutsideClickSidebar={
                                  layoutType !== LAYOUT_TYPES.HORIZONTAL
                                }>
                                <DropdownButton
                                  colorClass={`nav-link ${
                                    isActive(item) ? 'active' : ''
                                  }`}
                                  arrow={true}>
                                  <span className="w-6 group-data-[sidebar=small]:mx-auto shrink-0">
                                    {item.icon &&
                                      getLucideIcon(
                                        item.icon,
                                        'size-4 group-data-[sidebar=small]:size-5 group-data-[sidebar=medium]:size-5'
                                      )}
                                  </span>
                                  <span className="group-data-[sidebar=small]:hidden">
                                    {t(item.lang)}
                                  </span>
                                </DropdownButton>

                                <DropdownMenu
                                  handleMenuClick={handleMenuClick}
                                  sidebar={true}>
                                  <ul className="dropdown-wrapper">
                                    {(item.children ?? []).map(
                                      (child: MegaMenu, childIndex: number) => (
                                        <li key={childIndex}>
                                          {/* Check for nested children */}
                                          {child.children &&
                                          child.children.length > 0 ? (
                                            <Dropdown
                                              position="top-right"
                                              trigger="click"
                                              isActive={isActive(child)}
                                              closeOnOutsideClick={
                                                layoutType ===
                                                  LAYOUT_TYPES.HORIZONTAL ||
                                                layoutSidebar ===
                                                  SIDEBAR_SIZE.SMALL
                                              }
                                              closeOnOutsideClickSidebar={
                                                layoutType !==
                                                LAYOUT_TYPES.HORIZONTAL
                                              }>
                                              <DropdownButton
                                                colorClass={`nav-link ${
                                                  isActive(child)
                                                    ? 'active'
                                                    : ''
                                                }`}
                                                arrow={true}>
                                                <span>{t(child.lang)}</span>
                                              </DropdownButton>

                                              <DropdownMenu
                                                handleMenuClick={
                                                  handleMenuClick
                                                }
                                                sidebar={true}>
                                                <ul className="dropdown-wrapper">
                                                  {child.children.map(
                                                    (
                                                      subChild: MegaMenu,
                                                      subIndex: number
                                                    ) => (
                                                      <li key={subIndex}>
                                                        <Link
                                                          href={
                                                            subChild.link
                                                              ? subChild.link
                                                              : '#'
                                                          }
                                                          className={`${
                                                            isPathMatch(
                                                              subChild.link ||
                                                                '',
                                                              router
                                                            )
                                                              ? 'active'
                                                              : ''
                                                          }`}>
                                                          {t(subChild.lang)}
                                                        </Link>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </DropdownMenu>
                                            </Dropdown>
                                          ) : (
                                            <Link
                                              href={child.link || '#'}
                                              className={` content ${
                                                isPathMatch(
                                                  child.link || '',
                                                  router
                                                )
                                                  ? 'active'
                                                  : ''
                                              }`}>
                                              {t(child.lang)}
                                            </Link>
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </Dropdown>
                            )}

                          {/* Simple link without children */}
                          {!item.separator &&
                            !(item.children?.length ?? 0) &&
                            item.link && (
                              <Link
                                href={item.link}
                                className={`nav-link flex items-center gap-2 ${
                                  router === item.link ? 'active' : ''
                                }`}>
                                <span>
                                  {item.icon &&
                                    getLucideIcon(
                                      item.icon,
                                      'size-4 group-data-[sidebar=small]:size-5 group-data-[sidebar=medium]:size-5'
                                    )}
                                </span>
                                <span className="group-data-[sidebar=small]:hidden">
                                  {t(item.lang)}
                                </span>
                              </Link>
                            )}
                        </li>
                      ))
                    : ''}
                </ul>
              </SimpleBar>
            </div>
          </div>
          <div
            id="backdrop"
            className="backdrop-overlay backdrop-blur-xs z-[1004] lg:hidden print:hidden"
            onClick={toggleSidebar}></div>
        </>
      )}
    </>
  )
}

export default Sidebar
