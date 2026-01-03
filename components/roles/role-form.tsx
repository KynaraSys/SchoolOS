"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Permission, Role, createRole, updateRole, getPermissions } from "@/lib/api-roles"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Role name must be at least 2 characters.",
    }),
    permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one permission.",
    }),
})

interface RoleFormProps {
    role?: Role
    onSuccess: () => void
}

export function RoleForm({ role, onSuccess }: RoleFormProps) {
    const { toast } = useToast()
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [loadingPermissions, setLoadingPermissions] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues = {
        name: role?.name || "",
        permissions: role?.permissions.map((p) => p.name) || [],
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await getPermissions()
                setPermissions(data)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error fetching permissions",
                    description: "Could not load permissions. Please try again."
                })
            } finally {
                setLoadingPermissions(false)
            }
        }
        fetchPermissions()
    }, [])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            if (role) {
                await updateRole(role.id, values)
                toast({
                    title: "Role updated",
                    description: "The role has been successfully updated.",
                })
            } else {
                await createRole(values)
                toast({
                    title: "Role created",
                    description: "The new role has been successfully created.",
                })
            }
            onSuccess()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error saving role",
                description: error.response?.data?.message || "Something went wrong."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loadingPermissions) {
        return <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Moderator" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="permissions"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Permissions</FormLabel>
                                <FormDescription>
                                    Select the permissions for this role.
                                </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                                {permissions.map((permission) => (
                                    <FormField
                                        key={permission.id}
                                        control={form.control}
                                        name="permissions"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={permission.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(permission.name)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, permission.name])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== permission.name
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        {permission.name}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {role ? "Update Role" : "Create Role"}
                </Button>
            </form>
        </Form>
    )
}
