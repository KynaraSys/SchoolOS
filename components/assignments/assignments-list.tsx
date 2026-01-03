"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, FileText, CheckCircle2, Clock, MoreHorizontal, ArrowRight } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CreateAssignmentForm from "./create-assignment-form"
import { useState } from "react"

export default function AssignmentsList() {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)

    // Mock data
    const assignments = [
        {
            id: "asg-001",
            title: "Algebraic Expressions Worksheet",
            class: "Form 3A",
            subject: "Mathematics",
            dueDate: "2024-12-20",
            submitted: 38,
            total: 42,
            status: "Active"
        },
        {
            id: "asg-002",
            title: "Geometry Project: Construction",
            class: "Form 2B",
            subject: "Mathematics",
            dueDate: "2024-12-22",
            submitted: 12,
            total: 40,
            status: "Active"
        },
        {
            id: "asg-003",
            title: "Calculus Limits Intro",
            class: "Form 4A",
            subject: "Mathematics",
            dueDate: "2024-12-15",
            submitted: 42,
            total: 42,
            status: "Grading"
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Assignments</h1>
                    <p className="text-muted-foreground mt-1">Manage homework, projects, and assessments</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                            <DialogDescription>Set a new task for your students. Students will be notified immediately.</DialogDescription>
                        </DialogHeader>
                        <CreateAssignmentForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((asg) => (
                    <Card key={asg.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg leading-tight">{asg.title}</CardTitle>
                                    <CardDescription>{asg.class} • {asg.subject}</CardDescription>
                                </div>
                                <Badge variant={asg.status === 'Active' ? 'default' : 'secondary'}>
                                    {asg.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due {asg.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span>{asg.submitted}/{asg.total} Submitted</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 flex gap-2">
                                <Button asChild className="flex-1" variant={asg.status === 'Grading' ? 'default' : 'secondary'}>
                                    <Link href={`/assignments/${asg.id}/mark`}>
                                        {asg.status === 'Grading' ? 'Continue Marking' : 'View submissions'}
                                    </Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                        <DropdownMenuItem>Extend Deadline</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Empty State / Create New Card */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center gap-4 border-dashed p-8 hover:bg-accent hover:text-accent-foreground">
                            <div className="rounded-full bg-primary/10 p-4">
                                <Plus className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <span className="font-semibold text-lg">Create New Assignment</span>
                                <p className="text-sm text-muted-foreground mt-1">Add regular homework or a project</p>
                            </div>
                        </Button>
                    </DialogTrigger>
                    {/* Note: Content is same as top dialog - in a real app might refactor triggers */}
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                            <DialogDescription>Set a new task for your students. Students will be notified immediately.</DialogDescription>
                        </DialogHeader>
                        <CreateAssignmentForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
