"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import Link from "next/link"
import LinkedStudents from "@/components/guardians/linked-students"
import GuardianProfile from "@/components/guardians/guardian-profile"
import FinancialSummary from "@/components/guardians/financial-summary"
import AccessSecurity from "@/components/guardians/access-security"
import FinanceTab from "@/components/guardians/finance-tab"
import CommunicationTab from "@/components/guardians/communication-tab"
import { Loader2, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SendMessageDialog from "@/components/guardians/send-message-dialog"
import NotesTab from "@/components/guardians/notes-tab"
import DocumentsTab from "@/components/guardians/documents-tab"
import ActivityTab from "@/components/guardians/activity-tab"

export default function GuardianDetailPage() {
    const { user, isLoading: authLoading } = useAuth()
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [guardian, setGuardian] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchGuardian = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/guardians/${params.id}`)
            setGuardian(response.data)
        } catch (error) {
            console.error("Failed to fetch guardian", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load guardian details.",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchGuardian()
        }
    }, [params.id])

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!guardian) {
        return (
            <AppShell user={user || undefined}>
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                    <p className="text-muted-foreground">Guardian not found.</p>
                    <Button variant="outline" onClick={() => router.push("/guardians")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                    </Button>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell user={user || undefined}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/guardians")}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">Guardian Profile</h1>
                    </div>
                    <div className="flex gap-2">
                        <SendMessageDialog
                            guardianId={parseInt(params.id as string)}
                            students={guardian?.students}
                        />
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="students">Linked Students</TabsTrigger>
                        <TabsTrigger value="finance">Finance</TabsTrigger>
                        <TabsTrigger value="communication">Communication</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="security">Access & Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <GuardianProfile guardian={guardian} onUpdate={fetchGuardian} />
                        {guardian.financial_summary && (
                            <FinancialSummary
                                summary={guardian.financial_summary}
                                students={guardian.students || []}
                                guardianId={guardian.id}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="students" className="space-y-4">
                        <LinkedStudents
                            students={guardian.students || []}
                            guardianId={guardian.id}
                            onUpdate={fetchGuardian}
                        />
                    </TabsContent>

                    <TabsContent value="finance" className="space-y-4">
                        <FinanceTab guardian={guardian} />
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-4">
                        <CommunicationTab guardian={guardian} />
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                        <DocumentsTab guardian={guardian} />
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-4">
                        <NotesTab guardian={guardian} />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <AccessSecurity guardian={guardian} onUpdate={fetchGuardian} />
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4">
                        <ActivityTab guardian={guardian} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppShell>
    )
}
