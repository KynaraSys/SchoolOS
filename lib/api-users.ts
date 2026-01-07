import api from '@/lib/api';
import { User, CreateUserDTO, UpdateUserDTO, AssignClassDTO, Role } from '@/lib/types/user';

export const getUsers = async (
    page = 1,
    all = false,
    filters: { type?: string; role?: string; search?: string } = {}
) => {
    const queryParams = new URLSearchParams();
    if (all) {
        queryParams.append('all', 'true');
    } else {
        queryParams.append('page', page.toString());
    }

    if (filters.type) queryParams.append('type', filters.type);
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.search) queryParams.append('search', filters.search);

    const response = await api.get<any>(`/users?${queryParams.toString()}`);

    // Map snake_case to camelCase for array response
    if (all && Array.isArray(response.data)) {
        return response.data.map((u: any) => ({
            ...u,
            classTeacherAssignments: u.class_teacher_assignments
        }));
    }

    return response.data; // Returns Paginator if not all=true
};

export const getUser = async (id: number) => {
    const response = await api.get<any>(`/users/${id}`);
    const data = response.data;

    // Map snake_case to camelCase for specific relationships
    if (data.class_teacher_assignments) {
        data.classTeacherAssignments = data.class_teacher_assignments.map((assignment: any) => ({
            ...assignment,
            schoolClass: assignment.school_class
        }));

        // Infer isClassTeacher from assignments
        data.isClassTeacher = data.classTeacherAssignments.length > 0;
    }

    return data as User;
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

export const unassignClassTeacher = async (userId: number, assignmentId: number) => {
    const response = await api.delete(`/users/${userId}/assign-class/${assignmentId}`);
    return response.data;
};

export const getRoles = async () => {
    const response = await api.get<Role[]>('/roles');
    return response.data;
};

export const getStudents = async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get<any[]>(`/students?${query}`);
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
