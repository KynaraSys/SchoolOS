"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getSubjects } from "@/lib/api-academic"
import { Subject } from "@/lib/types/academic"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SubjectForm } from "./subject-form"

export default function SubjectsList() {
    const { user } = useAuth()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const fetchSubjects = async () => {
        try {
            const data = await getSubjects()
            setSubjects(data)
        } catch (error) {
            console.error("Failed to fetch subjects", error)
            toast({
                title: "Error",
                description: "Failed to load subjects. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSubjects()
        }
    }, [user])

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false)
        fetchSubjects()
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Subjects</h1>
                    <p className="text-muted-foreground mt-1">Manage academic subjects</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subject
                </Button>
            </div>

            {subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="text-center space-y-2">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-medium">No subjects found</h3>
                        <p className="text-muted-foreground">Get started by creating your first subject.</p>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                            Add Subject
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((subject) => (
                        <Link href={`/subjects/${subject.id}`} key={subject.id}>
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full border-l-4 border-l-secondary">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{subject.name}</CardTitle>
                                            <CardDescription className="font-medium text-secondary-foreground mt-1">
                                                Code: {subject.code}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="pt-4 border-t border-border">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                                                <p className="font-medium text-foreground">Last Updated</p>
                                                {new Date(subject.updated_at || "").toLocaleDateString()}
                                            </div>
                                            <Button size="sm" variant="ghost" className="gap-2">
                                                Details <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                    </DialogHeader>
                    <SubjectForm onSuccess={handleCreateSuccess} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
