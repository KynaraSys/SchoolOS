import { AdmissionWizard } from "@/components/students/admission-wizard/admission-wizard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NewStudentPage() {
    return (
        <div className="container mx-auto py-6">
            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                <AdmissionWizard />
            </Suspense>
        </div>
    );
}
