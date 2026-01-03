"use client"

import { useEffect, useRef, useState } from "react"
import { Send, MoreVertical, Phone, Video, ChevronLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Message, MessageUser } from "@/lib/api-communication"

interface ChatWindowProps {
    recipient: MessageUser
    messages: Message[]
    onSendMessage: (content: string) => void
    isSending: boolean
    onBack?: () => void
}

export function ChatWindow({ recipient, messages, onSendMessage, isSending, onBack }: ChatWindowProps) {
    const [content, setContent] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const isScrolledToBottom = useRef(true) // Default to true so it scrolls on first load
    const lastMessageCount = useRef(messages.length)

    // Handle scroll event to track if user is at bottom
    useEffect(() => {
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
        if (!viewport) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = viewport
            // Check if within 50px of bottom
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
            isScrolledToBottom.current = isAtBottom
        }

        viewport.addEventListener('scroll', handleScroll)
        return () => viewport.removeEventListener('scroll', handleScroll)
    }, [])

    // Auto-scroll to bottom only if user was already at bottom or it's a new batch (initial)
    useEffect(() => {
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement

        if (viewport && isScrolledToBottom.current) {
            viewport.scrollTop = viewport.scrollHeight
        }
    }, [messages])

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!content.trim() || isSending) return
        onSendMessage(content)
        setContent("")
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 min-h-[4rem]">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" className="md:hidden mr-2 -ml-2" onClick={onBack}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Avatar>
                        <AvatarFallback>{recipient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-xs text-muted-foreground">{recipient.role}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" disabled>
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
                <div className="flex flex-col gap-4 py-4">
                    {messages.map((message) => {
                        const isOwn = message.sender_id !== recipient.id // If sender is not recipient, it's me
                        // Or better, check is_own flag from API if available, else rely on logic
                        // In API we set is_own.
                        const isMe = message.is_own ?? (message.sender_id !== recipient.id);

                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex w-max max-w-[75%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm",
                                    isMe
                                        ? "ml-auto bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted rounded-tl-none"
                                )}
                            >
                                <div>{message.content}</div>
                                <div className={cn("text-[10px] opacity-70", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                    {format(new Date(message.created_at), "p")}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSending}
                        className="flex-1 bg-background shadow-sm"
                    />
                    <Button type="submit" size="icon" disabled={isSending || !content.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
