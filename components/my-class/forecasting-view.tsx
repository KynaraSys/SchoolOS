"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, AlertTriangle, ArrowRight, BrainCircuit, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"

import { ForecastDetailsDialog } from "./forecast-details-dialog"
import { useState } from "react"

export default function ForecastingView() {
    const router = useRouter()
    const [selectedStudent, setSelectedStudent] = useState<any>(null)

    // Mock Predictions
    const predictions = [
        { name: "David Kimani", current: "C-", predicted: "D+", trend: "down", risk: 92, intervention: "Remedial Math" },
        { name: "Sarah Omondi", current: "B", predicted: "B+", trend: "up", risk: 15, intervention: "Enrichment" },
        { name: "James Mwangi", current: "C", predicted: "C", trend: "stable", risk: 45, intervention: "Monitor Attendance" },
        { name: "Esther Nyambura", current: "A-", predicted: "A", trend: "up", risk: 5, intervention: "None" },
        { name: "Brian Ochieng", current: "D+", predicted: "D", trend: "down", risk: 88, intervention: "Parent Mtg" },
    ]

    return (
        <div className="space-y-6">
            <ForecastDetailsDialog
                student={selectedStudent}
                open={!!selectedStudent}
                onOpenChange={(open) => !open && setSelectedStudent(null)}
            />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        AI Forecasting Engine
                    </h1>
                    <p className="text-muted-foreground">Predictive analysis based on attendance, exam trends, and behavior.</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Back to Dashboard</Button>
            </div>

            {/* AI Insights Header */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Class Projected Mean</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">8.6 (B)</div>
                        <p className="text-xs text-muted-foreground mt-1">Slight improvement from current 8.4</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Early Warning Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-destructive">5</div>
                        <p className="text-xs text-muted-foreground mt-1">Students at high risk of dropping a grade</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">88%</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 3 terms of data</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Predictions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Performance Forecast</CardTitle>
                    <CardDescription>Projected outcomes for End of Term</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Current Grade</TableHead>
                                <TableHead>Forecast</TableHead>
                                <TableHead>Risk Index</TableHead>
                                <TableHead>Suggested Intervention</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {predictions.map((p, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>{p.current}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {p.predicted}
                                            {p.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                                            {p.trend === 'down' && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${p.risk > 70 ? 'bg-destructive' : p.risk > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                    style={{ width: `${p.risk}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{p.risk}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-accent/50">
                                            <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
                                            {p.intervention}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost" onClick={() => setSelectedStudent(p)}>Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
