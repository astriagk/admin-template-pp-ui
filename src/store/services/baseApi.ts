import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthTags, STORAGE_KEYS } from '@src/shared/constants/enums'
import LocalStorage from '@src/utils/LocalStorage'

export const baseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = LocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }
      return headers
    },
  }),
  tagTypes: [
    AuthTags.AUTH,
    AuthTags.ADMIN,
    AuthTags.DRIVER,
    AuthTags.PARENT,
    AuthTags.SCHOOL,
    AuthTags.PAYMENT,
    AuthTags.STUDENT,
    AuthTags.TRIP,
    AuthTags.ASSIGNMENT,
    AuthTags.SUBSCRIPTION,
    AuthTags.ROLE,
    AuthTags.AUDIT_LOG,
    AuthTags.NOTIFICATION,
    AuthTags.RATING,
  ],
  endpoints: () => ({}),
})
