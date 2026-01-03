"use client"

import { useEffect, useState } from "react"
import { getSubject } from "@/lib/api-academic"
import { Subject } from "@/lib/types/academic"
import { SubjectForm } from "@/components/academic/subject-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface SubjectDetailsProps {
    subjectId: string
}

export default function SubjectDetails({ subjectId }: SubjectDetailsProps) {
    const [subject, setSubject] = useState<Subject | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const data = await getSubject(parseInt(subjectId))
                setSubject(data)
            } catch (error) {
                console.error("Failed to fetch subject", error)
                toast({
                    title: "Error",
                    description: "Failed to load subject details.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (subjectId) {
            fetchSubject()
        }
    }, [subjectId])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    if (!subject) {
        return <div>Subject not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <Link href="/subjects">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Subjects
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">{subject.name}</h1>
                <p className="text-muted-foreground mt-1">
                    Code: {subject.code}
                </p>
            </div>

            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">Details & Settings</TabsTrigger>
                    {/* Add more tabs for Teachers, assignments etc. */}
                </TabsList>

                <TabsContent value="details" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Subject Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SubjectForm initialData={subject} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
