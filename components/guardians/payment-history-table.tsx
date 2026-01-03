"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Payment {
    id: number
    date: string
    amount: number
    method: string
    reference: string
    student_name: string
    student_admission_number: string
}

interface PaymentHistoryTableProps {
    payments: Payment[]
}

export default function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
    }

    if (payments.length === 0) {
        return (
            <div className="text-center p-8 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No payment history found for this guardian's students.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell>{format(new Date(payment.date), "PPP")}</TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{payment.student_name}</p>
                                    <p className="text-xs text-muted-foreground">{payment.student_admission_number}</p>
                                </div>
                            </TableCell>
                            <TableCell className="font-bold">
                                {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {payment.method}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                                {payment.reference}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
