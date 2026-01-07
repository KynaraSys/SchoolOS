"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { Conversation, MessageUser } from "@/lib/api-communication"
import { searchUsers } from "@/lib/api-communication"

interface ConversationListProps {
    conversations: Conversation[]
    selectedUserId: number | null
    onSelectUser: (user: MessageUser) => void
}

export function ConversationList({ conversations, selectedUserId, onSelectUser }: ConversationListProps) {
    const [search, setSearch] = useState("")
    const [isNewChatOpen, setIsNewChatOpen] = useState(false)
    const [userQuery, setUserQuery] = useState("")
    const [foundUsers, setFoundUsers] = useState<MessageUser[]>([])

    const filtered = conversations.filter(c =>
        c.user.name.toLowerCase().replace(/\s+/g, "").includes(search.toLowerCase().replace(/\s+/g, "")) ||
        c.user.role.toLowerCase().replace(/\s+/g, "").includes(search.toLowerCase().replace(/\s+/g, ""))
    )

    useEffect(() => {
        if (!isNewChatOpen) return

        const timer = setTimeout(async () => {
            const users = await searchUsers(userQuery)
            setFoundUsers(users)
        }, 300)
        return () => clearTimeout(timer)
    }, [userQuery, isNewChatOpen])

    const handleStartChat = (user: MessageUser) => {
        onSelectUser(user)
        setIsNewChatOpen(false)
        setFoundUsers([])
        setUserQuery("")
    }

    return (
        <div className="flex w-full flex-col border-r h-full bg-muted/10 md:w-80">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Messages</h2>
                    <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Search users..."
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                />
                                <ScrollArea className="h-[200px]">
                                    <div className="space-y-2">
                                        {foundUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleStartChat(user)}
                                                className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent text-left"
                                            >
                                                <Avatar>
                                                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.role}</div>
                                                </div>
                                            </button>
                                        ))}
                                        {foundUsers.length === 0 && (
                                            <div className="text-center text-sm text-muted-foreground py-4">
                                                No users found.
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter conversations..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-0.5 p-2">
                    {filtered.map((conv) => (
                        <button
                            key={conv.user.id}
                            onClick={() => onSelectUser(conv.user)}
                            className={cn(
                                "flex flex-col items-start gap-2 rounded-lg p-3 text-left text-sm transition-all hover:bg-accent",
                                selectedUserId === conv.user.id && "bg-accent"
                            )}
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Avatar>
                                        <AvatarFallback>{conv.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-0.5 truncate">
                                        <span className="font-semibold">{conv.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{conv.user.role}</span>
                                    </div>
                                </div>
                                {conv.unread_count > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                        {conv.unread_count}
                                    </span>
                                )}
                            </div>
                            <div className="flex w-full items-center justify-between">
                                <span className="line-clamp-1 w-full truncate text-xs text-muted-foreground">
                                    {conv.last_message ? (
                                        <>
                                            {conv.last_message.is_own && "You: "}{conv.last_message.content}
                                        </>
                                    ) : (
                                        <span className="italic">No messages yet</span>
                                    )}
                                </span>
                                {conv.last_message && (
                                    <span className="ml-auto text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: true })}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No conversations found.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
