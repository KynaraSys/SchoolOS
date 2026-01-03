"use client"

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
import { Subject, CreateSubjectDTO } from "@/lib/types/academic"
import { createSubject, updateSubject } from "@/lib/api-academic"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const subjectFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    code: z.string().min(2, {
        message: "Code must be at least 2 characters.",
    }).max(20, {
        message: "Code must be at most 20 characters."
    }),
})

type SubjectFormValues = z.infer<typeof subjectFormSchema>

interface SubjectFormProps {
    initialData?: Subject
    onSuccess?: () => void
}

export function SubjectForm({ initialData, onSuccess }: SubjectFormProps) {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectFormSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                code: initialData.code,
            }
            : {
                name: "",
                code: "",
            },
    })

    async function onSubmit(data: SubjectFormValues) {
        try {
            if (initialData) {
                await updateSubject(initialData.id, data)
                toast({
                    title: "Success",
                    description: "Subject updated successfully.",
                })
            } else {
                await createSubject(data)
                toast({
                    title: "Success",
                    description: "Subject created successfully.",
                })
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push("/subjects")
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
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Mathematics" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. MATH101" {...field} />
                            </FormControl>
                            <FormDescription>
                                Unique code for the subject.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Subject" : "Create Subject"}
                </Button>
            </form>
        </Form>
    )
}
