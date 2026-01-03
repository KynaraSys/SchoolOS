"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Download } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import PaymentHistoryTable from "@/components/guardians/payment-history-table"

export default function PaymentHistoryPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [guardianName, setGuardianName] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Fetch Guardian Basic Info for Title
                const guardianRes = await api.get(`/guardians/${params.id}`)
                setGuardianName(`${guardianRes.data.first_name} ${guardianRes.data.last_name}`)

                // Fetch Payments
                const paymentRes = await api.get(`/guardians/${params.id}/payments`)
                setPayments(paymentRes.data.data)
            } catch (error) {
                console.error("Failed to load payment history", error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load payment history.",
                })
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchData()
        }
    }, [params.id])

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AppShell user={user || undefined}>
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
                            <p className="text-muted-foreground">
                                For {guardianName}
                            </p>
                        </div>
                    </div>
                    {/* Placeholder for export/print */}
                    {/* <Button variant="outline" size="sm">
                       <Download className="mr-2 h-4 w-4" /> Export
                   </Button> */}
                </div>

                <PaymentHistoryTable payments={payments} />
            </div>
        </AppShell>
    )
}
