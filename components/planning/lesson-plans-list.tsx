"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Calendar, CheckCircle2, MoreHorizontal } from "lucide-react"

export default function LessonPlansList() {
    const plans = [
        { id: "1", week: "Week 1", topic: "Algebraic Expressions", status: "Approved", class: "Form 3A" },
        { id: "2", week: "Week 2", topic: "Linear Inequalities", status: "Submitted", class: "Form 3A" },
        { id: "3", week: "Week 3", topic: "Quadratic Expressions", status: "Draft", class: "Form 3A" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold">Lesson Plans</h1>
                    <p className="text-muted-foreground mt-1">Plan lessons and schemes of work</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Lesson Plan
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.id}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">{plan.topic}</CardTitle>
                                <CardDescription>{plan.class} • {plan.week}</CardDescription>
                            </div>
                            <Badge variant={plan.status === 'Approved' ? 'default' : plan.status === 'Draft' ? 'outline' : 'secondary'}>
                                {plan.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button size="sm" variant="ghost">Edit</Button>
                                <Button size="sm" variant="outline">View</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
