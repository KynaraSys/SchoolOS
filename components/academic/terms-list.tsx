"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getTerms } from "@/lib/api-academic"
import { Term } from "@/lib/types/academic"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function TermsList() {
    const { user } = useAuth()
    const [terms, setTerms] = useState<Term[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const data = await getTerms()
                setTerms(data)
            } catch (error) {
                console.error("Failed to fetch terms", error)
                toast({
                    title: "Error",
                    description: "Failed to load terms. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (user) {
            fetchTerms()
        }
    }, [user])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Terms & Sessions</h1>
                    <p className="text-muted-foreground mt-1">Manage academic terms and sessions</p>
                </div>
                <Link href="/terms/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Term
                    </Button>
                </Link>
            </div>

            {terms.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="text-center space-y-2">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg font-medium">No terms found</h3>
                        <p className="text-muted-foreground">Get started by creating your first academic term.</p>
                        <Link href="/terms/create" className="mt-4 block">
                            <Button variant="outline">Add Term</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {terms.map((term) => (
                        <Link href={`/terms/${term.id}`} key={term.id}>
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full border-l-4 border-l-primary">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{term.name}</CardTitle>
                                            <CardDescription className="font-medium text-primary mt-1">
                                                {term.academic_year}
                                            </CardDescription>
                                        </div>
                                        {/* Logic to determine if active could be added here */}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>Start:</span>
                                            <span className="font-medium text-foreground">{new Date(term.start_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>End:</span>
                                            <span className="font-medium text-foreground">{new Date(term.end_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border">
                                        <div className="flex items-center justify-end">
                                            <Button size="sm" variant="ghost" className="gap-2">
                                                Details <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
