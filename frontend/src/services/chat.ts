import api from '@/lib/axios';
import { Chat, Request } from '@/types/chat';

export const chatService = {
  // Get all chats for the user
  async getChats() {
    const response = await api.get<{ chats: Chat[] }>('/api/v1/chats/');
    return response.data.chats;
  },

  // Create a new chat (optionally with an initial topic, or empty)
  async createChat(topic: string = 'New Chat') {
    const response = await api.post<Chat>('/api/v1/chats/', { topic });
    return response.data;
  },

  // Get messages for a specific chat
  async getMessages(chatId: number) {
    const response = await api.get<{ data: { index: number; role: string; text: string; created_at: string }[] }>(`/api/v1/chats/${chatId}/messages/`);
    
    // Transform flat list (User, Assistant) into Paired Requests (Request, Response)
    const flatMessages = response.data.data || [];
    const paired: Request[] = [];
    
    let currentPair: any = null;
    
    flatMessages.forEach(msg => {
        if (msg.role === 'user') {
            if (currentPair) paired.push(currentPair); // Push previous pair
            currentPair = {
                id: msg.index,
                request: msg.text,
                response: '',
                chat_id: chatId,
                CreatedAt: msg.created_at
            };
        } else if (msg.role === 'assistant') {
            if (currentPair) {
                currentPair.response = msg.text;
                paired.push(currentPair);
                currentPair = null;
            } else {
                 // Standalone assistant message (shouldn't happen often, but handle it)
                 paired.push({
                    id: msg.index,
                    request: '',
                    response: msg.text,
                    chat_id: chatId,
                    CreatedAt: msg.created_at
                 });
            }
        }
    });
    
    if (currentPair) paired.push(currentPair); // Push last pending
    
    return paired;
  },

  // Send a message
  async sendMessage(chatId: number, content: string) {
    // Backend expects { text: "...", role: "user" }
    const response = await api.post<{ success: boolean; data: any }>(`/api/v1/chats/${chatId}/messages/`, { 
        text: content,
        role: "user"
    });
    return response.data;
  },

  // Delete a chat
  async deleteChat(chatId: number) {
    await api.delete(`/api/v1/chats/${chatId}`);
  },

  // Update chat topic
  async updateChat(chatId: number, topic: string) {
    const response = await api.patch<{ success: boolean; data: Chat }>(`/api/v1/chats/${chatId}`, { title: topic });
    return response.data.data;
  }
};
