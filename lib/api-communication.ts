import api from "./api"

export interface MessageUser {
    id: number
    name: string
    role: string
    avatar?: string
}

export interface Message {
    id: number
    conversation_id?: number
    sender_id: number
    content: string
    created_at: string
    sender?: MessageUser
    is_own?: boolean
    context_type?: string
    context_id?: number
}

export interface Conversation {
    id: number
    type: 'direct' | 'group'
    user: MessageUser // Display user for direct chat
    last_message: {
        content: string
        created_at: string
        is_own: boolean
    } | null
    unread_count: number
    updated_at: string
}

export const getConversations = async (): Promise<Conversation[]> => {
    const { data } = await api.get("/messages/conversations")
    return data
}

export const getMessages = async (id: number): Promise<Message[]> => {
    const { data } = await api.get(`/messages/${id}`)
    return data
}

export const sendMessage = async (data: {
    recipient_id?: number;
    conversation_id?: number;
    content: string;
    context_type?: string;
    context_id?: number;
}): Promise<Message> => {
    const { data: response } = await api.post("/messages", data)
    return response
}

export const markRead = async (id: number): Promise<void> => {
    await api.post(`/messages/${id}/read`)
}

export const searchUsers = async (query: string = ""): Promise<MessageUser[]> => {
    const { data } = await api.get(`/messages/users?query=${encodeURIComponent(query)}`)
    return data
}

export const getUnreadCount = async (): Promise<number> => {
    const { data } = await api.get("/messages/unread-count")
    return data.count
}
