"use client";

import { Button } from "@/components/ui/button";
import { AdmissionData } from "../admission-wizard";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from "@/lib/api";

interface StepProps {
    data: AdmissionData;
    onBack: () => void;
}

export function ReviewStep({ data, onBack }: StepProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Transform data to match backend validation structure
            // Backend expects admission_date, special_needs, etc. in student object
            const payload = {
                student: {
                    ...data.student,
                    admission_date: data.context.admission_date,
                    previous_school: data.context.previous_school,
                    special_needs: data.context.special_needs,
                    medical_notes: data.context.medical_notes,
                    accommodation_notes: data.context.accommodation_notes,
                    pathway: data.context.pathway,
                },
                guardians: data.guardians,
            };

            const res = await api.post("/admissions", payload);

            toast({
                title: "Admission Successful",
                description: `Student ${data.student.first_name} has been admitted.`,
            });
            // Redirect to student profile
            router.push(`/students/${res.data.student.id}`);
        } catch (error: any) {
            console.error("Admission error:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.errors || "Please check your inputs and try again.";

            toast({
                variant: "destructive",
                title: "Admission Failed",
                description: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Review & Confirm</h2>
                <p className="text-muted-foreground text-sm">
                    Please verify all details before creating the learner profile.
                </p>
            </div>

            <div className="space-y-6 text-sm">

                {/* Learner Summary */}
                <div className="border rounded-lg p-4 bg-muted/20">
                    <h3 className="font-semibold mb-2 text-primary">Learner Identity</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div>First Name: <strong>{data.student.first_name}</strong></div>
                        <div>Last Name: <strong>{data.student.last_name}</strong></div>
                        <div>Other Names: {data.student.other_names || "-"}</div>
                        <div>DOB: {data.student.dob}</div>
                        <div>Gender: {data.student.gender}</div>
                        <div>Level: {data.student.entry_level}</div>
                    </div>
                </div>

                {/* Guardian Summary */}
                <div className="border rounded-lg p-4 bg-muted/20">
                    <h3 className="font-semibold mb-2 text-primary">Guardians ({data.guardians.length})</h3>
                    {data.guardians.map((g, i) => (
                        <div key={i} className="mb-2 last:mb-0 pl-2 border-l-2 border-primary/20">
                            <p className="font-medium">{g.first_name} {g.last_name} ({g.relationship})</p>
                            <p className="text-muted-foreground">{g.phone_number}</p>
                        </div>
                    ))}
                </div>

                {/* Context Summary */}
                <div className="border rounded-lg p-4 bg-muted/20">
                    <h3 className="font-semibold mb-2 text-primary">Admission Context</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div>Entry Year: {data.context.entry_year}</div>
                        <div>Admission Date: {data.context.admission_date}</div>
                        <div>SEN Status: <strong>{data.context.special_needs ? "Yes" : "No"}</strong></div>
                        {data.context.special_needs && (
                            <>
                                <div className="col-span-2 mt-2">
                                    <span className="font-medium">Pathway:</span> {data.context.pathway}
                                </div>
                                <div className="col-span-2 text-xs italic text-muted-foreground">
                                    Includes accommodation notes.
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>

            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Final Check</AlertTitle>
                <AlertDescription>
                    This action will create a permanent learner profile. No user account will be created.
                </AlertDescription>
            </Alert>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Back</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Admitting..." : "Confirm & Admit Learner"}
                </Button>
            </div>
        </div>
    );
}
