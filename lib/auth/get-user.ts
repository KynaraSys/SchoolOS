import { cookies } from "next/headers"
import type { User } from "@/lib/types/roles";

/**
 * Retrieves the current logged-in user from the server-side session.
 * Now primarily checks for the 'auth_token' cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')

  if (!token) {
    return null
  }

  // Attempt to fetch user details from backend using the token
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${backendUrl}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json',
      },
      // Ensure we don't cache this too aggressively or manage cache tags
      cache: 'no-store'
    });

    if (response.ok) {
      const userData = await response.json();

      // Normalize role
      const rolesList = userData.roles ? userData.roles.map((r: any) => r.name) : [];
      let primaryRole = (rolesList[0]?.toLowerCase().replace(/\s+/g, '_')) || "student";
      if (primaryRole === 'admin') primaryRole = 'super_admin';

      return {
        id: String(userData.id),
        full_name: userData.name,
        email: userData.email,
        role: primaryRole,
        school_id: "default-school",
        isClassTeacher: !!userData.is_class_teacher,
      };
    }
  } catch (e) {
    console.error("Failed to fetch user in getCurrentUser", e);
  }

  return null;
}
