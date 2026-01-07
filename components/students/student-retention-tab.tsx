"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Archive, Trash2, ShieldOff, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { archiveStudent, anonymizeStudent, softDeleteStudent, restoreStudent } from "@/lib/api-learner-profile"

interface RetentionTabProps {
    studentId: string
    retentionStatus: 'active' | 'archived' | 'anonymized' | 'deleted'
    archivedAt?: string
    anonymizedAt?: string
    onUpdate: () => void
}

export function RetentionTab({ studentId, retentionStatus, archivedAt, anonymizedAt, onUpdate }: RetentionTabProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Helper to handle actions
    const handleAction = async (action: () => Promise<any>, successMessage: string) => {
        setIsLoading(true)
        try {
            await action()
            toast.success(successMessage)
            onUpdate() // Refresh parent
        } catch (error: any) {
            console.error(error)
            if (error.response?.status === 403) {
                toast.error("You do not have permission to perform this action.")
            } else {
                toast.error("Action failed. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isArchived = retentionStatus === 'archived' || !!archivedAt
    const isAnonymized = retentionStatus === 'anonymized' || !!anonymizedAt

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Data Retention Status
                    </CardTitle>
                    <CardDescription>
                        Manage the lifecycle of this learner's data in compliance with Kenyan Data Protection Act.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Status Display */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Current State</span>
                            <div className="flex items-center gap-2">
                                <Badge variant={
                                    isAnonymized ? "outline" :
                                        isArchived ? "secondary" :
                                            "default"
                                } className="text-base px-3 py-1 capitalize">
                                    {isAnonymized ? 'Anonymized' : isArchived ? 'Archived' : 'Active Enrolled'}
                                </Badge>
                            </div>
                        </div>
                        {isArchived && (
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground block">Archived On</span>
                                <span className="font-mono text-sm">{new Date(archivedAt!).toLocaleDateString()}</span>
                            </div>
                        )}
                        {isAnonymized && (
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground block">Anonymized On</span>
                                <span className="font-mono text-sm">{new Date(anonymizedAt!).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    {!isArchived && !isAnonymized && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Active Record</AlertTitle>
                            <AlertDescription>
                                This student is currently active. Archiving them will make their record read-only and remove them from active class lists.
                            </AlertDescription>
                        </Alert>
                    )}

                    {isArchived && !isAnonymized && (
                        <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
                            <Archive className="h-4 w-4 text-amber-600" />
                            <AlertTitle>Record Archived</AlertTitle>
                            <AlertDescription>
                                This student has left the school. Records are retained for longitudinal assessment.
                                Personal data will be automatically anonymized after the retention period (5-7 years).
                            </AlertDescription>
                        </Alert>
                    )}

                    {isAnonymized && (
                        <Alert variant="destructive" className="bg-slate-100 border-slate-200 text-slate-800">
                            <ShieldOff className="h-4 w-4" />
                            <AlertTitle>Identity Removed</AlertTitle>
                            <AlertDescription>
                                Personal identifiers have been stripped. Academic statistics remain for aggregate reporting only.
                                This action is generally irreversible.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Actions Grid */}
                    <div className="grid gap-4 md:grid-cols-2 pt-4">

                        {/* Archive Action */}
                        {!isArchived && !isAnonymized && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="secondary" className="w-full justify-start" disabled={isLoading}>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive Student
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Archive this Student?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will mark the student as having left the school. They will be removed from active class lists.
                                            Academic records will be preserved.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleAction(() => archiveStudent(studentId), "Student archived successfully")}>
                                            Confirm Archive
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {/* Restore Action */}
                        {(isArchived || isAnonymized) && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start" disabled={isLoading}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Restore Record
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Restore Student Record?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will make the student active again and allow editing of their profile.
                                            {isAnonymized && " Note: Anonymized data (names) cannot be automatically recovered if hashed."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleAction(() => restoreStudent(studentId), "Student restored successfully")}>
                                            Confirm Restore
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {/* Anonymize Action */}
                        {!isAnonymized && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start" disabled={isLoading}>
                                        <ShieldOff className="h-4 w-4 mr-2" />
                                        Anonymize Data
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Anonymize Personal Information?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove names, contact details, and other identifiers.
                                            This is usually done automatically after the retention period expires.
                                            <strong>This action is irreversible.</strong>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleAction(() => anonymizeStudent(studentId), "Student anonymized")}>
                                            Anonymize Permanently
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {/* Delete Action - Only for Admin */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full justify-start" disabled={isLoading}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Record
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-destructive">Delete Student Record?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        The student will be moved to the trash. It can be restored by a Super Admin within 30 days.
                                        Academic records should generally be Archived, not Deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAction(async () => {
                                        await softDeleteStudent(studentId);
                                        router.push('/students'); // Redirect after delete
                                    }, "Student deleted")}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>

                    <div className="text-xs text-muted-foreground text-center pt-6 border-t">
                        <p>Actions are logged for audit purposes. Data retention follows the School OS Governance Framework.</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
