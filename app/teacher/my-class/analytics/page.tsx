"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MyClassAnalyticsPage() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Subject Contribution</CardTitle>
                    <CardDescription>Which subjects are boosting or dragging the mean?</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-black/20 rounded-lg m-6 border border-white/5">
                    <p className="text-muted-foreground">Bar Chart: Subject Deviations from Mean</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gender Performance Comparison</CardTitle>
                    <CardDescription>Analysis by gender across key subjects.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-black/20 rounded-lg m-6 border border-white/5">
                    <p className="text-muted-foreground">Grouped Bar Chart: Boys vs Girls</p>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Term-to-Term Trend</CardTitle>
                    <CardDescription>Historical performance over the academic year.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-black/20 rounded-lg m-6 border border-white/5">
                    <p className="text-muted-foreground">Line Chart: Term 1, Term 2, Term 3</p>
                </CardContent>
            </Card>
        </div>
    )
}
