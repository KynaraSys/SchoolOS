"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Bell, PenSquare, Paperclip, Send } from "lucide-react"

const initialMessages = [
    { id: "1", sender: "Admin Logic", role: "Principal", subject: "Staff Meeting Rescheduled", preview: "Dear Staff, The meeting scheduled for Friday has been...", time: "10:30 AM", unread: true, type: "announcement" },
    { id: "2", sender: "John Doe", role: "Parent", subject: "Re: Alice's Absence", preview: "Hello Mr. Teacher, Alice was unwell yesterday...", time: "Yesterday", unread: false, type: "message" },
    { id: "3", sender: "Jane Smith", role: "Academic Director", subject: "Exam Submission Deadline", preview: "Please ensure all CAT 2 marks are submitted by...", time: "2 days ago", unread: false, type: "announcement" }
]

export default function Inbox() {
    const [selectedMessage, setSelectedMessage] = useState(initialMessages[0])
    const [replyText, setReplyText] = useState("")

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4">
            {/* List */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Inbox</h1>
                    <Button size="icon" variant="ghost">
                        <PenSquare className="h-5 w-5" />
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                </div>

                <div className="flex-1 overflow-auto space-y-2 pr-2">
                    {initialMessages.map(msg => (
                        <Card
                            key={msg.id}
                            className={`cursor-pointer transition-colors hover:bg-accent/50 ${selectedMessage.id === msg.id ? 'bg-accent border-primary/50' : ''}`}
                            onClick={() => setSelectedMessage(msg)}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className={`text-sm ${msg.unread ? 'font-bold' : 'font-medium'}`}>{msg.sender}</p>
                                            <p className="text-xs text-muted-foreground">{msg.role}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-sm ${msg.unread ? 'font-semibold' : 'text-foreground'}`}>{msg.subject}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{msg.preview}</p>
                                </div>
                                {msg.type === 'announcement' && (
                                    <Badge variant="secondary" className="mt-2 text-[10px] h-5">Announcement</Badge>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Detail View */}
            <div className="hidden md:flex flex-1 flex-col h-full bg-background border rounded-lg overflow-hidden">
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{selectedMessage.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">From: {selectedMessage.sender} <span className="text-muted-foreground font-normal">({selectedMessage.role})</span></p>
                                <p className="text-xs text-muted-foreground">To: You</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {selectedMessage.time}
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-auto">
                    <p className="leading-relaxed">
                        {selectedMessage.preview}
                        <br /><br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        <br /><br />
                        Best regards,<br />
                        {selectedMessage.sender}
                    </p>
                </div>

                <div className="p-4 bg-muted/20 border-t">
                    <div className="flex gap-2">
                        <Input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            className="bg-background"
                        />
                        <Button variant="outline" size="icon">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
