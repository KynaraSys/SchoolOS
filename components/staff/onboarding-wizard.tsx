"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdentityStep } from "./steps/identity-step";
import { SystemAccessStep } from "./steps/system-access-step";
import { RoleAssignmentStep } from "./steps/role-assignment-step";
import { ReviewStep } from "./steps/review-step";
import { Stepper } from "@/components/ui/stepper"; // Assuming a stepper component exists or I'll implement a simple one
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export type StaffFormData = {
    // Identity
    first_name: string;
    last_name: string;
    national_id_number: string;
    staff_number: string;
    employment_type: string;
    start_date: Date | undefined;
    end_date: Date | undefined;

    // Professional
    qualification: string;
    tsc_number: string;
    specialization: string;

    // Access
    phone: string;
    email: string;
    is_active: boolean;
    grant_system_access: boolean;

    // Roles
    roles: string[];
};

const INITIAL_DATA: StaffFormData = {
    first_name: "",
    last_name: "",
    national_id_number: "",
    staff_number: "",
    employment_type: "Permanent",
    start_date: new Date(),
    end_date: undefined,
    qualification: "",
    tsc_number: "",
    specialization: "",
    phone: "",
    email: "",
    is_active: true,
    grant_system_access: true,
    roles: [],
};

const STEPS = [
    { label: "Identity & Employment", description: "Basic details" },
    { label: "System Access", description: "Login credentials" },
    { label: "Roles & Permissions", description: "Access control" },
    { label: "Review", description: "Confirm details" },
];

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<StaffFormData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const updateData = (data: Partial<StaffFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const next = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Transform Date objects to YYYY-MM-DD
            const payload = {
                ...formData,
                start_date: formData.start_date?.toISOString().split('T')[0],
                end_date: formData.end_date?.toISOString().split('T')[0],
                // If grant_system_access is false, maybe clear phone/email or backend handles it? 
                // In our backend logic, phone is required for System Access. 
                // If user unchecks access, we might skip sending phone to User creation logic, but Staff model might still want it?
                // For now, send everything.
            };

            const response = await fetch("/api/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to onboard staff");
            }

            toast({ title: "Success", description: "Staff member onboarded successfully." });
            router.push("/admin/staff");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Custom Stepper Visualization */}
            <div className="flex justify-between">
                {STEPS.map((step, index) => (
                    <div key={index} className={`flex flex-col items-center gap-2 ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${index <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                            {index + 1}
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                    </div>
                ))}
            </div>

            <Card className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-1">{STEPS[currentStep].label}</h2>
                    <p className="text-muted-foreground text-sm">{STEPS[currentStep].description}</p>
                </div>

                <div className="space-y-6">
                    {currentStep === 0 && <IdentityStep data={formData} update={updateData} />}
                    {currentStep === 1 && <SystemAccessStep data={formData} update={updateData} />}
                    {currentStep === 2 && <RoleAssignmentStep data={formData} update={updateData} />}
                    {currentStep === 3 && <ReviewStep data={formData} />}
                </div>

                <div className="mt-8 flex justify-between pt-4 border-t">
                    <Button variant="outline" onClick={back} disabled={currentStep === 0 || isSubmitting}>
                        Back
                    </Button>

                    {currentStep === STEPS.length - 1 ? (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Onboarding..." : "Confirm & Create Staff"}
                        </Button>
                    ) : (
                        <Button onClick={next}>Continue</Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
