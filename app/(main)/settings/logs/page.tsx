"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Info } from "lucide-react"

export default function SystemLogsPage() {
    const { user } = useAuth()
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Use the configured API client (Axios) which handles credentials automatically
                // The URL is relative to the baseURL defined in lib/api.ts
                // If lib/api.ts base is /api/proxy, we might need a different path or just /system/logs if the proxy forwards it.
                // Assuming lib/api.ts is configured to talk to backend or proxy correctly.
                // Let's rely on api.get('/system/logs') if the proxy handles mapping.
                // Update: lib/api.ts has baseURL '/api/proxy'. If we call '/system/logs', it goes to '/api/proxy/system/logs'.
                // Does /api/proxy exist?
                const res = await api.get('/system/logs');
                setLogs(res.data)
            } catch (error) {
                console.error("Failed to fetch logs", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLogs()
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Logs</h1>
                <p className="text-gray-400 mt-1">
                    View detailed activity logs and system events.
                </p>
            </div>

            <Card className="glass-card border-none">
                <CardHeader>
                    <CardTitle className="text-white">Activity Log</CardTitle>
                    <CardDescription className="text-gray-400">
                        Recent actions performed within the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-4">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <div key={log.id} className="flex gap-2 py-1 px-2 rounded bg-white/5 border border-white/5 items-center">
                                            <div className="flex-shrink-0">
                                                <div className="p-1 rounded-full bg-blue-500/10 text-blue-400">
                                                    <Info className="h-3 w-3" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-white text-xs">{log.description}</p>
                                                    <span className="text-[10px] text-gray-500">{log.created_at}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                    <span>Caused by: <span className="text-gray-300">{log.causer}</span></span>
                                                    {log.properties?.attributes && (
                                                        <div className="mt-2 text-xs bg-black/20 p-2 rounded border border-white/5 space-y-1">
                                                            {Object.keys(log.properties.attributes).map((key) => {
                                                                const oldValue = log.properties.old ? log.properties.old[key] : null;
                                                                const newValue = log.properties.attributes[key];

                                                                // Skip non-informative logs like updated_at
                                                                if (key === 'updated_at') return null;

                                                                return (
                                                                    <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-gray-400">
                                                                        <span className="font-semibold text-blue-300 capitalize min-w-[100px]">{key.replace('_', ' ')}:</span>
                                                                        <div className="flex gap-2 items-center">
                                                                            {oldValue && <span className="line-through opacity-70">{String(oldValue)}</span>}
                                                                            {oldValue && <span>→</span>}
                                                                            <span className="text-green-300">{String(newValue)}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                        {log.properties?.ip && (
                                                            <span>IP: {log.properties.ip}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No logs found.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
