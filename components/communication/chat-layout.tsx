"use client"

import { useEffect, useState, useCallback } from "react"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"
import { getConversations, getMessages, sendMessage, markRead, type Conversation, type Message, type MessageUser } from "@/lib/api-communication"
import { Loader2, MessageSquarePlus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"

export function ChatLayout() {
    const { user } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        if (!user) return
        try {
            const data = await getConversations()
            setConversations(data)
        } catch (error) {
            console.error("Failed to fetch conversations", error)
        } finally {
            setIsLoading(false)
        }
    }, [user])

    // Initial load
    useEffect(() => {
        if (!user) return
        fetchConversations()
        const interval = setInterval(fetchConversations, 10000) // Poll list every 10s
        return () => clearInterval(interval)
    }, [fetchConversations, user])

    // Helper to find conversation
    const getConversationId = (userId: number) => {
        return conversations.find(c => c.user.id === userId)?.id
    }

    // Fetch messages when user selected
    const fetchMessages = useCallback(async (userId: number) => {
        if (!user) return
        try {
            // Determine ID to fetch: Preference Conversation ID, fallback User ID (backend handles split)
            // Ideally we need the Conversation ID to be precise. 
            // The list of conversations might NOT be loaded or up to date yet if we just searched a user.
            // But we can check our list.
            const conversationId = conversations.find(c => c.user.id === userId)?.id

            // If we have a conversation ID, use it. Otherwise pass User ID (backend 'show' tries to resolve)
            const idToFetch = conversationId || userId

            const data = await getMessages(idToFetch)
            setMessages(data)

            // Mark read
            if (conversationId) {
                await markRead(conversationId)
            } else {
                // If it was a user ID and backend resolved it, great. 
                // Using the same ID for markRead might fail if backend expects Conv ID only.
                // But my backend 'markRead' ALSO supports User ID fallback.
                await markRead(userId)
            }
        } catch (error) {
            console.error("Failed to fetch messages", error)
        }
    }, [conversations, user])

    useEffect(() => {
        if (selectedUser && user) {
            fetchMessages(selectedUser.id)
            const interval = setInterval(() => fetchMessages(selectedUser.id), 3000)
            fetchConversations()
            return () => clearInterval(interval)
        }
    }, [selectedUser, fetchMessages, fetchConversations, user])

    const handleSelectUser = (user: MessageUser) => {
        setSelectedUser(user)
    }

    const handleSendMessage = async (content: string) => {
        if (!selectedUser) return
        setIsSending(true)
        try {
            const conversationId = getConversationId(selectedUser.id)

            const payload = conversationId
                ? { conversation_id: conversationId, content }
                : { recipient_id: selectedUser.id, content }

            const newMessage = await sendMessage(payload)
            setMessages(prev => [...prev, { ...newMessage, is_own: true }])
            fetchConversations()
        } catch (error) {
            console.error("Failed to send message", error)
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading && conversations.length === 0) {
        return (
            <div className="absolute top-28 bottom-4 left-4 right-4 flex items-center justify-center bg-background border rounded-lg shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="fixed top-28 bottom-4 left-4 right-4 z-30 md:static md:z-0 md:h-[calc(100vh-12rem)] md:w-full flex w-auto overflow-hidden bg-background border rounded-lg shadow-sm">
            <div className={cn("h-full border-r", selectedUser ? "hidden md:block" : "w-full md:w-auto")}>
                <ConversationList
                    conversations={conversations}
                    selectedUserId={selectedUser?.id || null}
                    onSelectUser={handleSelectUser}
                />
            </div>

            <div className={cn("flex-1 flex flex-col", !selectedUser ? "hidden md:flex" : "flex")}>
                {selectedUser ? (
                    <ChatWindow
                        recipient={selectedUser}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isSending={isSending}
                        onBack={() => setSelectedUser(null)}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-muted-foreground">
                        <div className="p-4 bg-muted rounded-full">
                            <MessageSquarePlus className="h-8 w-8" />
                        </div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    )
}
