"use client"

import { useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { SchoolClass, CreateClassDTO } from "@/lib/types/academic"
import { createClass, updateClass } from "@/lib/api-academic"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const classFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    grade_level: z.coerce.number().min(1, {
        message: "Grade level must be at least 1.",
    }),
    stream: z.string().optional(),
    curriculum: z.enum(["CBC", "8-4-4"]).default("CBC"),
})

type ClassFormValues = z.infer<typeof classFormSchema>

interface ClassFormProps {
    initialData?: SchoolClass
    onSuccess?: () => void
}

export function ClassForm({ initialData, onSuccess }: ClassFormProps) {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classFormSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                grade_level: initialData.grade_level,
                stream: initialData.stream || "",
                curriculum: initialData.curriculum || "CBC",
            }
            : {
                name: "",
                grade_level: 1,
                stream: "",
                curriculum: "CBC",
            },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                grade_level: initialData.grade_level,
                stream: initialData.stream || "",
                curriculum: initialData.curriculum || "CBC",
            })
        } else {
            // Optional: reset to empty if no data (though usually unmounting handles this)
        }
    }, [initialData, form])

    async function onSubmit(data: ClassFormValues) {
        try {
            if (initialData) {
                await updateClass(initialData.id, data)
                toast({
                    title: "Success",
                    description: "Class updated successfully.",
                })
            } else {
                await createClass(data)
                toast({
                    title: "Success",
                    description: "Class created successfully.",
                })
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push("/classes")
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Grade 10A" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormDescription>
                                This is the public display name of the class.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="grade_level"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grade Level</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stream"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stream (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. A" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Curriculum selection hidden - defaults to CBC for new, preserves existing for edit */}
                <FormField
                    control={form.control}
                    name="curriculum"
                    render={({ field }) => (
                        <input type="hidden" {...field} value={field.value} />
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Class" : "Create Class"}
                </Button>
            </form>
        </Form>
    )
}
