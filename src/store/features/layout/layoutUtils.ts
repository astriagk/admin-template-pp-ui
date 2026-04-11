import { THEME_STORAGE_MAP } from '@src/shared/constants/enums'
import LocalStorage from '@src/utils/LocalStorage'

/**
 * Changes the body attribute
 */
const changeHTMLAttribute = (attribute: string, value: string) => {
  if (document.documentElement)
    document.documentElement.setAttribute(attribute, value)
  return true
}

const removeAttribute = (attribute: string) => {
  if (document.documentElement)
    document.documentElement.removeAttribute(attribute)
}

// Resolve HTML attribute name → obfuscated localStorage key
const storageKey = (attr: string): string => THEME_STORAGE_MAP[attr] ?? attr

// get previous theme data
const getPreviousStorageData = (key: string): string | null => {
  try {
    return LocalStorage.getItem(storageKey(key))
  } catch (error) {
    console.error('Error accessing localStorage', error)
    return null
  }
}

// set new theme data
const setNewThemeData = (key: string, value: string) => {
  try {
    LocalStorage.setItem(storageKey(key), value)
  } catch (error) {
    console.error('Error accessing localStorage', error)
  }
}

const appendDarkModeClass = (
  existingClass: string,
  darkModeClass: string
): string => {
  // Check if the class is already present to avoid duplicates
  return !existingClass.includes(darkModeClass)
    ? `${existingClass} ${darkModeClass}`
    : existingClass
}

// remove existing theme data
const removeThemeData = (existingItem: string) => {
  try {
    LocalStorage.removeItem(storageKey(existingItem))
  } catch (error) {
    console.error('Error accessing localStorage', error)
  }
}

export {
  changeHTMLAttribute,
  getPreviousStorageData,
  setNewThemeData,
  appendDarkModeClass,
  removeAttribute,
  removeThemeData,
}
