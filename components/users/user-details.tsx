"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/api-users"
import { User } from "@/lib/types/user"
import { UserForm } from "@/components/users/user-form"

import { Skeleton } from "@/components/ui/skeleton"
import { ModernTabs, ModernTabsContent, ModernTabsList, ModernTabsTrigger } from "@/components/ui/modern-tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User as UserIcon, GraduationCap } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"

interface UserDetailsProps {
    userId: string
}

export default function UserDetails({ userId }: UserDetailsProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()
    const defaultTab = searchParams.get('tab') || 'details'

    const fetchUser = async () => {
        try {
            const id = parseInt(userId)
            if (isNaN(id)) {
                setIsLoading(false)
                return
            }
            const data = await getUser(id)
            setUser(data)
        } catch (error) {
            console.error("Failed to fetch user", error)
            toast({
                title: "Error",
                description: "Failed to load user details.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchUser()
        }
    }, [userId])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    if (!user) {
        return <div>User not found</div>
    }

    const isTeacher = user.roles?.some(r => r.name === 'Teacher')

    return (
        <div className="space-y-6">
            <div>
                <Link href="/users">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">{user.name}</h1>
                <p className="text-muted-foreground mt-1">
                    {user.email} • {user.roles?.map(r => r.name).join(', ')}
                </p>
            </div>

            <ModernTabs defaultValue={defaultTab}>
                <ModernTabsList>
                    <ModernTabsTrigger value="details" icon={UserIcon}>Profile & Settings</ModernTabsTrigger>
                </ModernTabsList>

                <ModernTabsContent value="details" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit User Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserForm initialData={user} />
                        </CardContent>
                    </Card>
                </ModernTabsContent>
            </ModernTabs>
        </div>
    )
}
