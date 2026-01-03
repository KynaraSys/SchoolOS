"use client"

import { useEffect, useState } from "react"
import FinancialSummary from "@/components/guardians/financial-summary"
import ProjectContributions from "@/components/guardians/project-contributions"
import PaymentHistoryTable from "@/components/guardians/payment-history-table"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"

interface FinanceTabProps {
    guardian: any
}

export default function FinanceTab({ guardian }: FinanceTabProps) {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/guardians/${guardian.id}/payments`)
                setPayments(res.data.data)
            } catch (error) {
                console.error("Failed to fetch payments", error)
            } finally {
                setLoading(false)
            }
        }

        if (guardian.id) {
            fetchPayments()
        }
    }, [guardian.id])

    return (
        <div className="space-y-6">
            {/* 1. Financial Summary */}
            {guardian.financial_summary ? (
                <FinancialSummary
                    summary={guardian.financial_summary}
                    students={guardian.students || []}
                    guardianId={guardian.id}
                />
            ) : (
                <div className="p-4 border rounded-md bg-muted/20 text-center text-muted-foreground">
                    No financial data available.
                </div>
            )}

            {/* 2. Project Contributions */}
            <ProjectContributions />

            {/* 3. Payment History Logs */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Payment History Logs</h3>
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <PaymentHistoryTable payments={payments} />
                )}
            </div>
        </div>
    )
}
