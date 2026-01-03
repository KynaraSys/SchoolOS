import api from '@/lib/api';

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
}

export interface CreateRoleDTO {
    name: string;
    permissions?: string[]; // Array of permission names
}

export interface UpdateRoleDTO {
    name: string;
    permissions?: string[]; // Array of permission names
}

export const getRoles = async () => {
    const response = await api.get<Role[]>('/roles');
    return response.data;
};

export const getRole = async (id: number) => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
};

export const createRole = async (data: CreateRoleDTO) => {
    const response = await api.post<Role>('/roles', data);
    return response.data;
};

export const updateRole = async (id: number, data: UpdateRoleDTO) => {
    const response = await api.put<Role>(`/roles/${id}`, data);
    return response.data;
};

export const deleteRole = async (id: number) => {
    await api.delete(`/roles/${id}`);
};

export const getPermissions = async () => {
    const response = await api.get<Permission[]>('/permissions');
    return response.data;
};
