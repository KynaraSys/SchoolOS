"use client";

import { useState } from "react";
import { LearnerDetailsStep } from "./steps/learner-details-step";
import { GuardianLinkingStep } from "./steps/guardian-linking-step";
import { AdmissionContextStep } from "./steps/admission-context-step";
import { ReviewStep } from "./steps/review-step";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdmissionData = {
    student: {
        first_name: string;
        last_name: string;
        other_names: string;
        dob: string;
        gender: string;
        birth_certificate_number: string;
        entry_level: string; // PP1, PP2, G1, G2, G3
    };
    guardians: {
        guardian_id?: number; // If linking existing
        first_name: string;
        last_name: string;
        phone_number: string;
        relationship: string;
        email?: string;
    }[];
    context: {
        admission_date: string;
        entry_year: string;
        previous_school: string;
        special_needs: boolean;
        medical_notes: string;
        accommodation_notes: string;
        pathway: string; // Age-Based (Default) or Stage-Based
    };
};

const initialData: AdmissionData = {
    student: {
        first_name: "",
        last_name: "",
        other_names: "",
        dob: "",
        gender: "",
        birth_certificate_number: "",
        entry_level: "",
    },
    guardians: [],
    context: {
        admission_date: new Date().toISOString().split("T")[0],
        entry_year: new Date().getFullYear().toString(),
        previous_school: "",
        special_needs: false,
        medical_notes: "",
        accommodation_notes: "",
        pathway: "Age-Based",
    },
};

const steps = [
    { id: 1, title: "Learner Identity" },
    { id: 2, title: "Guardian Linking" },
    { id: 3, title: "Admission Context" },
    { id: 4, title: "Review & Confirm" },
];

export function AdmissionWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<AdmissionData>(initialData);

    const updateData = (section: keyof AdmissionData, payload: any) => {
        setData((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...payload },
        }));
    };

    const updateGuardians = (guardians: AdmissionData["guardians"]) => {
        setData((prev) => ({ ...prev, guardians }));
    }

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="space-y-8">
            {/* Stepper Header */}
            <div className="flex justify-between items-center max-w-3xl mx-auto">
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center flex-1 relative">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-background transition-colors",
                                currentStep >= step.id
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/30 text-muted-foreground"
                            )}
                        >
                            {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                        </div>
                        <span
                            className={cn(
                                "text-xs mt-2 font-medium absolute top-12 w-32 text-center",
                                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {step.title}
                        </span>
                        {/* Progress Bar Line */}
                        {step.id !== steps.length && (
                            <div
                                className={cn(
                                    "absolute top-5 left-1/2 w-full h-[2px] -z-0",
                                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <Card className="p-6 md:p-8 max-w-4xl mx-auto min-h-[400px]">
                    {currentStep === 1 && (
                        <LearnerDetailsStep
                            data={data.student}
                            onUpdate={(updates) => updateData("student", updates)}
                            onNext={nextStep}
                        />
                    )}
                    {currentStep === 2 && (
                        <GuardianLinkingStep
                            data={data.guardians}
                            onUpdate={updateGuardians}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 3 && (
                        <AdmissionContextStep
                            data={data.context}
                            onUpdate={(updates) => updateData("context", updates)}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 4 && (
                        <ReviewStep data={data} onBack={prevStep} />
                    )}
                </Card>
            </div>
        </div>
    );
}
