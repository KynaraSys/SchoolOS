"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema, AdmissionValues } from "@/lib/validations/admission";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LearnerDetailsStep } from "./steps/learner-details";
import { GuardianLinkingStep } from "./steps/guardian-linking";
import { AdmissionContextStep } from "./steps/admission-context";
import { SenStep } from "./steps/sen-differentiation";
import { ReviewStep } from "./steps/review-confirm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, User, Users, School, HeartHandshake, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { id: 1, title: "Learner Identity", icon: User },
    { id: 2, title: "Guardian Linking", icon: Users },
    { id: 3, title: "Admission Context", icon: School },
    { id: 4, title: "SEN & Pathway", icon: HeartHandshake },
    { id: 5, title: "Review & Admit", icon: FileCheck },
];

export function AdmissionWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const methods = useForm<AdmissionValues>({
        resolver: zodResolver(admissionSchema),
        mode: "onChange",
        defaultValues: {
            gender: "Male", // Default
            pathway: "age_based",
            hasSpecialNeeds: false,
            guardians: [],
            admissionDate: new Date(),
        },
    });

    const { trigger, handleSubmit, watch } = methods;

    const nextStep = async () => {
        // Validate current step fields before moving
        let fieldsToValidate: any[] = [];
        if (currentStep === 1) fieldsToValidate = ["firstName", "lastName", "dob", "gender"];
        if (currentStep === 2) fieldsToValidate = ["guardians"];
        if (currentStep === 3) fieldsToValidate = ["entryLevel", "admissionDate"];
        if (currentStep === 4) fieldsToValidate = ["hasSpecialNeeds", "pathway"];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data: AdmissionValues) => {
        setIsSubmitting(true);
        try {
            // Transform data for API if needed
            const payload = {
                first_name: data.firstName,
                last_name: data.lastName,
                other_names: data.otherNames,
                dob: data.dob.toISOString().split('T')[0],
                gender: data.gender,
                birth_certificate_number: data.birthCertificateNumber,
                entry_level: data.entryLevel,
                admission_date: data.admissionDate.toISOString().split('T')[0],
                previous_school: data.previousSchool,
                special_needs: data.hasSpecialNeeds,
                pathway: data.pathway,
                medical_notes: data.medicalConditions,
                special_needs_notes: data.accommodationNotes,
                guardians: data.guardians.map(g => ({
                    guardian_id: g.guardianId || null,
                    first_name: g.firstName,
                    last_name: g.lastName,
                    phone_number: g.phone,
                    email: g.email || null,
                    relationship: g.relationship,
                    is_primary: g.isPrimary
                }))
            };

            // TODO: If guardian is new (no ID), might need to create guardian first or handle in one go (if API supports).
            // Current API expects existing Guardian ID. 
            // For this implementation, we will assume the step 2 UI handles creating a guardian and getting an ID back BEFORE final submit,
            // OR we adjust API to accept new guardian data.
            // Based on strict plan, we link.

            const response = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to admit student");
            }

            const student = await response.json();

            toast({
                title: "Admission Successful",
                description: `Student ${student.first_name} admitted with Number: ${student.admission_number}`,
            });

            router.push(`/students/${student.id}`);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Admission Failed",
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    New Student Admission
                </h1>
                <p className="text-muted-foreground">Digital onboarding for Early Years & Lower Primary</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full" />
                {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                                isActive ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md scale-110" :
                                    isCompleted ? "border-green-500 bg-green-50 text-green-600" : "border-gray-200 text-gray-400"
                            )}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                isActive ? "text-blue-700" : isCompleted ? "text-green-600" : "text-gray-400"
                            )}>{step.title}</span>
                        </div>
                    )
                })}
            </div>

            <Card className="border-none shadow-lg glass-card">
                <CardContent className="p-6">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="min-h-[400px]">
                                {currentStep === 1 && <LearnerDetailsStep />}
                                {currentStep === 2 && <GuardianLinkingStep />}
                                {currentStep === 3 && <AdmissionContextStep />}
                                {currentStep === 4 && <SenStep />}
                                {currentStep === 5 && <ReviewStep />}
                            </div>

                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1 || isSubmitting}
                                >
                                    Back
                                </Button>

                                {currentStep < 5 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Next Step <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
                                    >
                                        {isSubmitting ? "Admitting..." : "Confirm Admission"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>

            {/* CBC Context Footer */}
            <div className="mt-8 text-center text-xs text-muted-foreground flex justify-center gap-4">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Competency Based</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Non-Exam Admission</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Guardian-Centric</span>
            </div>
        </div>
    );
}
