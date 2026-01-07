"use client";

import { StaffFormData } from "../onboarding-wizard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface StepProps {
    data: StaffFormData;
}

export function ReviewStep({ data }: StepProps) {
    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{title}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                {children}
            </div>
            <div className="border-b my-4" />
        </div>
    );

    const Item = ({ label, value }: { label: string, value: string | undefined | null | React.ReactNode }) => (
        <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className="font-medium">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm">
                    Please review the information below carefully. Once submitted, the staff record will be created and notification sent if system access is granted.
                </p>
            </div>

            <Section title="Identity & Employment">
                <Item label="Full Name" value={`${data.first_name} ${data.last_name}`} />
                <Item label="Staff Number" value={data.staff_number} />
                <Item label="National ID" value={data.national_id_number} />
                <Item label="Employment Type" value={<Badge variant="outline">{data.employment_type}</Badge>} />
                <Item label="Start Date" value={data.start_date ? format(data.start_date, "PPP") : '-'} />
                <Item label="Qualification" value={data.qualification} />
            </Section>

            <Section title="System Access">
                <Item label="Access Granted" value={data.grant_system_access ? <Badge className="bg-green-600">Yes</Badge> : <Badge variant="secondary">No</Badge>} />
                {data.grant_system_access && (
                    <>
                        <Item label="Login Phone" value={data.phone} />
                        <Item label="Email" value={data.email} />
                    </>
                )}
            </Section>

            {data.grant_system_access && (
                <Section title="Assigned Roles">
                    <div className="col-span-2">
                        {data.roles.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {data.roles.map(role => (
                                    <Badge key={role} variant="secondary">{role}</Badge>
                                ))}
                            </div>
                        ) : (
                            <span className="text-yellow-600 text-sm italic">No roles assigned (User will have no permissions)</span>
                        )}
                    </div>
                </Section>
            )}
        </div>
    );
}
