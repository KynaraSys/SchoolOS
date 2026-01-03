"use client"

import { useEffect, useState } from "react"
import { getClass } from "@/lib/api-academic"
import { SchoolClass } from "@/lib/types/academic"
import { ClassForm } from "./class-form"
import { Badge } from "@/components/ui/badge"
import { ClassTeacherAssignment } from "./class-teacher-assignment"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernTabs, ModernTabsContent, ModernTabsList, ModernTabsTrigger } from "@/components/ui/modern-tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Layout, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface ClassDetailsProps {
    classId: string
    onClassLoaded?: (name: string) => void
}

export default function ClassDetails({ classId, onClassLoaded }: ClassDetailsProps) {
    const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchClass = async () => {
        try {
            const data = await getClass(parseInt(classId))
            setSchoolClass(data)
            if (onClassLoaded) {
                const displayName = data.stream ? `${data.name} - ${data.stream}` : data.name
                onClassLoaded(displayName)
            }
        } catch (error) {
            console.error("Failed to fetch class", error)
            toast({
                title: "Error",
                description: "Failed to load class details.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (classId) {
            fetchClass()
        }
    }, [classId])

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

    if (!schoolClass) {
        return <div>Class not found</div>
    }

    const displayName = schoolClass.stream ? `${schoolClass.name} - ${schoolClass.stream}` : schoolClass.name

    return (
        <div className="space-y-6">
            <div>
                <Link href="/classes">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Classes
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">{displayName}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                        {schoolClass.curriculum || 'CBC'}
                    </Badge>
                    <p className="text-muted-foreground">
                        Grade {schoolClass.grade_level} • Stream {schoolClass.stream || "N/A"}
                    </p>
                </div>
            </div>

            <ModernTabs defaultValue="students">
                <ModernTabsList>
                    <ModernTabsTrigger value="students" icon={Users}>Students</ModernTabsTrigger>
                    <ModernTabsTrigger value="subjects" icon={BookOpen}>Subjects & Teachers</ModernTabsTrigger>
                    <ModernTabsTrigger value="details" icon={Layout}>Details & Settings</ModernTabsTrigger>
                </ModernTabsList>

                <ModernTabsContent value="students" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrolled Students ({schoolClass.students?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {schoolClass.students && schoolClass.students.length > 0 ? (
                                <div className="space-y-4">
                                    {schoolClass.students.map((student) => (
                                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {student.user?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{student.user?.full_name || 'Unknown Student'}</p>
                                                    <p className="text-xs text-muted-foreground">{student.admission_number}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {student.user?.email}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No students enrolled in this class yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </ModernTabsContent>

                <ModernTabsContent value="subjects" className="mt-6">
                    <ClassTeacherAssignment schoolClass={schoolClass} />
                </ModernTabsContent>

                <ModernTabsContent value="details" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Settings: {displayName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ClassForm
                                key={schoolClass.updated_at || 'form'}
                                initialData={schoolClass}
                                onSuccess={fetchClass}
                            />
                        </CardContent>
                    </Card>
                </ModernTabsContent>
            </ModernTabs>
        </div>
    )
}
