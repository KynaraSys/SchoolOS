"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { User, AssignClassDTO } from "@/lib/types/user"
import { SchoolClass } from "@/lib/types/academic"
import { getClasses } from "@/lib/api-academic"
import { assignClassTeacher, unassignClassTeacher } from "@/lib/api-users"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Unlink } from "lucide-react"

const assignClassSchema = z.object({
    class_id: z.string().min(1, { message: "Please select a class" }),
    academic_year: z.string().min(4, { message: "Academic year is required" }),
})

type AssignClassFormValues = z.infer<typeof assignClassSchema>

interface ClassAssignmentProps {
    user: User
    onSuccess?: () => void
}

export function ClassAssignment({ user, onSuccess }: ClassAssignmentProps) {
    const [classes, setClasses] = useState<SchoolClass[]>([])
    const { toast } = useToast()

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClasses()
                setClasses(data)
            } catch (error) {
                console.error("Failed to fetch classes")
            }
        }
        fetchClasses()
    }, [])

    const form = useForm<AssignClassFormValues>({
        resolver: zodResolver(assignClassSchema),
        defaultValues: {
            class_id: "",
            academic_year: new Date().getFullYear().toString(),
        },
    })

    async function onSubmit(data: AssignClassFormValues) {
        try {
            await assignClassTeacher(user.id, {
                class_id: parseInt(data.class_id),
                academic_year: data.academic_year
            })

            toast({
                title: "Success",
                description: "Class assigned successfully.",
            })
            form.reset()
            if (onSuccess) onSuccess()

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to assign class. Please check if the user has the 'Teacher' role.",
                variant: "destructive",
            })
        }
    }

    async function handleUnassign(assignmentId: number) {
        if (!confirm("Are you sure you want to remove this class assignment?")) return

        try {
            await unassignClassTeacher(user.id, assignmentId)
            toast({
                title: "Success",
                description: "Class assignment removed.",
            })
            if (onSuccess) onSuccess()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove assignment.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="border rounded-md p-4 bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Current Assignments</h4>
                {user.classTeacherAssignments && user.classTeacherAssignments.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-foreground">
                        {user.classTeacherAssignments.map((assignment) => (
                            <li key={assignment.id} className="flex items-center justify-between">
                                <span>
                                    {assignment.schoolClass?.name} {assignment.schoolClass?.stream} ({assignment.academic_year})
                                    {assignment.is_primary && <span className="text-xs text-muted-foreground ml-2">(Primary)</span>}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                                    onClick={() => handleUnassign(assignment.id)}
                                >
                                    <Unlink className="h-4 w-4" />
                                    Unassign
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No classes assigned yet.</p>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="academic_year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Academic Year</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="class_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a class" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                                {cls.name} {cls.stream ? ` - ${cls.stream}` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign as Class Teacher
                    </Button>
                </form>
            </Form>
        </div>
    )
}
