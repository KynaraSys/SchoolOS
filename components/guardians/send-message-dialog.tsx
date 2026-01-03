"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"

interface SendMessageDialogProps {
    guardianId: number
    students?: any[]
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export default function SendMessageDialog({ guardianId, students = [], trigger, onSuccess }: SendMessageDialogProps) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form State
    const [type, setType] = useState<"sms" | "email" | "whatsapp">("sms")
    const [studentId, setStudentId] = useState<string>("none")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const handleSend = async () => {
        if (!message.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Message cannot be empty.",
            })
            return
        }

        if (type === 'email' && !subject.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Subject is required for emails.",
            })
            return
        }

        try {
            setLoading(true)
            await api.post(`/guardians/${guardianId}/message`, {
                type,
                message,
                student_id: studentId !== 'none' ? studentId : null,
                subject: type === 'email' ? subject : null
            })

            toast({
                title: "Sent",
                description: "Message sent successfully.",
            })
            setOpen(false)
            setMessage("")
            setSubject("")
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Failed to send message", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send message. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button size="sm"><Send className="mr-2 h-4 w-4" /> Send Message</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>
                        Send a direct message to this guardian via SMS, Email, or WhatsApp.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Channel</Label>
                        <Select value={type} onValueChange={(v: any) => setType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Regarding Student (Optional)</Label>
                        <Select value={studentId} onValueChange={setStudentId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select student..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">General / No Specific Student</SelectItem>
                                {students.map((s) => (
                                    <SelectItem key={s.id} value={s.id.toString()}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {type === 'email' && (
                        <div className="grid gap-2">
                            <Label>Subject</Label>
                            <Input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email Subject"
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Message</Label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Type your ${type.toUpperCase()} message here...`}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
