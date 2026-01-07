import api from './api';

export interface GradingScale {
    id: number;
    indicator: string;
    descriptor: string;
    min_score?: number;
    max_score?: number;
    color_hex: string;
    type: 'pure' | 'hybrid';
}

export interface AssessmentPayload {
    student_id: number;
    subject_id?: number | null;
    competency_id?: number | null;
    assessment_type: 'pure_cbe' | 'hybrid';
    tool_type: 'observation' | 'project' | 'written_test' | 'checklist';
    raw_score?: number;
    performance_level?: string;
    teacher_remarks?: string;
    evidence_files?: File[];
    assessed_at: string;
}

export const assessmentApi = {
    getGradingScales: async (type?: 'pure' | 'hybrid') => {
        const response = await api.get(`/grading-scales${type ? `?type=${type}` : ''}`);
        return response.data;
    },

    storeAssessment: async (data: AssessmentPayload) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'evidence_files' && Array.isArray(value)) {
                value.forEach((file) => formData.append('evidence_files[]', file));
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        const response = await api.post('/assessments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAssessments: async (params: { student_id?: number; subject_id?: number }) => {
        const response = await api.get('/assessments', { params });
        return response.data;
    }
};
