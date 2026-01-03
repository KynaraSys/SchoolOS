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
import { Term, CreateTermDTO } from "@/lib/types/academic"
import { createTerm, updateTerm } from "@/lib/api-academic"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const termFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    academic_year: z.string().min(4, {
        message: "Academic year is required (e.g. 2024)"
    }),
    start_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format"
    }),
    end_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format"
    }),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
})

type TermFormValues = z.infer<typeof termFormSchema>

interface TermFormProps {
    initialData?: Term
}

export function TermForm({ initialData }: TermFormProps) {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<TermFormValues>({
        resolver: zodResolver(termFormSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                academic_year: initialData.academic_year,
                // Format date for input type="date" (YYYY-MM-DD)
                start_date: new Date(initialData.start_date).toISOString().split('T')[0],
                end_date: new Date(initialData.end_date).toISOString().split('T')[0],
            }
            : {
                name: "",
                academic_year: new Date().getFullYear().toString(),
                start_date: "",
                end_date: "",
            },
    })

    async function onSubmit(data: TermFormValues) {
        try {
            if (initialData) {
                await updateTerm(initialData.id, data)
                toast({
                    title: "Success",
                    description: "Term updated successfully.",
                })
            } else {
                await createTerm(data)
                toast({
                    title: "Success",
                    description: "Term created successfully.",
                })
            }
            router.push("/terms")
            router.refresh()
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
                            <FormLabel>Term Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Term 1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="academic_year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Term" : "Create Term"}
                </Button>
            </form>
        </Form>
    )
}
