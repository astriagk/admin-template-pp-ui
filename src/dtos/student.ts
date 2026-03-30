export interface StudentParent {
  parent_id: string
  name: string
  email?: string
  photo_url?: string
  phone_number?: string
}

export interface StudentDriverAssignment {
  assignment_id: string
  assignment_status: string
  assignment_source: string
  monthly_fee: number | null
  assigned_date: string
  driver: {
    driver_id: string
    name: string
    phone_number: string
    vehicle_type: string
    vehicle_number: string
    driver_unique_id: string
  }
}

export interface StudentRedemptionCode {
  code: string
  is_redeemed: boolean
  end_date?: string
}

export interface Student {
  _id: string
  student_name: string
  name?: string
  class: string
  grade?: string
  section?: string
  roll_number?: string
  gender?: string
  date_of_birth?: string
  parent_id: string
  parent_name?: string
  parent?: StudentParent
  school_id: string
  school_name?: string
  phone_number?: string
  pickup_address_id?: string
  is_active: boolean
  driver_assignment?: StudentDriverAssignment
  redemption_code?: StudentRedemptionCode
  created_at: string
  updated_at: string
}

export interface StudentListResponse {
  success: boolean
  data: Student[]
  message: string
}

export interface StudentDetailsResponse {
  success: boolean
  data: Student
  message: string
}
