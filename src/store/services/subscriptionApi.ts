import {
  CreateSchoolSubscriptionRequest,
  CreateSubscriptionPlanRequest,
  GenerateCodesRequest,
  ParentSubscriptionListResponse,
  RedemptionCodeListResponse,
  SchoolSubscription,
  SchoolSubscriptionListResponse,
  SubscriptionPlanListResponse,
} from '@src/dtos/subscription'
import { ApiMethods, AuthTags } from '@src/shared/constants/enums'
import {
  NEXT_PUBLIC_ADMIN_PARENT_SUBSCRIPTIONS_API,
  NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API,
  NEXT_PUBLIC_ADMIN_SUBSCRIPTION_PLANS_API,
  NEXT_PUBLIC_SUBSCRIPTION_PLANS_API,
} from '@utils/url_helper'

import { baseApi } from './baseApi'

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlanListResponse, void>({
      query: () => ({
        url: NEXT_PUBLIC_SUBSCRIPTION_PLANS_API,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SUBSCRIPTION],
    }),
    createSubscriptionPlan: builder.mutation<
      { success: boolean; message: string },
      CreateSubscriptionPlanRequest
    >({
      query: (body) => ({
        url: NEXT_PUBLIC_ADMIN_SUBSCRIPTION_PLANS_API,
        method: ApiMethods.POST,
        body,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    updateSubscriptionPlan: builder.mutation<
      { success: boolean; message: string },
      { id: string } & Partial<CreateSubscriptionPlanRequest>
    >({
      query: ({ id, ...body }) => ({
        url: `${NEXT_PUBLIC_ADMIN_SUBSCRIPTION_PLANS_API}/${id}`,
        method: ApiMethods.PUT,
        body,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    activateSubscriptionPlan: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `${NEXT_PUBLIC_ADMIN_SUBSCRIPTION_PLANS_API}/${id}/activate`,
        method: ApiMethods.PATCH,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    deactivateSubscriptionPlan: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `${NEXT_PUBLIC_ADMIN_SUBSCRIPTION_PLANS_API}/${id}/deactivate`,
        method: ApiMethods.PATCH,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    getParentSubscriptions: builder.query<ParentSubscriptionListResponse, void>(
      {
        query: () => ({
          url: NEXT_PUBLIC_ADMIN_PARENT_SUBSCRIPTIONS_API,
          method: ApiMethods.GET,
        }),
        providesTags: [AuthTags.SUBSCRIPTION],
      }
    ),
    getAllSchoolSubscriptions: builder.query<
      SchoolSubscriptionListResponse,
      void
    >({
      query: () => ({
        url: NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SUBSCRIPTION],
    }),
    getSchoolSubscriptions: builder.query<
      SchoolSubscriptionListResponse,
      string
    >({
      query: (schoolId) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/school/${schoolId}`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SUBSCRIPTION],
    }),
    createSchoolSubscription: builder.mutation<
      { success: boolean; message: string },
      CreateSchoolSubscriptionRequest
    >({
      query: (body) => ({
        url: NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API,
        method: ApiMethods.POST,
        body,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    getRedemptionCodes: builder.query<RedemptionCodeListResponse, string>({
      query: (subscriptionId) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/${subscriptionId}/codes`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SUBSCRIPTION],
    }),
    generateRedemptionCodes: builder.mutation<
      { success: boolean; message: string },
      GenerateCodesRequest
    >({
      query: ({ subscriptionId, studentIds }) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/${subscriptionId}/generate-codes`,
        method: ApiMethods.POST,
        body: { student_ids: studentIds },
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    getActiveSchoolSubscription: builder.query<
      { success: boolean; data: SchoolSubscription; message: string },
      string
    >({
      query: (schoolId) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/school/${schoolId}/active`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SUBSCRIPTION],
    }),
    updateSchoolSubscription: builder.mutation<
      { success: boolean; message: string },
      { subscriptionId: string } & Partial<CreateSchoolSubscriptionRequest>
    >({
      query: ({ subscriptionId, ...body }) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/${subscriptionId}`,
        method: ApiMethods.PATCH,
        body,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    renewSchoolSubscription: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (subscriptionId) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/${subscriptionId}/renew`,
        method: ApiMethods.POST,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    cancelSchoolSubscription: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (subscriptionId) => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/${subscriptionId}/cancel`,
        method: ApiMethods.POST,
      }),
      invalidatesTags: [AuthTags.SUBSCRIPTION],
    }),
    getExpiredSchoolSubscriptions: builder.query<
      SchoolSubscriptionListResponse,
      void
    >({
      query: () => ({
        url: `${NEXT_PUBLIC_ADMIN_SCHOOL_SUBSCRIPTIONS_API}/expired/list`,
        method: ApiMethods.GET,
      }),
      providesTags: [AuthTags.SUBSCRIPTION],
    }),
  }),
})

export const {
  useGetAllSchoolSubscriptionsQuery,
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useActivateSubscriptionPlanMutation,
  useDeactivateSubscriptionPlanMutation,
  useGetParentSubscriptionsQuery,
  useGetSchoolSubscriptionsQuery,
  useCreateSchoolSubscriptionMutation,
  useGetRedemptionCodesQuery,
  useGenerateRedemptionCodesMutation,
  useGetActiveSchoolSubscriptionQuery,
  useUpdateSchoolSubscriptionMutation,
  useRenewSchoolSubscriptionMutation,
  useCancelSchoolSubscriptionMutation,
  useGetExpiredSchoolSubscriptionsQuery,
} = subscriptionApi
