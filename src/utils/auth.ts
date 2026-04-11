// Authentication utility functions for token management
import { STORAGE_KEYS } from '@src/shared/constants/enums'

import LocalStorage from './LocalStorage'

const isBrowser = typeof window !== 'undefined'

export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  if (!isBrowser) return

  try {
    LocalStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    LocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  } catch (error) {
    console.error('Error storing auth tokens:', error)
  }
}

export const getAccessToken = (): string | null => {
  if (!isBrowser) return null

  try {
    return LocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

export const getRefreshToken = (): string | null => {
  if (!isBrowser) return null

  try {
    return LocalStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  } catch (error) {
    console.error('Error getting refresh token:', error)
    return null
  }
}

export const clearAuthData = (): void => {
  if (!isBrowser) return

  try {
    LocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    LocalStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    LocalStorage.removeItem(STORAGE_KEYS.ADMIN)
  } catch (error) {
    console.error('Error clearing auth data:', error)
  }
}
