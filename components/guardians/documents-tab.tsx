"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Loader2, Plus, FileText, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle as CardHeaderTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

interface DocumentsTabProps {
    guardian: any
}

export default function DocumentsTab({ guardian }: DocumentsTabProps) {
    const { toast } = useToast()
    const [documents, setDocuments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [open, setOpen] = useState(false)

    // Upload Form
    const [title, setTitle] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/guardians/${guardian.id}/documents`)
            setDocuments(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (guardian?.id) fetchDocuments()
    }, [guardian?.id])

    const handleUpload = async () => {
        if (!title.trim() || !file) return

        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        try {
            setUploading(true)
            const res = await api.post(`/guardians/${guardian.id}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setDocuments([res.data, ...documents])
            setOpen(false)
            setTitle("")
            setFile(null)
            toast({ title: "Document uploaded" })
        } catch (error) {
            toast({ variant: "destructive", title: "Upload failed" })
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (docId: number) => {
        if (!confirm("Are you sure you want to delete this document?")) return
        try {
            await api.delete(`/guardians/${guardian.id}/documents/${docId}`)
            setDocuments(documents.filter(d => d.id !== docId))
            toast({ title: "Document deleted" })
        } catch (error) {
            toast({ variant: "destructive", title: "Delete failed" })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Documents</h3>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Upload Document</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label>Document Title</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. ID Scan, Contract" />
                            </div>
                            <div className="grid gap-2">
                                <Label>File</Label>
                                <Input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleUpload} disabled={uploading || !title || !file}>
                                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upload
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-8 border rounded-lg border-dashed">
                            No documents uploaded.
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <Card key={doc.id} className="relative group">
                                <CardContent className="p-4 flex items-start space-x-4">
                                    <div className="bg-muted p-2 rounded">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">{doc.file_type?.toUpperCase()} • {Math.round(doc.file_size)} KB</p>
                                        <p className="text-xs text-muted-foreground">
                                            By {doc.uploader?.name} • {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(doc.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
