export interface Student {
  id: string
  full_name: string
  phone_number: string
  institution_name?: string | null
  category?: string | null
  location?: string | null
  is_admin?: boolean
  institution_id?: string | null
  created_at: string
}

export interface ScheduleChange {
  id: string
  subject_name: string
  old_time: string
  new_time: string
  change_date: string
  institution_id?: string | null
  created_at: string
}

export interface Event {
  id: string
  event_name: string
  event_description: string | null
  event_date: string
  event_time: string
  location: string | null
  institution_id?: string | null
  created_at: string
}
