"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Construction, Bus, BookOpen } from "lucide-react"

export default function ProjectContributions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Contributions to School Projects</CardTitle>
                <CardDescription>Track contributions towards school development projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Construction className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">New Library Fund</span>
                        </div>
                        <Badge variant="outline" className="text-blue-600 bg-blue-50">In Progress</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Contributed: KES 5,000</span>
                        <span>Target: KES 10,000</span>
                    </div>
                    <Progress value={50} className="h-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bus className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">School Bus Project</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 bg-green-50">Completed</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Contributed: KES 2,000</span>
                        <span>Target: KES 2,000</span>
                    </div>
                    <Progress value={100} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}
