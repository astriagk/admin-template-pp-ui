import { TripStatus } from '@src/shared/constants/enums'

export interface Trip {
  _id: string
  driver_id: string
  trip_status: TripStatus
  trip_type: 'pickup' | 'drop'
  total_distance: number
  trip_date: string
  student_count: number
  start_time?: string
  end_time?: string
  created_at: string
  updated_at: string
  current_position?: {
    accuracy: number
    heading: number
    latitude: number
    longitude: number
    speed: number
    timestamp: string
  } | null
  driver: {
    driver_id: string
    name: string
    driver_unique_id: string
    vehicle_type: string
    vehicle_number: string
    phone_number: string
  }
  school: {
    school_id: string | null
    school_name?: string
    city?: string
  }
  students_by_parent?: Array<{
    parent_id: string
    parent_name: string
    parent_phone: string
    pickup_address: string | null
    students: Array<{
      trip_student_id: string
      student_id: string
      student_name: string
      attendance_status: string
      pickup_status: string
      sequence_order: number
    }>
  }>
}

export interface TripListResponse {
  success: boolean
  data: Trip[]
  message: string
}

export interface TripDetailsResponse {
  success: boolean
  data: Trip & {
    students_by_parent: Array<{
      parent_id: string
      parent_name: string
      parent_phone: string
      pickup_address: string | null
      students: Array<{
        trip_student_id: string
        student_id: string
        student_name: string
        attendance_status: string
        pickup_status: string
        sequence_order: number
      }>
    }>
    tracking_history?: Array<{
      lat: number
      lng: number
      timestamp: string
    }>
  }
  message: string
}

export interface TripFilters {
  status?: string[]
  trip_type?: string
  driver_id?: string
  school_id?: string
  from_date?: string
  to_date?: string
}
