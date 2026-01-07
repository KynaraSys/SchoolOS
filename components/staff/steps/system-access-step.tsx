"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffFormData } from "../onboarding-wizard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface StepProps {
    data: StaffFormData;
    update: (data: Partial<StaffFormData>) => void;
}

export function SystemAccessStep({ data, update }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-start space-x-3 border p-4 rounded-md">
                <Checkbox
                    id="grant_access"
                    checked={data.grant_system_access}
                    onCheckedChange={(checked) => update({ grant_system_access: checked as boolean })}
                />
                <div className="space-y-1 leading-none">
                    <Label htmlFor="grant_access" className="font-semibold">Grant System Access</Label>
                    <p className="text-sm text-muted-foreground">
                        Create a user account for this staff member to log in.
                    </p>
                </div>
            </div>

            {data.grant_system_access && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <Label>Phone Number (Login ID) <span className="text-red-500">*</span></Label>
                        <Input
                            value={data.phone}
                            onChange={(e) => update({ phone: e.target.value })}
                            placeholder="e.g. +2547..."
                        />
                        <p className="text-xs text-muted-foreground">This will be used as the primary login identifier.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Email Address (Optional)</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => update({ email: e.target.value })}
                            placeholder="e.g. john@school.com"
                        />
                        <p className="text-xs text-muted-foreground">Used for notifications and password recovery.</p>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <Alert className="bg-blue-50/50 border-blue-200">
                            <Info className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800">Automatic Password Generation</AlertTitle>
                            <AlertDescription className="text-blue-700">
                                A secure temporary password will be automatically generated and sent to the staff member's phone number upon creation. They will be required to change it on first login.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}
        </div>
    );
}
