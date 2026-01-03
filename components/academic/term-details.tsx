"use client"

import { useEffect, useState } from "react"
import { getTerm } from "@/lib/api-academic"
import { Term } from "@/lib/types/academic"
import { TermForm } from "@/components/academic/term-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface TermDetailsProps {
    termId: string
}

export default function TermDetails({ termId }: TermDetailsProps) {
    const [term, setTerm] = useState<Term | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTerm = async () => {
            try {
                const data = await getTerm(parseInt(termId))
                setTerm(data)
            } catch (error) {
                console.error("Failed to fetch term", error)
                toast({
                    title: "Error",
                    description: "Failed to load term details.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (termId) {
            fetchTerm()
        }
    }, [termId])

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

    if (!term) {
        return <div>Term not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <Link href="/terms">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Terms
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">{term.name}</h1>
                <p className="text-muted-foreground mt-1">
                    Academic Year {term.academic_year}
                </p>
            </div>

            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">Details & Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Term Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TermForm initialData={term} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
