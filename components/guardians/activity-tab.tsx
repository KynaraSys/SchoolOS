"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Loader2, Activity as ActivityIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface ActivityTabProps {
    guardian: any
}

export default function ActivityTab({ guardian }: ActivityTabProps) {
    const [activities, setActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/guardians/${guardian.id}/activities`)
                setActivities(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (guardian?.id) fetchActivities()
    }, [guardian?.id])

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Activity Log</h3>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="relative border-l border-muted ml-3 space-y-6">
                    {activities.length === 0 ? (
                        <div className="ml-6 text-muted-foreground text-sm">No activity recorded yet.</div>
                    ) : (
                        activities.map((act) => (
                            <div key={act.id} className="relative ml-6">
                                <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <ActivityIcon className="h-3 w-3" />
                                </span>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">
                                        {act.causer ? act.causer.name : 'System'} {act.description.toLowerCase()}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}
                                    </span>
                                    {act.properties && Object.keys(act.properties).length > 0 && (
                                        <div className="mt-2 text-xs bg-muted p-2 rounded w-fit max-w-md">
                                            <span className="font-semibold text-muted-foreground block mb-1">Changes:</span>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                {Object.entries(act.properties).map(([key, value]) => (
                                                    <div key={key} className="flex flex-col">
                                                        <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                                                        <span className="font-medium truncate">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
