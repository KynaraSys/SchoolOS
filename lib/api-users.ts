import api from '@/lib/api';
import { User, CreateUserDTO, UpdateUserDTO, AssignClassDTO, Role } from '@/lib/types/user';

export const getUsers = async (page = 1, all = false) => {
    const query = all ? '?all=true' : `?page=${page}`;
    const response = await api.get<any>(`/users${query}`);
    return response.data; // Returns array if all=true, Paginator if not
};

export const getUser = async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
};

export const createUser = async (data: CreateUserDTO) => {
    const response = await api.post<User>('/users', data);
    return response.data;
};

export const updateUser = async (id: number, data: UpdateUserDTO) => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
};

export const assignClassTeacher = async (userId: number, data: AssignClassDTO) => {
    const response = await api.post(`/users/${userId}/assign-class`, data);
    return response.data;
};

export const getRoles = async () => {
    const response = await api.get<Role[]>('/roles');
    return response.data;
};

export const getStudents = async () => {
    const response = await api.get<any[]>('/students');
    return response.data;
};

export const createStudent = async (data: any) => {
    const response = await api.post<any>('/students', data);
    return response.data;
};

export const getStudentProfile = async (id: string) => {
    const response = await api.get<any>(`/students/${id}`);
    return response.data;
};

export const updateStudent = async (id: string, data: any) => {
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const response = await api.post<any>(`/students/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
    const response = await api.put<any>(`/students/${id}`, data);
    return response.data;
};

export const importStudents = async (formData: FormData) => {
    const response = await api.post<any>('/students/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const exportStudents = async () => {
    const response = await api.get('/students/export', {
        responseType: 'blob',
    });
    return response.data;
};

export const deleteStudent = async (id: string) => {
    // Determine source from ID or context? 
    // The backend Route::apiResource('students') maps DELETE to specific logic.
    // Ideally we use /students/{id} to leverage the StudentController::destroy we just made.
    await api.delete(`/students/${id}`);
};

export const getGuardians = async (search: string) => {
    const response = await api.get<any>(`/guardians?search=${search}`);
    return response.data.data; // Assuming paginate response wraps in data
};
