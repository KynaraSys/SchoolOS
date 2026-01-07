import { OnboardingWizard } from "@/components/staff/onboarding-wizard";
import { PageHeader } from "@/components/layout/page-header";

export default function StaffCreatePage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <PageHeader
                title="Staff Onboarding"
                description="Create a new staff record and optionally assign system access."
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Staff", href: "/admin/staff" },
                    { label: "Onboard Staff", href: "#", active: true },
                ]}
            />

            <OnboardingWizard />
        </div>
    );
}
