import { PlanType } from '@src/shared/constants/enums'

// Subscription Plans
export interface SubscriptionPlanFeature {
  key: string
  label: string
  enabled: boolean
}

export interface SubscriptionPlan {
  _id: string
  plan_name: string
  plan_type: PlanType
  price: number
  currency: string
  pricing_model: 'flat' | 'per_kid' | 'base_plus_per_kid'
  per_kid_price?: number
  kids: {
    min: number
    max: number
  }
  features: SubscriptionPlanFeature[]
  priority: number
  is_active: boolean
  discounts?: {
    same_trip?: {
      percentage: number
      min_kids: number
      label: string
    }
  }
  created_at: string
  updated_at: string
}

export interface SubscriptionPlanListResponse {
  success: boolean
  data: SubscriptionPlan[]
  message: string
}

export interface CreateSubscriptionPlanRequest {
  plan_name: string
  plan_type: string
  price: number
  currency?: string
  pricing_model: string
  per_kid_price?: number
  kids: {
    min: number
    max: number
  }
  features: SubscriptionPlanFeature[]
}

// Parent Subscriptions
export interface ParentSubscription {
  _id: string
  parent_id: string
  parent_name: string
  plan_id: string
  plan_name: string
  subscription_status: 'active' | 'expired' | 'cancelled'
  calculated_price: number
  currency: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface ParentSubscriptionListResponse {
  success: boolean
  data: ParentSubscription[]
  message: string
}

// School Subscriptions
export interface SchoolSubscription {
  _id: string
  school_id: string
  plan_id: string
  school_name?: string
  start_date: string
  end_date: string
  subscription_status: 'active' | 'expired' | 'cancelled'
  auto_renew: boolean
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

export interface SchoolSubscriptionListResponse {
  success: boolean
  data: SchoolSubscription[]
  message: string
}

export interface CreateSchoolSubscriptionRequest {
  school_id: string
  plan_id: string
  start_date: string
  end_date: string
}

// Redemption Codes
export interface RedemptionCode {
  _id: string
  code: string
  status: 'available' | 'redeemed'
  is_redeemed?: boolean
  subscription_id?: string
  school_subscription_id?: string
  school_id: string
  plan_id?: string
  student_id?: string
  student_name?: string
  student_class?: string
  student_section?: string
  parent_name?: string
  parent_email?: string
  parent_phone?: string
  end_date?: string
  redeemed_at?: string
  created_at: string
}

export interface RedemptionCodeListResponse {
  success: boolean
  data: RedemptionCode[]
  message: string
}

export interface GenerateCodesRequest {
  subscriptionId: string
  studentIds: string[]
}
