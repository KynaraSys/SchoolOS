import api from '@/lib/api'

export interface Remark {
    id: number
    student_id: number
    author_id: number
    term_id: number
    type: 'formative' | 'profile' | 'report'
    author_role: 'subject_teacher' | 'class_teacher' | 'head_teacher'
    title: string | null
    remark_text: string
    status: 'draft' | 'published' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
    author?: {
        id: number
        name: string
    }
}

export const getLearnerRemarks = async (studentId: string, termId?: number) => {
    try {
        const response = await api.get(`/learners/${studentId}/remarks`, {
            params: { term_id: termId }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createLearnerRemark = async (studentId: string, data: {
    term_id: number
    type: 'formative' | 'profile' | 'report'
    remark_text: string
    title?: string
}) => {
    try {
        const response = await api.post(`/learners/${studentId}/remarks`, data)
        return response.data
    } catch (error) {
        throw error
    }
}
