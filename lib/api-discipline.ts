import api from '@/lib/api';

export interface IncidentType {
    id: number;
    name: string;
    description: string | null;
    severity: 'low' | 'medium' | 'high' | 'critical';
    points: number;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Incident {
    id: number;
    student_id: number;
    reporter_id: number;
    incident_type_id?: number | null; // Added
    assigned_to: number | null;
    closed_by: number | null;
    title: string;
    description: string | null;
    action_taken: string | null;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'under_review' | 'resolved' | 'dismissed' | 'escalated';
    occurred_at: string;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
    student?: any;
    reporter?: any;
    incident_type?: IncidentType; // Added
    assigned_to_user?: any; // mapped from assignedTo relation
    closed_by_user?: any;   // mapped from closedBy relation
}

export const getIncidents = async (studentId?: string | number) => {
    const query = studentId ? `?student_id=${studentId}` : '';
    const response = await api.get<Incident[]>(`/incidents${query}`);
    return response.data;
};

export const createIncident = async (data: any) => {
    const response = await api.post<Incident>('/incidents', data);
    return response.data;
};

export const updateIncident = async (id: number, data: any) => {
    const response = await api.put<Incident>(`/incidents/${id}`, data);
    return response.data;
};

export const getAssignees = async () => {
    const response = await api.get<{ id: number, name: string }[]>('/incidents/assignees');
    return response.data;
};

export const getIncidentTypes = async (): Promise<IncidentType[]> => {
    const response = await api.get('/incident-types/all');
    return response.data;
};

export const getAllIncidentTypesAdmin = async (): Promise<IncidentType[]> => {
    const response = await api.get('/incident-types');
    return response.data;
};

export const createIncidentType = async (data: Partial<IncidentType>): Promise<IncidentType> => {
    const response = await api.post('/incident-types', data);
    return response.data;
};

export const updateIncidentType = async (id: number, data: Partial<IncidentType>): Promise<IncidentType> => {
    const response = await api.put(`/incident-types/${id}`, data);
    return response.data;
};

export const deleteIncidentType = async (id: number): Promise<void> => {
    await api.delete(`/incident-types/${id}`);
};
