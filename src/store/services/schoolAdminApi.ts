import { SchoolAdminListResponse, SchoolDriverListResponse } from '@src/dtos/schoolAdmin'
import { ApiMethods, AuthTags } from '@src/shared/constants/enums'
import {
  NEXT_PUBLIC_SCHOOL_ADMIN_API,
  NEXT_PUBLIC_SCHOOL_DRIVER_API,
} from '@utils/url_helper'

import { baseApi } from './baseApi'

export const schoolAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolAdmins: builder.query<SchoolAdminListResponse, string>({
      query: (schoolId) => ({
        url: `${NEXT_PUBLIC_SCHOOL_ADMIN_API}/school/${schoolId}`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SCHOOL],
    }),
    deactivateSchoolAdmin: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (adminId) => ({
        url: `${NEXT_PUBLIC_SCHOOL_ADMIN_API}/${adminId}/deactivate`,
        method: ApiMethods.POST,
      }),
      invalidatesTags: [AuthTags.SCHOOL],
    }),
    getSchoolDrivers: builder.query<SchoolDriverListResponse, string>({
      query: (schoolId) => ({
        url: `${NEXT_PUBLIC_SCHOOL_DRIVER_API}/${schoolId}`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SCHOOL],
    }),
    assignDriverToSchool: builder.mutation<
      { success: boolean; message: string },
      { driverId: string; schoolId: string }
    >({
      query: ({ driverId, schoolId }) => ({
        url: `${NEXT_PUBLIC_SCHOOL_DRIVER_API}/assign`,
        method: ApiMethods.POST,
        body: {
          driverId,
          schoolId,
        },
      }),
      invalidatesTags: [AuthTags.SCHOOL],
    }),
    removeDriverFromSchool: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (driverId) => ({
        url: `${NEXT_PUBLIC_SCHOOL_DRIVER_API}/${driverId}/remove`,
        method: ApiMethods.POST,
      }),
      invalidatesTags: [AuthTags.SCHOOL],
    }),
  }),
})

export const {
  useGetSchoolAdminsQuery,
  useDeactivateSchoolAdminMutation,
  useGetSchoolDriversQuery,
  useAssignDriverToSchoolMutation,
  useRemoveDriverFromSchoolMutation,
} = schoolAdminApi
