'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { chatService } from '@/services/chat';
import { Chat, Request } from '@/types/chat';
import { Send, Plus, MessageSquare, Trash2, Menu, X, Bot, User, Search, Edit, LayoutGrid, ChevronRight, Settings, HelpCircle, MoreVertical, FileText, Zap, Sparkles, Layers } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

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

  const handleCreateChat = async (): Promise<number | null> => {
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
        return newId;
    }

    try {
      const newChat = await chatService.createChat('New Conversation');
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      setMessages([]); // New chat has no messages
      if (window.innerWidth < 768) setSidebarOpen(false); // Close sidebar on mobile
      return newChat.id;
    } catch (error) {
      console.error('Failed to create chat', error);
      return null;
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

  const handleSendMessage = async (e: React.FormEvent | any, forcedContent?: string, forcedChatId?: number) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Allow sending if forcedContent is provided (from suggestion buttons) even if inputValue is empty
    const content = forcedContent || inputValue;
    // Determine the active chat ID, preferring the forced one if available
    const activeChatId = forcedChatId || currentChatId;
    
    if (!content.trim() || !activeChatId) return;

    if (!forcedContent) setInputValue('');
    setLoading(true);

    // Optimistically add user message
    const tempMessage: Request = {
        id: Date.now(), // Temporary ID
        request: content,
        response: '',
        chat_id: activeChatId,
        CreatedAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);

    const activeChat = chats.find(c => c.id === activeChatId);
    let newTopic = '';
    
    // Auto-rename chat if it says "New Conversation" OR "New Chat" OR if we can't find it (created in this flow)
    const isNew = !activeChat || activeChat.topic === 'New Conversation' || activeChat.topic === 'New Chat';
    
    if (isNew) {
          // Generate topic from the first ~30 chars
        newTopic = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        
        // Optimistic update
        setChats(prev => prev.map(c => 
            c.id === activeChatId ? { ...c, topic: newTopic } : c
        ));
    }

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
      const [sendResult, updateResult] = await Promise.all([
          chatService.sendMessage(activeChatId, content),
          newTopic ? chatService.updateChat(activeChatId, newTopic) : Promise.resolve(null)
      ]);
      
      // Refresh messages to get the AI response/proper DB IDs
      await fetchMessages(activeChatId);
    } catch (error) {
      console.error('Failed to send message', error);
      // Remove the optimistic message or show error
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (prompt: string) => {
      // Logic:
      // 1. If we have a current chat (currentChatId), send message there.
      // 2. If no current chat, create one, then send message.
      
      let targetChatId = currentChatId;

      if (!targetChatId) {
          setLoading(true); // Show loading immediately
          const newId = await handleCreateChat();
          if (newId) {
              targetChatId = newId;
          } else {
              setLoading(false);
              return; // Failed to create chat
          }
      }
      
      // Send the prompt as a message
      handleSendMessage(null, prompt, targetChatId);
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
        fixed inset-y-0 left-0 z-30 w-72 transform border-r border-white/10 bg-[#0b0b0b] ease-smooth md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:!w-0 md:!border-r-0 md:!overflow-hidden'}
      `}
      style={{
          transitionDuration: '400ms'
      }}
      >
         <div className="flex h-full flex-col">
            {/* Top Bar: New Chat & Search */}
            <div className="px-4 pt-6 pb-2 flex items-center justify-between">
                <button 
                    onClick={handleCreateChat}
                    className="flex items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-2.5 text-sm transition-all hover:bg-[#2c2c2c] active:scale-95 text-zinc-200"
                >
                    <Plus className="h-4 w-4" />
                    <span className="font-medium mr-1">New Chat</span>
                </button>
                
                <div className="flex items-center">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {/* My Information Section */}
                <div className="mt-6 mb-2">
                    <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-lg cursor-pointer group">
                        <span>My Information</span>
                        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                   
                    {/* Thumbnails Scroller - Hidden in this 'Real' version to declutter as requested */}
                    {/*
                    <div className="flex gap-2 overflow-x-auto px-3 py-2 pb-4 scrollbar-none mask-linear-fade">
                        ...
                    </div>
                    */}
                </div>

                {/* Gem Section - REMOVED for clean 'ReadSum' focus */}

                {/* Chats List Section */}
                <div className="mt-2">
                    <div className="px-3 py-2 text-xs font-medium text-zinc-500">Recent Chats</div>
                    <div className="space-y-0.5">
                    {chats.map((chat) => (
                        <div
                        key={chat.id}
                        onClick={() => {
                            setCurrentChatId(chat.id);
                            if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`group relative flex cursor-pointer items-center justify-between rounded-full px-4 py-2.5 text-sm transition-all duration-200 ${
                            currentChatId === chat.id
                            ? 'bg-[#1e1e1e] text-white font-medium'
                            : 'text-zinc-400 hover:bg-[#1e1e1e]/50 hover:text-zinc-200'
                        }`}
                        >
                        <span className="truncate pr-8">{chat.topic || `Chat ${chat.id}`}</span>
                        
                        {/* More Options / Delete */}
                        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center z-10">
                            <button
                                onClick={(e) => handleDeleteChat(e, chat.id)}
                                className="p-1.5 hover:bg-zinc-700/50 rounded-full text-zinc-500 hover:text-red-400 transition-colors"
                            >
                                <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            {/* Bottom: Settings */}
            <div className="p-3 mt-auto border-t border-white/5">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                    <Settings className="h-5 w-5" />
                    <span>Settings & Help</span>
                </button>
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full relative transition-all duration-400 ease-smooth">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-4 sticky top-0 z-10 w-full mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium text-zinc-200">ReadSum</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#1e1e1e] flex items-center px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-xs font-medium text-zinc-300">PRO</span>
            </div>
             <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 ring-2 ring-white/10"></div>
          </div>
        </header>

        {/* Chat Content or Home Greeting */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* 1. HOME GREETING VIEW (Show if no messages yet) */}
          {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center p-4 animate-fade-in">
                {/* Greeting */}
                <div className="mb-12 text-left w-full max-w-3xl">
                    <h1 className="text-5xl font-medium tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-2">
                        Hello, Wisit
                    </h1>
                    <h2 className="text-5xl font-medium text-zinc-500 tracking-tight">
                        Where shall we start?
                    </h2>
                </div>

                {/* Input Area (Centered) */}
                <div className="w-full max-w-3xl mb-8 relative z-20">
                     <div className="bg-[#1e1e1e] rounded-[2rem] p-4 pr-6 transition-all hover:bg-[#252525] group border border-transparent focus-within:border-white/10 focus-within:bg-[#252525]">
                         <form
                            onSubmit={(e) => handleSendMessage(e)}
                            className="flex flex-col gap-3"
                          >
                           <input
                             type="text"
                             value={inputValue}
                             onChange={(e) => setInputValue(e.target.value)}
                             placeholder="Ask ReadSum to summarize, explain, or generate quiz..."
                             className="bg-transparent border-none outline-none text-lg text-white w-full px-4 placeholder:text-zinc-500"
                           />
                           <div className="flex items-center justify-between px-2">
                              <div className="flex gap-2">
                                  <button type="button" className="p-2 rounded-full hover:bg-white/10 text-zinc-400 transition-colors">
                                      <Plus className="h-5 w-5" />
                                  </button>
                                  <button type="button" className="p-2 rounded-full hover:bg-white/10 text-zinc-400 transition-colors">
                                      <LayoutGrid className="h-5 w-5" />
                                  </button>
                              </div>
                              <button 
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="p-2 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:bg-transparent disabled:text-zinc-500 transition-all font-medium"
                              >
                                  {inputValue.trim() ? <Send className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                              </button>
                           </div>
                         </form>
                     </div>
                </div>

                {/* Chip Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center max-w-3xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <button 
                        onClick={() => handleSuggestionClick("Summarize the key points from the document.")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e1e1e] hover:bg-[#2c2c2c] border border-white/5 transition-all text-sm text-zinc-300 hover:scale-105 active:scale-95"
                    >
                        <FileText className="h-4 w-4 text-purple-400" />
                        <span>Summarize PDF</span>
                    </button>
                    <button 
                        onClick={() => handleSuggestionClick("Generate a 10-question multiple choice quiz about the last topic.")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e1e1e] hover:bg-[#2c2c2c] border border-white/5 transition-all text-sm text-zinc-300 hover:scale-105 active:scale-95"
                    >
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span>Generate Quiz</span>
                    </button>
                    <button 
                        onClick={() => handleSuggestionClick("Explain this concept like I'm 5 years old.")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e1e1e] hover:bg-[#2c2c2c] border border-white/5 transition-all text-sm text-zinc-300 hover:scale-105 active:scale-95"
                    >
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        <span>Explain Concept</span>
                    </button>
                    <button 
                        onClick={() => handleSuggestionClick("Create 5 flashcards for this material (Front/Back).")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e1e1e] hover:bg-[#2c2c2c] border border-white/5 transition-all text-sm text-zinc-300 hover:scale-105 active:scale-95"
                    >
                        <Layers className="h-4 w-4 text-green-400" />
                        <span>Flashcards</span>
                    </button>
                </div>
             </div>
          ) : (
            /* 2. CHAT MESSAGE LIST VIEW */
            <div className="h-full overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 mb-20">
                <div className="mx-auto max-w-3xl space-y-6">

              {messages.map((msg, index) => (
                <div key={index} className="space-y-6 animate-slide-up">
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
          </div>
        )}
      </div>

        {/* Input Area - SHOW ONLY IF CHAT MSG LIST IS ACTIVE (currentChatId not null) */}
        {(messages.length > 0 || currentChatId) && (
            <div className="border-t border-white/5 bg-[#0b0b0b] p-4 sticky bottom-0 z-20">
                <div className="mx-auto max-w-3xl">
                    <div className="relative flex items-end gap-2 rounded-[24px] bg-[#1e1e1e] border border-transparent focus-within:border-white/10 p-2 pl-4 transition-colors">
                            <div className="flex items-center gap-1 self-center pb-1">
                                <button className="p-2 rounded-full hover:bg-white/10 text-zinc-400 transition-colors">
                                    <Plus className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-white/10 text-zinc-400 transition-colors hidden sm:block">
                                    <LayoutGrid className="h-5 w-5" />
                                </button>
                            </div>
                            <form
                                className="flex-1 flex items-center min-h-[50px]"
                                onSubmit={(e) => handleSendMessage(e)}
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Message current chat..."
                                    className="w-full bg-transparent border-none px-2 py-3 text-white placeholder-zinc-500 focus:outline-none max-h-32 text-base"
                                />
                                <button
                                    disabled={!inputValue.trim() || loading}
                                    type="submit" 
                                    className="p-2 rounded-full text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors self-end mb-1"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                    </div>
                    <div className="mt-2 text-center text-xs text-zinc-500">
                        Gemini can make mistakes. Verify important info.
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

