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
    const response = await api.get<{ messages: Request[] }>(`/api/v1/chats/${chatId}/messages/`);
    // API might return "messages" or just the array. Adjust based on backend response.
    // Looking at go handler previously, it usually returns JSON with a key.
    return response.data.messages;
  },

  // Send a message
  async sendMessage(chatId: number, content: string) {
    // The backend expects json like { "request": "hello" }
    const response = await api.post<{ response: string; request: Request }>(`/api/v1/chats/${chatId}/messages/`, { request: content });
    return response.data;
  },

  // Delete a chat
  async deleteChat(chatId: number) {
    await api.delete(`/api/v1/chats/${chatId}`);
  }
};
