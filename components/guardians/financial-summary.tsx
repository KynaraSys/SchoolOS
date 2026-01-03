"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CalendarClock, CheckCircle2, AlertCircle, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Student {
    id: number
    name: string
    pivot: any
    student?: {
        admission_number: string
        payments?: any[]
        calculated_balance?: number
    }
}

interface FinancialSummaryProps {
    summary: {
        total_balance: number
        cleared_students: number
        uncleared_students: number
        last_payment_date: string | null
        current_term_name?: string
    }
    students: Student[]
    guardianId: number
}

type MetricType = 'balance' | 'status' | 'payment' | null

export default function FinancialSummary({ summary, students, guardianId }: FinancialSummaryProps) {
    const [selectedMetric, setSelectedMetric] = useState<MetricType>(null)
    const router = useRouter()


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "No payments recorded"
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const renderDialogContent = () => {
        if (!selectedMetric) return null

        switch (selectedMetric) {
            case 'balance':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                            <div>
                                <span className="font-semibold block">Total Outstanding</span>
                                <span className="text-xs text-muted-foreground">{summary.current_term_name || "Current Term"}</span>
                            </div>
                            <span className={`text-xl font-bold ${summary.total_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(summary.total_balance)}
                            </span>
                        </div>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                                {students.map(student => {
                                    const balance = student.student?.calculated_balance || 0
                                    return (
                                        <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.student?.admission_number}</p>
                                            </div>
                                            <span className={`font-mono font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {formatCurrency(balance)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )

            case 'status':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col items-center">
                                <span className="text-sm font-medium text-green-700">Cleared</span>
                                <span className="text-2xl font-bold text-green-700">{summary.cleared_students}</span>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col items-center">
                                <span className="text-sm font-medium text-red-700">Uncleared</span>
                                <span className="text-2xl font-bold text-red-700">{summary.uncleared_students}</span>
                            </div>
                        </div>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                                {students.map(student => {
                                    const balance = student.student?.calculated_balance || 0
                                    const isCleared = balance <= 0
                                    return (
                                        <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                {isCleared ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.student?.admission_number}</p>
                                                </div>
                                            </div>
                                            <Badge variant={isCleared ? "outline" : "destructive"} className={isCleared ? "text-green-600 bg-green-50 border-green-200" : ""}>
                                                {isCleared ? "Cleared" : "Uncleared"}
                                            </Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )

            case 'payment':
                return (
                    <div className="space-y-4">
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                                {students.map(student => {
                                    const lastPay = student.student?.payments?.length
                                        ? student.student.payments.reduce((max, p) => p.payment_date > max ? p.payment_date : max, '')
                                        : null

                                    return (
                                        <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.student?.admission_number}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{lastPay ? formatDate(lastPay) : "No activity"}</p>
                                                {lastPay && <p className="text-xs text-muted-foreground">Last Payment</p>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                )
            default:
                return null
        }
    }

    const getDialogTitle = () => {
        switch (selectedMetric) {
            case 'balance': return "Outstanding Balance Breakdown"
            case 'status': return "Clearance Status by Student"
            case 'payment': return "Recent Payment Activity"
            default: return ""
        }
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-3">
                <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-primary"
                    onClick={() => setSelectedMetric('balance')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Outstanding Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${summary.total_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(summary.total_balance)}
                        </div>
                        <p className="text-xs text-muted-foreground text-opacity-80">
                            {summary.current_term_name || "Current Term"}
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-blue-500"
                    onClick={() => setSelectedMetric('status')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clearance Status</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">Cleared</span>
                                </div>
                                <span className="text-xl font-bold">{summary.cleared_students}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-sm font-medium">Uncleared</span>
                                </div>
                                <span className="text-xl font-bold">{summary.uncleared_students}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-purple-500"
                    onClick={() => router.push(`/guardians/${guardianId}/payment-history`)}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Payment Activity</CardTitle>
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.last_payment_date ? formatDate(summary.last_payment_date) : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most recent payment date
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedMetric} onOpenChange={(open) => !open && setSelectedMetric(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{getDialogTitle()}</DialogTitle>
                        <DialogDescription>
                            Detailed breakdown for {students.length} linked student(s).
                        </DialogDescription>
                    </DialogHeader>
                    {renderDialogContent()}
                </DialogContent>
            </Dialog>
        </>
    )
}
