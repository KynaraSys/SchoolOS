"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Shield, UserCheck, AlertTriangle, KeyRound, RotateCcw, Power } from "lucide-react"
import api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { format } from "date-fns"
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

interface AccessSecurityProps {
    guardian: any
    onUpdate: () => void
}

export default function AccessSecurity({ guardian, onUpdate }: AccessSecurityProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const user = guardian.user;

    const handleCreateAccount = async () => {
        try {
            setLoading(true)
            await api.post(`/guardians/${guardian.id}/portal-account`)
            toast({ title: "Success", description: "Portal account created successfully. Default password is 'password'." })
            onUpdate()
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to create account." })
        } finally {
            setLoading(false)
        }
    }

    const handleResetAccess = async () => {
        try {
            setLoading(true)
            await api.post(`/guardians/${guardian.id}/reset-access`)
            toast({ title: "Success", description: "Access reset. Password set to 'password'." })
            onUpdate()
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to reset access." })
        } finally {
            setLoading(false)
        }
    }

    const handleToggleAccess = async () => {
        try {
            setLoading(true)
            await api.post(`/guardians/${guardian.id}/toggle-access`)
            toast({ title: "Success", description: `Account ${user?.is_active ? 'disabled' : 'enabled'}.` })
            onUpdate()
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to toggle access." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Shield className="h-6 w-6 text-primary" />
                <div className="flex-1">
                    <CardTitle className="text-xl">Access & Security</CardTitle>
                    <CardDescription>Manage portal access and view security details.</CardDescription>
                </div>
                {user ? (
                    <Badge variant={user.is_active ? "default" : "destructive"} className={user.is_active ? "bg-green-600" : ""}>
                        {user.is_active ? "Access Enabled" : "Access Disabled"}
                    </Badge>
                ) : (
                    <Badge variant="secondary">No Portal Access</Badge>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                {!user ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
                        <div className="p-3 bg-muted rounded-full">
                            <Lock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium">Account Not Created</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                This guardian does not have a portal account yet. They cannot log in to view student details.
                            </p>
                        </div>
                        <Button onClick={handleCreateAccount} disabled={loading}>
                            <UserCheck className="mr-2 h-4 w-4" /> Create Portal Account
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned Role</h4>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Parent</Badge>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Login</h4>
                                <p className="font-medium">
                                    {user.last_login_at ? format(new Date(user.last_login_at), "PPP p") : "Never logged in"}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Failed Attempts</h4>
                                <p className={`font-medium ${user.failed_login_attempts > 0 ? "text-red-600" : ""}`}>
                                    {user.failed_login_attempts || 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 justify-center border-l md:pl-6">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start" disabled={loading}>
                                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reset Password?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will reset the user's password to the default "password" and clear any lockouts.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleResetAccess}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start ${user.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
                                        disabled={loading}
                                    >
                                        <Power className="mr-2 h-4 w-4" /> {user.is_active ? "Disable Account" : "Enable Account"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{user.is_active ? "Disable Account?" : "Enable Account?"}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {user.is_active
                                                ? "The user will no longer be able to log in to the portal."
                                                : "The user will regain access to the portal."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleToggleAccess}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
