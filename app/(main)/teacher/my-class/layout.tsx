"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MyClassLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const [className, setClassName] = useState<string>("")
    const [fetchingClass, setFetchingClass] = useState(true)

    useEffect(() => {
        if (!isLoading && user && !user.isClassTeacher) {
            router.replace("/dashboard")
        }
    }, [isLoading, user, router])

    useEffect(() => {
        const fetchClassDetails = async () => {
            if (user?.isClassTeacher) {
                try {
                    const response = await api.get('/teacher/my-class')
                    setClassName(response.data.class_details.name)
                } catch (error) {
                    console.error("Failed to fetch class name", error)
                } finally {
                    setFetchingClass(false)
                }
            }
        }

        if (!isLoading && user) {
            fetchClassDetails()
        }
    }, [isLoading, user])

    if (isLoading || (user?.isClassTeacher && fetchingClass)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (!user?.isClassTeacher) {
        return null // Will redirect in useEffect
    }

    const tabs = [
        { name: "Overview", href: "/teacher/my-class" },
        { name: "Students", href: "/teacher/my-class/students" },
        { name: "Analytics", href: "/teacher/my-class/analytics" },
        { name: "Forecasting", href: "/teacher/my-class/forecast" },
    ]

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        My Class <span className="text-primary">{className ? `- ${className}` : ''}</span>
                    </h1>
                    <p className="text-zinc-400">Manage your assigned class responsibilities.</p>
                </div>
            </div>
            <Tabs value={pathname} className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-[600px] bg-black/20 text-zinc-400">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.href}
                            value={tab.href}
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                            asChild
                        >
                            <Link href={tab.href}>
                                {tab.name}
                            </Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className="min-h-[500px]">
                {children}
            </div>
        </div>
    );
}
