export type UserRole =
  | "owner"
  | "principal"
  | "academic_director"
  | "bursar"
  | "teacher"
  | "parent"
  | "student"
  | "ict_admin"
  | "super_admin"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  school_id: string
  avatar_url?: string
  isClassTeacher?: boolean // Optional flag to distinguish class teachers from subject teachers
  is_super_admin?: boolean // Global override flag
}

export interface School {
  id: string
  name: string
  code: string
  motto?: string
  logo_url?: string
}
