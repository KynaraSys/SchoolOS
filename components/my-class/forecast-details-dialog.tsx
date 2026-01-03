"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingDown, TrendingUp, BrainCircuit, CheckCircle2, ArrowRight } from "lucide-react"

interface ForecastDetailsDialogProps {
    student: any // In a real app, define a proper type
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ForecastDetailsDialog({ student, open, onOpenChange }: ForecastDetailsDialogProps) {
    if (!student) return null

    // Mock specific details based on the selected student
    // In a real app, this would be fetched from an API
    const riskFactors = [
        { factor: "Attendance Decline", impact: "High", desc: "Attendance dropped to 78% in the last month." },
        { factor: "Failed Assignments", impact: "Medium", desc: "Missed 2 major assignments in Mathematics." },
        { factor: "Medical Issue", impact: "Low", desc: "Visited clinic 3 times this term." }
    ]

    const subjectPredictions = [
        { subject: "Mathematics", current: "D+", predicted: "E", trend: "down" },
        { subject: "English", current: "B", predicted: "B+", trend: "up" },
        { subject: "Chemistry", current: "C-", predicted: "D+", trend: "down" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        Forecast Analysis: {student.name}
                    </DialogTitle>
                    <DialogDescription>
                        AI-driven performance prediction and risk assessment.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Top Summary */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Current Mean</p>
                            <p className="text-2xl font-bold">{student.current}</p>
                        </div>
                        <ArrowRight className="text-muted-foreground opacity-50" />
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Predicted</p>
                            <div className="flex items-center gap-1 justify-center">
                                <p className={`text-2xl font-bold ${student.trend === 'down' ? 'text-destructive' : 'text-green-600'}`}>
                                    {student.predicted}
                                </p>
                                {student.trend === 'down' ? <TrendingDown className="h-4 w-4 text-destructive" /> : <TrendingUp className="h-4 w-4 text-green-600" />}
                            </div>
                        </div>
                        <div className="text-center border-l pl-4">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Failure Prob.</p>
                            <p className={`text-2xl font-bold ${student.risk > 50 ? 'text-destructive' : 'text-orange-500'}`}>
                                {student.risk}%
                            </p>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" /> Primary Risk Factors
                        </h4>
                        <div className="space-y-2">
                            {riskFactors.map((r, i) => (
                                <div key={i} className="text-sm border rounded-md p-3 flex items-start gap-3 bg-card">
                                    <Badge variant={r.impact === 'High' ? 'destructive' : 'secondary'} className="mt-0.5">
                                        {r.impact}
                                    </Badge>
                                    <div>
                                        <p className="font-medium">{r.factor}</p>
                                        <p className="text-muted-foreground text-xs">{r.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div>
                        <h4 className="text-sm font-medium mb-3">Key Subject Predictions</h4>
                        <div className="space-y-3">
                            {subjectPredictions.map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="font-medium w-32">{s.subject}</span>
                                    <div className="flex-1 px-4">
                                        <Progress value={s.trend === 'down' ? 30 : 80} className={`h-2 ${s.trend === 'down' ? 'bg-destructive/20' : 'bg-green-500/20'}`} />
                                    </div>
                                    <div className="flex items-center gap-3 w-24 justify-end">
                                        <span className="text-muted-foreground">{s.current}</span>
                                        <ArrowRight className="h-3 w-3" />
                                        <span className={`font-bold ${s.trend === 'down' ? 'text-destructive' : 'text-green-600'}`}>{s.predicted}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggested Actions */}
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <h4 className="text-sm font-medium mb-2 text-primary flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Recommended Interventions
                        </h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                            <li>Review Study Plan with Parent (Priority: High)</li>
                            <li>Enroll in After-school Math Support Group</li>
                            <li>Weekly attendance check-in</li>
                        </ul>
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button className="gap-2">
                        Generic Action Plan
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
