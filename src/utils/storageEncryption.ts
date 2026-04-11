import CryptoJS from 'crypto-js'

const SECRET = process.env.NEXT_PUBLIC_STORAGE_SECRET ?? '_pp_fallback_key_'

export const encryptValue = (value: string): string => {
  return CryptoJS.AES.encrypt(value, SECRET).toString()
}

export const decryptValue = (cipher: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET)
    const plain = bytes.toString(CryptoJS.enc.Utf8)
    return plain || null
  } catch {
    return null
  }
}
