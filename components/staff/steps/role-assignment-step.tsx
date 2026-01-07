"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffFormData } from "../onboarding-wizard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StepProps {
    data: StaffFormData;
    update: (data: Partial<StaffFormData>) => void;
}

type Role = {
    id: number;
    name: string;
    guard_name: string;
};

export function RoleAssignmentStep({ data, update }: StepProps) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch roles from API
        const fetchRoles = async () => {
            try {
                const res = await fetch('/api/roles');
                if (res.ok) {
                    const json = await res.json();
                    // Filter out 'Student' and 'Parent' roles if implementation allows, 
                    // or rely on backend scope. But for UI clarity, let's show all available to staff.
                    // Typically 'Student' and 'Parent' shouldn't be assigned here manually unless spec allows.
                    // Spec says "Roles define capabilities... Role-Specific Metadata".
                    // Let's filter out Student/Parent to be safe as per "Staff ≠ User Account" constraint context.
                    // Although User model has relationship to Student, Staff is usually separate.
                    setRoles(json.data.filter((r: Role) => !['Student', 'Parent'].includes(r.name)));
                }
            } catch (error) {
                console.error("Failed to fetch roles", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const toggleRole = (roleName: string) => {
        const currentRoles = data.roles || [];
        if (currentRoles.includes(roleName)) {
            update({ roles: currentRoles.filter(r => r !== roleName) });
        } else {
            update({ roles: [...currentRoles, roleName] });
        }
    };

    if (!data.grant_system_access) {
        return (
            <div className="text-center p-8 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">System access is disabled. No roles can be assigned.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Assign Roles</h3>
                <p className="text-sm text-muted-foreground">
                    Select one or more roles for this staff member. Roles determine what they can see and do in the system.
                </p>
            </div>

            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <ScrollArea className="h-[300px] border rounded-md p-4 bg-background">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className={`flex items-start space-x-3 p-3 rounded-md border transition-colors ${data.roles.includes(role.name) ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                            >
                                <Checkbox
                                    id={`role-${role.id}`}
                                    checked={data.roles.includes(role.name)}
                                    onCheckedChange={() => toggleRole(role.name)}
                                />
                                <div className="space-y-1">
                                    <Label
                                        htmlFor={`role-${role.id}`}
                                        className="font-medium cursor-pointer"
                                    >
                                        {role.name}
                                    </Label>
                                    {/* Optional: Add role description if available from API */}
                                    {['Admin', 'Principal'].includes(role.name) && (
                                        <p className="text-xs text-amber-600 font-medium flex items-center mt-1">
                                            <AlertCircle className="w-3 h-3 mr-1" /> High Privilege
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {data.roles.includes('Teacher') && (
                <Alert>
                    <AlertTitle>Teacher Role Selected</AlertTitle>
                    <AlertDescription>
                        You can assign specific classes and subjects after the account is created, via the "Class Assignments" tab in their profile.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
