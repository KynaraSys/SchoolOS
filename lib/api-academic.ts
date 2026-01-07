import api from '@/lib/api';
import { SchoolClass, Subject, Term, CreateClassDTO, CreateSubjectDTO, CreateTermDTO } from '@/lib/types/academic';

// Classes
export const getClasses = async () => {
    const response = await api.get<any[]>('/classes');
    return response.data.map(cls => ({
        ...cls,
        currentTeacher: cls.current_teacher
    })) as SchoolClass[];
};

export const getClass = async (id: number) => {
    const response = await api.get<any>(`/classes/${id}`);
    const data = response.data;
    return {
        ...data,
        currentTeacher: data.current_teacher
    } as SchoolClass;
};

export const createClass = async (data: CreateClassDTO) => {
    const response = await api.post<SchoolClass>('/classes', data);
    return response.data;
};

export const updateClass = async (id: number, data: Partial<CreateClassDTO>) => {
    const response = await api.put<SchoolClass>(`/classes/${id}`, data);
    return response.data;
};

export const deleteClass = async (id: number) => {
    await api.delete(`/classes/${id}`);
};

// Subjects
export const getSubjects = async () => {
    const response = await api.get<Subject[]>('/subjects');
    return response.data;
};

export const getSubject = async (id: number) => {
    const response = await api.get<Subject>(`/subjects/${id}`);
    return response.data;
};

export const createSubject = async (data: CreateSubjectDTO) => {
    const response = await api.post<Subject>('/subjects', data);
    return response.data;
};

export const updateSubject = async (id: number, data: Partial<CreateSubjectDTO>) => {
    const response = await api.put<Subject>(`/subjects/${id}`, data);
    return response.data;
};

export const deleteSubject = async (id: number) => {
    await api.delete(`/subjects/${id}`);
};

// Terms
export const getTerms = async () => {
    const response = await api.get<Term[]>('/terms');
    return response.data;
};

export const getTerm = async (id: number) => {
    const response = await api.get<Term>(`/terms/${id}`);
    return response.data;
};

export const createTerm = async (data: CreateTermDTO) => {
    const response = await api.post<Term>('/terms', data);
    return response.data;
};

export const updateTerm = async (id: number, data: Partial<CreateTermDTO>) => {
    const response = await api.put<Term>(`/terms/${id}`, data);
    return response.data;
};

export const deleteTerm = async (id: number) => {
    await api.delete(`/terms/${id}`);
};
