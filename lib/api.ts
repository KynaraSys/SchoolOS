import axios from 'axios';

const api = axios.create({
    // Use the API proxy route which handles cookie-based auth
    // Auth routes (/api/auth/*) and proxy routes (/api/proxy/*) are handled separately
    baseURL: '/api/proxy',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - no longer needs to add token manually
// The proxy route handles reading the HttpOnly cookie and adding the Bearer token
api.interceptors.request.use((config) => {
    // Token is now handled by the server-side proxy via HttpOnly cookie
    // No localStorage access needed - this prevents XSS token theft
    return config;
});


import { toast } from '@/components/ui/use-toast';

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Prevent toast for 401/423 if handled locally (optional, but requested "any error")
        // The user said "any error notification... should appear as toast".
        // Local handlers might show inline alerts. Toasts are non-blocking so duplicate is okay-ish,
        // but let's try to be smart.
        // Actually, often local catch blocks might consume the error. 
        // If we throw, the local catch block runs. 

        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        const status = error.response?.status;

        // Skip 401/423 if we want login form to handle them exclusively?
        // But user said "no credentials working", implying they want to SEE why.
        // So showing toast is safer.
        if (typeof window !== 'undefined') {
            // Suppress console error for 403 (Forbidden) and 401 (Unauthorized) as they are handled by UI/Auth logic
            // Using loose, lenient equality check to handle potential string/number mismatches
            if (status != 403 && status != 401) {
                console.error(`API Error URL: ${error.config?.url} | Status: ${status}`);
            }

            // Dispatch global event for auth errors
            if (status === 401 || status === 423) {
                window.dispatchEvent(new CustomEvent('auth:force-logout', {
                    detail: { reason: message, status }
                }));
            }

            // Show toast for errors, but skip 401 as it triggers a redirect (avoid UI clutter)
            if (status !== 401) {
                toast({
                    variant: "destructive",
                    title: status ? `Error ${status}` : "Error",
                    description: message,
                });
            }
        }

        return Promise.reject(error);
    }
);

export default api;
