import React from 'react';
import { generateChatResponseNew, generateChatResponse } from '../../src/services/geminiService';
import { PromptInput } from '../gm3-react-components/PromptInput';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface ChatViewProps {
  userName?: string;
  systemInstruction?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  userName = 'Elisa',
  systemInstruction = 'You are a helpful HR assistant.'
}) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Save to recent chats in local storage
    if (typeof window !== 'undefined') {
      const recentChats = JSON.parse(localStorage.getItem('recent_chats') || '[]');
      recentChats.unshift({
        id: Date.now().toString(),
        prompt: input,
        date: new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      });
      localStorage.setItem('recent_chats', JSON.stringify(recentChats.slice(0, 20)));
    }

    setIsLoading(true);

    try {
      let response = '';
      try {
        response = await generateChatResponseNew(input, systemInstruction);
      } catch (err) {
        console.warn("generateChatResponseNew failed, trying fallback:", err);
        const fallbackPrompt = `${systemInstruction}\n\n${input}`;
        response = await generateChatResponse(fallbackPrompt);
      }
      const agentMessage: Message = { role: 'agent', content: response };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = { role: 'agent', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-112px)] flex flex-col font-google-sans relative" id="chat-view">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0 overflow-y-auto">
        {messages.length === 0 ? (
          /* Welcome Section from JSON */
          <div className="text-center space-y-2 flex flex-col items-center" id="welcome-text">
            <h1 className="text-2xl font-medium bg-gradient-to-r from-[#078EFB] to-[#AC87EB] bg-clip-text text-transparent">
              Hello, {userName}
            </h1>
            <p className="text-3xl font-normal text-[#1F1F1F]">
              How can I help today?
            </p>
          </div>
        ) : (
          /* Chat History (Simple for now) */
          <div className="w-full max-w-3xl space-y-6" id="chat-history">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#E9EEF6] text-[#1F1F1F]' : 'bg-[#F0F4F9] text-[#1F1F1F]'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#F0F4F9] p-4 rounded-2xl text-[#444746]">
                  Typing...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area at Bottom */}
      <div className="w-full flex flex-col items-center pt-4 pb-6 px-4 sticky bottom-0 z-10" id="input-area">
        {/* Chips Cluster above input */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center" id="intent-chips">
            <button className="bg-[#EBF2FE] text-[#0842A0] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#D3E3FD] transition-colors">
              Get support from People Ops
            </button>
            <button className="bg-[#E9EEF6] text-[#1F1F1F] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#DFE4EC] transition-colors">
              What can you do?
            </button>
            <button className="bg-[#E9EEF6] text-[#1F1F1F] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#DFE4EC] transition-colors">
              Book vacation
            </button>
            <button className="bg-[#E9EEF6] text-[#1F1F1F] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#DFE4EC] transition-colors">
              Grow in my role
            </button>
          </div>
        )}

        {/* Input Field from JSON */}
        <div className="relative w-full max-w-3xl" id="prompt-input">
          <PromptInput 
            onSubmit={handleSend}
            loading={isLoading}
            appearance="embedded"
            placeholder="Ask a question"
          />

          {/* Disclaimer */}
          <p className="text-xs text-[#444746] text-center mt-3">
            AI sometimes generates inaccurate info, so double-check responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
