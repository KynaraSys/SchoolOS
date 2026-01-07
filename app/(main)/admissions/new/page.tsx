import { AdmissionWizard } from "@/components/admissions/admission-wizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Student Admission | SchoolOS",
    description: "Admit a new learner into the CBC program.",
};

export default function NewAdmissionPage() {
    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">New Student Admission</h1>
                <p className="text-muted-foreground mt-2">
                    Onboard a new learner. This process focuses on competency readiness and guardian linking.
                    No academic sorting or scoring is applied.
                </p>
            </div>

            <AdmissionWizard />
        </div>
    );
}
