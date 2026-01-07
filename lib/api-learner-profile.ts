import api from "./api";

export interface LearnerProfile {
    student: any;
    cbe_profile: {
        id: number;
        strengths: string;
        areas_for_support: string;
        social_emotional_notes: string;
        talents_interests: string;
        teacher_general_remarks: string;
    } | null;
    attendance_summary: any;
    competency_progress: any;
    academic_progress: {
        subject: string;
        teacher: string;
        indicator: string;
        trend: string;
    }[];
    evidence_portfolio: any[];
    discipline_summary: any;
}

export const getLearnerProfile = async (id: string): Promise<LearnerProfile> => {
    const response = await api.get(`/learners/${id}/profile`);
    return response.data;
};

export const updateLearnerProfile = async (id: string, data: any) => {
    const response = await api.post(`/learners/${id}/profile`, data);
    return response.data;
};

// Retention Management
export const archiveStudent = async (id: string) => {
    const response = await api.post(`/learners/${id}/archive`);
    return response.data;
};

export const anonymizeStudent = async (id: string) => {
    const response = await api.post(`/learners/${id}/anonymize`);
    return response.data;
};

export const restoreStudent = async (id: string) => {
    const response = await api.post(`/learners/${id}/restore`);
    return response.data;
};

export const softDeleteStudent = async (id: string) => {
    const response = await api.delete(`/learners/${id}`);
    return response.data;
};
