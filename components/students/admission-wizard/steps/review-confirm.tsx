"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export function ReviewStep() {
    const { getValues } = useFormContext();
    const values = getValues();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-semibold text-center mb-6">Review Admission Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/50">
                    <CardHeader><CardTitle className="text-base text-blue-600">Learner Identity</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Full Name:</span> <span className="font-semibold">{values.firstName} {values.otherNames} {values.lastName}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Gender:</span> <span>{values.gender}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">DoB:</span> <span>{values.dob ? format(values.dob, 'PPP') : '-'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Birth Cert:</span> <span>{values.birthCertificateNumber || 'N/A'}</span></div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50">
                    <CardHeader><CardTitle className="text-base text-green-600">Admission Context</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Entry Level:</span> <span className="font-bold">{values.entryLevel}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Date:</span> <span>{values.admissionDate ? format(values.admissionDate, 'PPP') : '-'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Pathway:</span> <span className="capitalize">{values.pathway?.replace('_', ' ')}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">SEN Status:</span> <span>{values.hasSpecialNeeds ? 'Yes' : 'None'}</span></div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/50">
                <CardHeader><CardTitle className="text-base text-purple-600">Guardians ({values.guardians?.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {values.guardians?.map((g: any, i: number) => (
                        <div key={i} className="text-sm border-b last:border-0 pb-2 mb-2">
                            <div className="font-semibold">{g.firstName} {g.lastName} <span className="text-xs text-muted-foreground">({g.relationship})</span></div>
                            <div className="text-muted-foreground">{g.phone} {g.isPrimary && <span className="text-green-600 font-bold ml-2">[Primary]</span>}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                <span>⚠️</span>
                <p>By confirming this admission, you certify that the data collected is minimized for educational interest and complies with Data Protection regulations.</p>
            </div>
        </div>
    );
}
