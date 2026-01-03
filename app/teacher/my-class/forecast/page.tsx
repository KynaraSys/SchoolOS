"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export default function MyClassForecastPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm">These predictions are based on current attendance patterns and CAT 1 performance.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20"><Sparkles className="h-24 w-24 text-primary" /></div>
                    <CardHeader>
                        <CardTitle>Predicted KCSE Mean</CardTitle>
                        <CardDescription>Forecasted final grade for Form 4.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary mb-2">B- (8.2)</div>
                        <p className="text-sm text-muted-foreground">
                            Current trajectory suggests a strong improvement from last year's C+ (7.4).
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-red-500/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20"><Sparkles className="h-24 w-24 text-red-500" /></div>
                    <CardHeader>
                        <CardTitle>Dropout Risk Factor</CardTitle>
                        <CardDescription>Students showing high probability of dropping out.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-red-500 mb-2">Medium</div>
                        <p className="text-sm text-muted-foreground">
                            3 students are flagged with &gt;60% risk score due to chronic absenteeism.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Suggested Interventions</CardTitle>
                    <CardDescription>AI-recommended actions to improve class outcomes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-card border flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Schedule Math Remedial</h4>
                                <p className="text-xs text-muted-foreground">Mathematics scores dropped by 12% in the last month for the bottom quartile.</p>
                            </div>
                            <Badge variant="outline">High Impact</Badge>
                        </div>
                        <div className="p-4 rounded-lg bg-card border flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Parent Meeting: Form 3A</h4>
                                <p className="text-xs text-muted-foreground">Engagement scores correlate strongly with recent parental involvement drop.</p>
                            </div>
                            <Badge variant="outline">Medium Impact</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
