import { User } from "@/lib/types/roles"

export interface SchoolClass {
    id: number;
    name: string;
    grade_level: number;
    stream: string | null;
    curriculum: 'CBC' | '8-4-4'; // Added curriculum
    students_count?: number;
    students?: {
        id: number;
        user_id: string;
        admission_number: string;
        user?: User;
    }[];
    currentTeacher?: {
        id: number;
        user_id: string;
        teacher?: User;
        academic_year: string;
        is_primary: boolean;
        created_at: string;
    };
    created_at?: string;
    updated_at?: string;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    created_at?: string;
    updated_at?: string;
}

export interface Term {
    id: number;
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateClassDTO {
    name: string;
    grade_level: number;
    stream?: string;
    curriculum: 'CBC' | '8-4-4';
}

export interface CreateSubjectDTO {
    name: string;
    code: string;
}

export interface CreateTermDTO {
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
}
