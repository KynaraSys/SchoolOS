import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import IncidentPoliciesClientPage from "./policies-client-page"

export default async function IncidentPoliciesPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token || !token.value) {
        redirect("/auth/login");
    }

    return <IncidentPoliciesClientPage />
}
