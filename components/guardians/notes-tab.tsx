"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Loader2, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

interface NotesTabProps {
    guardian: any
}

export default function NotesTab({ guardian }: NotesTabProps) {
    const { toast } = useToast()
    const [notes, setNotes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const fetchNotes = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/guardians/${guardian.id}/notes`)
            setNotes(response.data)
        } catch (error) {
            console.error(error)
            toast({ variant: "destructive", title: "Failed to load notes" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (guardian?.id) fetchNotes()
    }, [guardian?.id])

    const handleSubmit = async () => {
        if (!content.trim()) return

        try {
            setSubmitting(true)
            const res = await api.post(`/guardians/${guardian.id}/notes`, { content })
            setNotes([res.data, ...notes])
            setContent("")
            toast({ title: "Note added" })
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to add note" })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Internal Notes</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="space-y-4">
                        {notes.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">
                                No notes yet.
                            </div>
                        ) : (
                            notes.map((note) => (
                                <Card key={note.id}>
                                    <CardContent className="p-4 space-y-2">
                                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t mt-2">
                                            <Avatar className="h-5 w-5">
                                                <AvatarFallback className="text-[10px]">{note.user?.name?.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{note.user?.name}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Add New Note</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Type internal note here..."
                            className="min-h-[150px]"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleSubmit} disabled={submitting || !content.trim()}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Note
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
