"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { createUser } from "@/lib/api-users"
import { Loader2 } from "lucide-react"

interface AddStaffDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

import { Checkbox } from "@/components/ui/checkbox"

export default function AddStaffDialog({ open, onOpenChange, onSuccess }: AddStaffDialogProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        roles: [] as string[],
    })

    // Staff roles from simple list for now, could catch from API-roles
    const staffRoles = [
        { id: 'Teacher', name: 'Teacher' },
        { id: 'Principal', name: 'Principal' },
        { id: 'Bursar', name: 'Bursar' },
        { id: 'Secretary', name: 'Secretary' },
        { id: 'ICT Admin', name: 'ICT Admin' },
        { id: 'Admin', name: 'Admin' },
        { id: 'Discipline Master', name: 'Discipline Master' }, // Added per request
    ]

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleRoleChange = (role: string, checked: boolean) => {
        setFormData(prev => {
            if (checked) {
                return { ...prev, roles: [...prev.roles, role] }
            } else {
                return { ...prev, roles: prev.roles.filter(r => r !== role) }
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.roles.length === 0) {
            toast({
                title: "Error",
                description: "At least one role must be selected.",
                variant: "destructive",
            })
            return
        }
        setIsLoading(true)

        try {
            await createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                roles: formData.roles,
            })

            toast({
                title: "Success",
                description: "Staff member created successfully.",
            })

            setFormData({ name: "", email: "", password: "", roles: [] })
            onOpenChange(false)
            if (onSuccess) onSuccess()
            window.location.reload()

        } catch (error: any) {
            console.error(error)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create staff member.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                        Create a new staff account with one or more roles.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="e.g. john@school.com"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Roles</Label>
                        <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-[150px] overflow-y-auto">
                            {staffRoles.map(role => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={formData.roles.includes(role.id)}
                                        onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                                    />
                                    <Label htmlFor={`role-${role.id}`} className="cursor-pointer">{role.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
