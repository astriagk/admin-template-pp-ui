import {
  CreateSchoolPayload,
  CreateSchoolResponse,
  SchoolDetailsResponse,
  SchoolListResponse,
  UpdateSchoolPayload,
  UpdateSchoolResponse,
} from '@src/dtos/school'
import { ApiMethods, AuthTags } from '@src/shared/constants/enums'
import {
  NEXT_PUBLIC_SCHOOLS_LIST_API,
  NEXT_PUBLIC_SCHOOL_DETAILS_API,
} from '@utils/url_helper'

import { baseApi } from './baseApi'

export const schoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolsList: builder.query<SchoolListResponse, void>({
      query: () => {
        const queryParams = new URLSearchParams()
        return {
          url: `${NEXT_PUBLIC_SCHOOLS_LIST_API}`,
          // ?${queryParams.toString()}`,
          method: ApiMethods.GET,
        }
      },
      providesTags: [AuthTags.SCHOOL],
    }),
    getSchoolDetails: builder.query<SchoolDetailsResponse, string>({
      query: (schoolId) => ({
        url: `${NEXT_PUBLIC_SCHOOL_DETAILS_API}/${schoolId}`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SCHOOL],
    }),
    createSchool: builder.mutation<CreateSchoolResponse, CreateSchoolPayload>({
      query: (payload) => ({
        url: NEXT_PUBLIC_SCHOOL_DETAILS_API,
        method: ApiMethods.POST,
        body: payload,
      }),
      invalidatesTags: [AuthTags.SCHOOL],
    }),
    updateSchool: builder.mutation<
      UpdateSchoolResponse,
      { schoolId: string; payload: UpdateSchoolPayload }
    >({
      query: ({ schoolId, payload }) => ({
        url: `${NEXT_PUBLIC_SCHOOL_DETAILS_API}/${schoolId}`,
        method: ApiMethods.PUT,
        body: payload,
      }),
      invalidatesTags: [AuthTags.SCHOOL],
    }),
  }),
})

export const {
  useGetSchoolsListQuery,
  useLazyGetSchoolsListQuery,
  useGetSchoolDetailsQuery,
  useLazyGetSchoolDetailsQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
} = schoolApi
