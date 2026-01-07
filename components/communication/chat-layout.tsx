"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"
import { getConversations, getMessages, sendMessage, markRead, type Conversation, type Message, type MessageUser } from "@/lib/api-communication"
import { Loader2, MessageSquarePlus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"

import { useSearchParams } from "next/navigation"
import { getUser } from "@/lib/api-users"

export function ChatLayout() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedUser, setSelectedUser] = useState<MessageUser | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const lastReadMessageId = useRef<number | null>(null)

    // Handle deep link to specific chat
    useEffect(() => {
        const checkParams = async () => {
            const recipientId = searchParams?.get('recipientId')
            if (recipientId && user) {
                const userId = parseInt(recipientId)
                if (isNaN(userId)) return

                // Check if we already have this conversation loaded
                // Note: conversations might be empty if still loading, 
                // so we might want to wait or just fetch User to be safe/fast
                const existing = conversations.find(c => c.user.id === userId)

                if (existing) {
                    setSelectedUser(existing.user)
                } else {
                    // Fetch user details if not in current list
                    try {
                        const userData = await getUser(userId)
                        if (userData) {
                            setSelectedUser({
                                id: userData.id,
                                name: userData.name,
                                role: userData.roles?.[0]?.name || 'User',
                                avatar: undefined // Profile image not in User interface explicitly unless I missed it, but StudentController constructs it. User interface has?
                            })
                        }
                    } catch (error) {
                        console.error("Failed to fetch recipient details", error)
                    }
                }
            }
        }

        // Run check when params change or conversations load (to find existing)
        checkParams()
    }, [searchParams, user, conversations.length]) // Depend on length to re-check when conversations load

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
            const conversationId = conversations.find(c => c.user.id === userId)?.id

            let data;
            if (conversationId) {
                data = await getMessages(conversationId, false)
            } else {
                // If no conversation exists yet, we are fetching by USER ID
                data = await getMessages(userId, true)
            }
            setMessages(data)

            // Intelligent Mark Read: Only mark if we have messages AND the last message is new to us
            if (data.length > 0) {
                const lastMsg = data[data.length - 1]
                if (lastMsg.id !== lastReadMessageId.current) {
                    if (conversationId) {
                        await markRead(conversationId)
                    } else {
                        await markRead(userId)
                    }
                    lastReadMessageId.current = lastMsg.id
                }
            }
        } catch (error) {
            console.error("Failed to fetch messages", error)
        }
    }, [conversations, user])

    // Reset read tracker when switching users
    useEffect(() => {
        lastReadMessageId.current = null
    }, [selectedUser])

    useEffect(() => {
        if (selectedUser && user) {
            fetchMessages(selectedUser.id)
            const interval = setInterval(() => fetchMessages(selectedUser.id), 3000)

            // If we just started a chat (selectedUser set), and send a message, we want list to update.
            // Also if we selected a user that WASNT in list, we want to refresh list eventually?
            // Existing poll handles it.

            return () => clearInterval(interval)
        }
    }, [selectedUser, fetchMessages, user])

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
