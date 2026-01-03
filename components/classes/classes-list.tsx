"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, BookOpen, ArrowRight, Plus, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getClasses } from "@/lib/api-academic"
import { SchoolClass } from "@/lib/types/academic"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ClassForm } from "./class-form"

export default function ClassesList() {
    const { user } = useAuth()
    const [classes, setClasses] = useState<SchoolClass[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const fetchClasses = async () => {
        try {
            const data = await getClasses()
            setClasses(data)
        } catch (error) {
            console.error("Failed to fetch classes", error)
            toast({
                title: "Error",
                description: "Failed to load classes. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchClasses()
        }
    }, [user])

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false)
        fetchClasses()
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
                    <h1 className="text-3xl font-semibold">Classes Management</h1>
                    <p className="text-muted-foreground mt-1">Manage school classes and streams</p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                            <DialogDescription>
                                Add a new class to the academic structure.
                            </DialogDescription>
                        </DialogHeader>
                        <ClassForm onSuccess={handleCreateSuccess} />
                    </DialogContent>
                </Dialog>
            </div>

            {classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="text-center space-y-2">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-medium">No classes found</h3>
                        <p className="text-muted-foreground">Get started by creating your first class.</p>
                        <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="mt-4">
                            Create Class
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {classes.map((cls, index) => {
                        const cardColors = [
                            "border-l-red-500",
                            "border-l-orange-500",
                            "border-l-amber-500",
                            "border-l-yellow-500",
                            "border-l-lime-500",
                            "border-l-green-500",
                            "border-l-emerald-500",
                            "border-l-teal-500",
                            "border-l-cyan-500",
                            "border-l-sky-500",
                            "border-l-blue-500",
                            "border-l-indigo-500",
                            "border-l-violet-500",
                            "border-l-purple-500",
                            "border-l-fuchsia-500",
                            "border-l-pink-500",
                            "border-l-rose-500"
                        ]
                        const colorClass = cardColors[index % cardColors.length]

                        const displayName = cls.stream ? `${cls.name} - ${cls.stream}` : cls.name

                        return (
                            <Link href={`/classes/${cls.id}`} key={cls.id}>
                                <Card className={`hover:bg-accent/50 transition-colors cursor-pointer h-full border-l-4 shadow-sm ${colorClass}`}>
                                    <CardHeader className="p-3 pb-1">
                                        <div className="flex justify-between items-start">
                                            <div className="w-full">
                                                <CardTitle className="text-base truncate" title={displayName}>{displayName}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-2">
                                        <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-3 w-3" />
                                                <span>{cls.students_count || 0} Students</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 opacity-90">
                                                <User className="h-3 w-3" />
                                                <span className="truncate" title={cls.currentTeacher?.teacher?.full_name || "No Class Teacher"}>
                                                    {cls.currentTeacher?.teacher?.full_name || "No Class Teacher"}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
