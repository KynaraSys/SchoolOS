export type UserRole =
  | "owner"
  | "principal"
  | "academic_director"
  | "bursar"
  | "teacher"
  | "parent"
  | "student"
  | "ict_admin"
  | "admin"

export interface User {
  id: string
  email: string
  full_name: string
  name: string // Added to match backend
  role: UserRole
  school_id: string
  avatar_url?: string
  isClassTeacher?: boolean // Optional flag to distinguish class teachers from subject teachers
  classTeacherAssignments?: { // For filtering
    id: number
    class_id: number
    academic_year: string
    is_primary: boolean
  }[]
}

export interface School {
  id: string
  name: string
  code: string
  motto?: string
  logo_url?: string
}
