"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

import type { User as AppUser } from "@/lib/types/roles";

// Extend AppUser to include RBAC arrays needed for logic
interface AuthUser extends AppUser {
    roles: string[];
    permissions: string[];
}

interface AuthContextType {
    user: AuthUser | null;
    login: (token: string, userData: any) => void; // Modified to accept token + user object direct from login response
    logout: () => void;
    isLoading: boolean;
    hasRole: (role: string | string[]) => boolean;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Init auth from storage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);

        // Listen for storage changes to sync logout across tabs
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'token' && event.newValue === null) {
                setUser(null);
                router.push('/auth/login');
            }
        };

        // Listen for Force Logout events (401/423)
        const handleForceLogout = (event: Event) => {
            const detail = (event as CustomEvent).detail;
            console.warn("Force logout triggered:", detail);
            logout(); // Perform cleanup and redirect
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth:force-logout', handleForceLogout);

        // Heartbeat Check (Every 60s)
        const heartbeat = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token) {
                // Call a lightweight endpoint to verify session validity
                // If this fails with 401/423, the interceptor will trigger force-logout
                api.get('/user').catch(() => { /* handled by interceptor */ });
            }
        }, 60000);

        // Global Unhandled Rejection Handler for 403s
        // This suppresses the "Console AxiosError" when a promise rejection is not caught immediately
        // but is handled by the UI (Toaster) or Interceptor.
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            if (event.reason?.response?.status === 403) {
                event.preventDefault(); // Prevents browser console error logging
            }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth:force-logout', handleForceLogout);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            clearInterval(heartbeat);
        };
    }, [router]);

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);

        // Normalize user data if needed (ensure roles/permissions are arrays of strings)
        // detailed user object from backend includes relations
        const rolesList = userData.roles ? userData.roles.map((r: any) => r.name) : [];
        // Normalize role name: lowercase and replace spaces with underscores to match UserRole type
        // e.g. "Super Admin" -> "super_admin", "Academic Director" -> "academic_director"
        let primaryRole = (rolesList[0]?.toLowerCase().replace(/\s+/g, '_') as any) || "student";

        // Map backend 'Admin' role to 'super_admin' or just keep it if it normalizes correctly.
        // If backend says "Admin", it becomes "admin". strict UserRole might not have "admin".
        // Let's assume Admin -> super_admin for now if "admin" isn't in UserRole, 
        // OR better, add "admin" to UserRole if needed. 
        // But for this specific request: Super Admin -> super_admin.

        if (primaryRole === 'admin') {
            primaryRole = 'super_admin'; // Treat generic Admin as Super Admin
        }

        const normalizedUser: AuthUser = {
            id: String(userData.id), // Ensure string id
            full_name: userData.name,
            email: userData.email,
            role: primaryRole, // Map first role to primary role
            school_id: "default-school", // Placeholder as backend doesn't send this yet
            roles: rolesList,
            permissions: userData.permissions ? userData.permissions.map((p: any) => p.name) : [],

            isClassTeacher: !!userData.is_class_teacher, // Use real backend flag
            is_super_admin: !!userData.is_super_admin,  // Use real backend flag
        };

        // If backend sends flattened arrays already (modified AuthController.php in step 36 sends full relations)
        // Let's rely on what we implemented: 
        // 'user' => $user->load('roles', 'permissions')

        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            router.push('/auth/login');
        }
    };

    const hasRole = (role: string | string[]) => {
        if (!user) return false;

        // Super Admin Flag Override
        if (user.is_super_admin) return true;

        if (!user.roles) return false;

        const userRolesLower = user.roles.map(r => r.toLowerCase());

        const rolesToCheck = Array.isArray(role) ? role : [role];
        // Check if any of the required roles match any of the user's roles (case-insensitive)
        return rolesToCheck.some(r => userRolesLower.includes(r.toLowerCase()));
    };

    const hasPermission = (permission: string) => {
        if (!user) return false;

        // Super Admin Flag Override
        if (user.is_super_admin) return true;

        if (!user.roles) return false;
        const userRolesLower = user.roles.map(r => r.toLowerCase());

        // Legacy check: fallback if is_super_admin is missing but role exists
        if (userRolesLower.includes('super admin') || userRolesLower.includes('super_admin')) return true;

        return user.permissions ? user.permissions.includes(permission) : false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
