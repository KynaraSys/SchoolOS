import { Switch } from "@/components/ui/switch"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, CreateUserDTO, UpdateUserDTO, UserRole } from "@/lib/types/user"
import { createUser, updateUser, getRoles } from "@/lib/api-users"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Role } from "@/lib/types/user"

const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    role: z.string().min(1, {
        message: "Please select a role",
    }),
    is_active: z.boolean().default(true),
}).refine((data) => {
    if (data.password && data.password !== data.password_confirmation) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
    initialData?: User
    onSuccess?: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [roles, setRoles] = useState<Role[]>([])
    const [loadingRoles, setLoadingRoles] = useState(true)

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getRoles()
                setRoles(data)
            } catch (error) {
                console.error("Failed to fetch roles", error)
            } finally {
                setLoadingRoles(false)
            }
        }
        fetchRoles()
    }, [])

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                email: initialData.email,
                role: initialData.roles && initialData.roles.length > 0 ? initialData.roles[0].name : "",
                password: "",
                password_confirmation: "",
                is_active: initialData.is_active,
            }
            : {
                name: "",
                email: "",
                role: "",
                password: "",
                password_confirmation: "",
                is_active: true,
            },
    })

    async function onSubmit(data: UserFormValues) {
        try {
            if (initialData) {
                // Only include password if provided
                const updateData: UpdateUserDTO = {
                    name: data.name,
                    email: data.email,
                    role: data.role as UserRole,
                    is_active: data.is_active,
                }
                if (data.password) {
                    updateData.password = data.password
                    updateData.password_confirmation = data.password_confirmation
                }

                await updateUser(initialData.id, updateData)
                toast({
                    title: "Success",
                    description: "User updated successfully.",
                })
            } else {
                if (!data.password) {
                    form.setError("password", { message: "Password is required for new users" })
                    return
                }
                await createUser(data as CreateUserDTO)
                toast({
                    title: "Success",
                    description: "User created successfully.",
                })
            }
            if (onSuccess) {
                onSuccess()
            } else {
                router.push("/users")
                router.refresh()
            }
        } catch (error: any) {
            // Handle validation errors from backend usually 422
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors
                Object.keys(errors).forEach((key) => {
                    form.setError(key as any, { message: errors[key][0] })
                })
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="john@school.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Account</FormLabel>
                                <FormDescription>
                                    Enable or disable this user account.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password {initialData && "(Optional)"}</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update User" : "Create User"}
                </Button>
            </form>
        </Form>
    )
}
