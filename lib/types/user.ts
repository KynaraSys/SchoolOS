import { SchoolClass } from './academic';

export type UserRole = 'Admin' | 'Principal' | 'Academic Director' | 'Teacher' | 'Student' | 'Parent' | 'Bursar' | 'ICT Admin';

export interface Role {
    id: number;
    name: UserRole;
    guard_name: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClassTeacherAssignment {
    id: number;
    user_id: number;
    class_id: number;
    academic_year: string;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
    schoolClass?: SchoolClass;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    roles?: Role[];
    is_active: boolean;
    classTeacherAssignments?: ClassTeacherAssignment[];
    isClassTeacher?: boolean;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role?: UserRole;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: UserRole;
    is_active?: boolean;
}

export interface AssignClassDTO {
    class_id: number;
    academic_year: string;
}
