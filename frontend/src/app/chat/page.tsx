'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { chatService } from '@/services/chat';
import { Chat, Request } from '@/types/chat';
import { Send, Plus, MessageSquare, Trash2, Menu, X, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Request[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages when current chat changes
  useEffect(() => {
    if (currentChatId) {
      if (!chats.find(c => c.id === currentChatId)) {
          // If current chat ID is not in the list (e.g. after deletion), reset
          setCurrentChatId(null);
          setMessages([]);
      } else {
          fetchMessages(currentChatId);
      }
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    // Check if user is logged in (has token)
    const token = localStorage.getItem('token');
    if (!token) {
        // Preview Mode: Load mock data immediately without calling API
        const mockChats: Chat[] = [
            { id: 1, topic: 'Machine Learning Basics', user_id: 1, created_at: '', requests: [] },
            { id: 2, topic: 'React vs Vue', user_id: 1, created_at: '', requests: [] },
            { id: 3, topic: 'Go Fiber Setup', user_id: 1, created_at: '', requests: [] },
        ];
        setChats(mockChats);
        return;
    }

    try {
      const data = await chatService.getChats();
      setChats(data || []);
      if (data && data.length > 0 && !currentChatId) {
         // Optionally select the most recent chat
         // setCurrentChatId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch chats', error);
    }
  };

  const fetchMessages = async (chatId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Find the chat object to see if it has requests stored in it (for newly created mock chats)
        const chat = chats.find(c => c.id === chatId);
        
        // If it's a new empty mock chat, don't load fake history
        if (chat && chat.topic === 'New Conversation' && (!chat.requests || chat.requests.length === 0)) {
            setMessages([]);
            return;
        }

       // Only load these specific static messages for the specific static IDs
       // otherwise return empty or the chat's own messages
       if (chatId === 1) {
            setMessages([
                { id: 101, chat_id: 1, request: 'Can you explain how Transformer models work in simple terms? I am looking for a high-level overview.', response: 'Transformer models are a type of neural network architecture introduced by Google in 2017. They are designed to handle sequential data, like text, but unlike previous models (RNNs), they can process the entire input at once using a mechanism called "Self-Attention".\n\nThink of it like reading a sentence: instead of reading one word at a time, a Transformer looks at the whole sentence simultaneously and understands the relationship between every word, regardless of how far apart they are. This makes them incredibly fast and effective for tasks like translation and text generation.', CreatedAt: '' },
                { id: 102, chat_id: 1, request: 'That sounds impressive. What are the key components?', response: 'The key components are:\n\n1. **Encoder:** Processes the input data.\n2. **Decoder:** Generates the output.\n3. **Self-Attention Mechanism:** Weighs the importance of different words in the sequence.\n4. **Positional Encoding:** Helps the model understand the order of words since it processes them in parallel.', CreatedAt: '' }
            ]);
       } else if (chatId === 2) {
           setMessages([
               { id: 201, chat_id: 2, request: 'Compare React and Vue', response: 'React is a library, Vue is a framework. Both use Virtual DOM.', CreatedAt: '' }
           ]);
       } else {
           setMessages([]);
       }
       return;
    }

    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data || []);
    } catch (error) {
       console.error('Failed to fetch messages', error);
    }
  };

  const handleCreateChat = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Preview Mode
        const newId = (chats.length > 0 ? Math.max(...chats.map(c => c.id)) : 0) + 1;
        const newMockChat: Chat = {
            id: newId,
            topic: 'New Conversation',
            user_id: 1,
            created_at: new Date().toISOString(),
            requests: []
        };
        // Ensure we create a NEW array reference
        setChats(prev => [newMockChat, ...prev]);
        // Set ID immediately
        setCurrentChatId(newId);
        // Clear messages for the new blank chat
        setMessages([]);
        if (window.innerWidth < 768) setSidebarOpen(false);
        return;
    }

    try {
      const newChat = await chatService.createChat('New Conversation');
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      setMessages([]); // New chat has no messages
      if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar on mobile
    } catch (error) {
      console.error('Failed to create chat', error);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
        // Preview Mode
        setChats(chats.filter(c => c.id !== chatId));
        if (currentChatId === chatId) {
            setCurrentChatId(null);
            setMessages([]);
        }
        return;
    }

    try {
      await chatService.deleteChat(chatId);
      setChats(chats.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | any, forcedContent?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Allow sending if forcedContent is provided (from suggestion buttons) even if inputValue is empty
    const content = forcedContent || inputValue;
    
    if (!content.trim() || !currentChatId) return;

    if (!forcedContent) setInputValue('');
    setLoading(true);

    // Optimistically add user message
    const tempMessage: Request = {
        id: Date.now(), // Temporary ID
        request: content,
        response: '',
        chat_id: currentChatId,
        CreatedAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);

    const token = localStorage.getItem('token');
    if (!token) {
        // Preview Mode: Simulate AI response
        setTimeout(() => {
             const aiResponse = "This is a simulated AI response in Preview Mode. \n\nIn the real app, this would be generated by Google Gemini 2.0 Flash working via Fiber Go Backend.";
             setMessages(prev => prev.map(msg => 
                msg.id === tempMessage.id 
                ? { ...msg, response: aiResponse } 
                : msg
             ));
             setLoading(false);
        }, 1000);
        return;
    }

    try {
      // Send to backend
      await chatService.sendMessage(currentChatId, content);
      
      // Refresh messages to get the AI response and proper DB IDs
      await fetchMessages(currentChatId);
    } catch (error) {
      console.error('Failed to send message', error);
      // Remove the optimistic message or show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
            <div 
                className="fixed inset-0 z-20 bg-black/50 md:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 transform border-r border-white/10 bg-[#0a0a0a] transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          <div className="p-4">
            <button
              onClick={handleCreateChat}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20 hover:text-green-400"
            >
              <Plus className="h-5 w-5" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {chats.length === 0 ? (
                <div className="text-center text-sm text-zinc-500 mt-10">No chats yet.</div>
            ) : (
                <div className="space-y-1">
                {chats.map((chat) => (
                    <div
                    key={chat.id}
                    onClick={() => {
                        setCurrentChatId(chat.id);
                        if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors ${
                        currentChatId === chat.id
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{chat.topic || `Chat ${chat.id}`}</span>
                    </div>
                    
                    <button
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 p-1 hover:text-red-400"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    </div>
                ))}
                </div>
            )}
            
          </div>

          <div className="border-t border-white/10 p-4">
             {/* User profile or settings could go here */}
             <div className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
                <span>User Account</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full relative">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#050505]/80 px-4 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">
                {chats.find(c => c.id === currentChatId)?.topic || (currentChatId ? 'Chat' : 'ReadSum AI')}
            </h1>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {!currentChatId ? (
            <div className="flex h-full flex-col items-center justify-center space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                    Hello, Learner
                </h2>
                <p className="text-2xl text-zinc-400 font-light">How can I help you learn today?</p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                 <button 
                  onClick={() => {
                        handleCreateChat().then(() => {
                           handleSendMessage({ preventDefault: () => {} } as any, "Summarize this article about Quantum Computing");
                        });
                  }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left space-y-1 group"
                 >
                    <span className="block text-white font-medium group-hover:text-purple-400 transition-colors">Summarize Article</span>
                    <span className="block text-sm text-zinc-500">Paste a link or text to get a quick summary</span>
                 </button>
                 <button 
                   onClick={() => {
                        handleCreateChat().then(() => {
                            handleSendMessage({ preventDefault: () => {} } as any, "Explain the concept of Recursion in programming");
                        });
                   }}
                   className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left space-y-1 group"
                 >
                    <span className="block text-white font-medium group-hover:text-blue-400 transition-colors">Explain Concept</span>
                    <span className="block text-sm text-zinc-500">Get clear explanations for complex topics</span>
                 </button>
                 <button 
                   onClick={() => {
                        handleCreateChat().then(() => {
                            handleSendMessage({ preventDefault: () => {} } as any, "Create a study plan for learning Python");
                        });
                   }}
                   className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left space-y-1 group"
                 >
                    <span className="block text-white font-medium group-hover:text-green-400 transition-colors">Study Plan</span>
                    <span className="block text-sm text-zinc-500">Generate a structured learning path</span>
                 </button>
                 <button 
                   onClick={() => {
                        handleCreateChat().then(() => {
                            handleSendMessage({ preventDefault: () => {} } as any, "Quiz me on World History basics");
                        });
                   }}
                   className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left space-y-1 group"
                 >
                    <span className="block text-white font-medium group-hover:text-yellow-400 transition-colors">Quiz Me</span>
                    <span className="block text-sm text-zinc-500">Test your knowledge with interactive quizzes</span>
                 </button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className="space-y-6">
                    {/* User Message */}
                    <div className="flex justify-end">
                        <div className="flex max-w-[85%] gap-2 sm:max-w-[75%]">
                            <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-green-600 to-blue-700 px-4 py-2.5 text-white shadow-lg">
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.request}</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Response */}
                    {msg.response && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[85%] gap-3 sm:max-w-[75%]">
                                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                    <Bot className="h-4 w-4 text-green-400" />
                                </div>
                                <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 px-4 py-3 text-zinc-200">
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.response}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {loading && (
                 <div className="flex justify-start">
                    <div className="flex gap-3">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                            <svg className="h-4 w-4 animate-spin text-green-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        </div>
                        <div className="flex items-center space-x-1 px-2">
                             <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                             <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                             <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-[#050505] p-4">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentChatId ? "Ask anything..." : "Start a new chat to begin..."}
                disabled={loading}
                className="w-full rounded-full border border-white/10 bg-zinc-900/50 px-6 py-4 pr-14 text-white placeholder-zinc-500 backdrop-blur-sm focus:border-white/20 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              />
              <button
                type="submit"
                disabled={loading || (!inputValue.trim() && !currentChatId)}
                onClick={() => {
                    if (!currentChatId) {
                         handleCreateChat().then(() => {
                             // Wait a bit for state update then send ? 
                             // Logic here is tricky because setState is async.
                             // Better to let user create chat first or auto-create on send (complex).
                             // For now, let's keep it simple: Button disabled if no chat, 
                             // UNLESS we want to auto-create.
                         })
                    }
                }}
                className={`absolute right-2 rounded-full p-2.5 text-white transition-all ${
                    inputValue.trim() 
                    ? 'bg-white text-black hover:bg-zinc-200' 
                    : 'bg-transparent text-zinc-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-white" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
              </button>
            </form>
            <div className="mt-3 text-center text-xs text-zinc-500">
               ReadSum can make mistakes. Verify important info.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

