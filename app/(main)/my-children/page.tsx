"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Loader2, User, Phone, Mail, MapPin, Calendar, Hash, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

// Mock Data (Consistent with Dashboard)
const mockStudents = [
    {
        id: "st_1",
        name: "Sarah Wanjiru",
        admission_no: "2022/0342",
        class: "Form 3A",
        status: "Active",
        dob: "12 May 2008",
        photo: null, // Placeholder logic
        academic_year: "2025",
        term: "Term 1"
    },
    {
        id: "st_2",
        name: "Kevin Maina",
        admission_no: "2024/0118",
        class: "Form 1C",
        status: "Active",
        dob: "23 Aug 2010",
        photo: null,
        academic_year: "2025",
        term: "Term 1"
    }
]

export default function MyChildrenPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#1a1f36]">My Children</h1>
                <p className="text-muted-foreground mt-2">
                    View details and academic profile for your linked students.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockStudents.map((student) => (
                    <Card key={student.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                            <div className="absolute -bottom-12 left-6">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl font-bold">
                                        {student.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <Badge className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600 border-0">
                                {student.status}
                            </Badge>
                        </div>
                        <CardContent className="pt-16 pb-6 px-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                                <p className="text-muted-foreground font-medium">{student.class} Student</p>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    <Hash className="h-4 w-4 text-indigo-500" />
                                    <span className="font-medium">ADM: {student.admission_no}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                    <span>{student.academic_year} • {student.term}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/50 p-4 border-t border-gray-100 flex gap-2">
                            <Button variant="default" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200">
                                View Profile
                            </Button>
                            <Button variant="outline" size="icon">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
