import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { RolesList } from "@/components/roles/roles-list"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default async function RolesPage() {
    // Server-side check for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token || !token.value) {
        redirect("/auth/login");
    }

    return (
        <div className="space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Roles</CardTitle>
                    <CardDescription>Manage user roles and their associated permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RolesList />
                </CardContent>
            </Card>

        </div>
    )
}
