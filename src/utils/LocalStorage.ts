import { decryptValue, encryptValue } from './storageEncryption'

export default class LocalStorage {
  // get data from local storage (auto-decrypts)
  static getItem(key: string): string | null {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return decryptValue(raw)
  }

  // set data in local storage (auto-encrypts)
  static setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, encryptValue(value))
  }

  // remove data from local storage
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}
