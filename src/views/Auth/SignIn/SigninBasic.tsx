'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import whiteLogo from '@assets/images/logo-white.png'
import LogoMain from '@assets/images/main-logo.png'
import { paths } from '@src/shared/common/DynamicTitle'
import { STORAGE_KEYS } from '@src/shared/constants/enums'
import { MESSAGES } from '@src/shared/constants/messages'
import { useAppSelector } from '@src/store/hooks'
import { useLoginMutation } from '@src/store/services/authApi'
import LocalStorage from '@src/utils/LocalStorage'
import { setAuthTokens } from '@src/utils/auth'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const reduxAuthenticated = useAppSelector(
    (state) => state.Auth?.isAuthenticated ?? false
  )

  useEffect(() => {
    if (reduxAuthenticated) {
      router.push(paths.DASHBOARD)
    }
  }, [reduxAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !email.trim() || !password.trim()) {
      toast.error(MESSAGES.AUTH.VALIDATION.EMAIL_PASSWORD_REQUIRED)
      return
    }

    try {
      const result = await login({
        email: email.trim(),
        password: password.trim(),
      }).unwrap()
      setAuthTokens(result.data.access_token, result.data.refresh_token)
      LocalStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(result.data.admin))
      toast.success(MESSAGES.AUTH.SUCCESS.LOGIN_SUCCESS, {
        onClose: () => router.push(paths.DASHBOARD),
        autoClose: 1500,
      })
    } catch (err) {
      toast.error(MESSAGES.AUTH.ERROR.LOGIN_FAILED)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen py-12 from-sky-100 dark:from-sky-500/15 ltr:bg-gradient-to-l rtl:bg-gradient-to-r via-green-50 dark:via-green-500/10 to-pink-50 dark:to-pink-500/10">
      <div className="container">
        <div className="grid grid-cols-12">
          <div className="col-span-12 mb-0 md:col-span-10 lg:col-span-6 xl:col-span-4 md:col-start-2 lg:col-start-4 xl:col-start-5 card">
            <div className="md:p-10 card-body">
              <div className="mb-5 text-center">
                <Link href="#">
                  <Image
                    src={LogoMain}
                    alt="LogoMain"
                    className="h-8 mx-auto dark:hidden"
                    width={175}
                    height={32}
                  />
                  <Image
                    src={whiteLogo}
                    alt="whiteLogo"
                    className="hidden h-8 mx-auto dark:inline-block"
                    width={175}
                    height={32}
                  />
                </Link>
              </div>
              <h4 className="mb-6 font-bold leading-relaxed text-center text-transparent drop-shadow-lg ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-primary-500 vie-purple-500 to-pink-500 bg-clip-text">
                Welcome Back!
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-12 gap-5 mb-5 items-center">
                  <div className="col-span-12">
                    <label htmlFor="emailOrUsername" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      id="emailOrUsername"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full form-input"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="col-span-12">
                    <label htmlFor="password" className="block mb-2 text-sm">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full ltr:pr-8 rtl:pl-8 form-input"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 flex items-center text-gray-500 ltr:right-3 rtl:left-3 focus:outline-hidden dark:text-dark-500">
                        {showPassword ? (
                          <Eye className="size-5" />
                        ) : (
                          <EyeOff className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* <div className="col-span-12">
                    <div className="flex items-center">
                      <div className="input-check-group grow">
                        <input
                          id="checkboxBasic1"
                          className="input-check input-check-primary"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkboxBasic1"
                          className="input-check-label">
                          Remember me
                        </label>
                      </div>
                      <Link
                        href="/auth/forgot-password-basic"
                        className="block text-sm font-medium underline transition duration-300 ease-linear ltr:text-right rtl:text-left shrink-0 text-primary-500 hover:text-primary-600">
                        Forgot Password?
                      </Link>
                    </div>
                  </div> */}
                  <div className="col-span-12 mt-4">
                    <button
                      type="submit"
                      className="w-full btn btn-primary"
                      disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
