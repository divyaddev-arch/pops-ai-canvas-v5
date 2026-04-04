import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { AiInput } from '../../packages/design-vibe/ue/aiinput/AiInput';
import { Icon, IconButton, Card } from '../../packages/design-vibe/gm3-react-components/src';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const ChatCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm your Empathetic Performance Coach. How can I help you prepare for a conversation or navigate a growth challenge today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: `You are an Empathetic Performance Coach at Google. 
          Your goal is to help managers and employees navigate performance conversations with high empathy, clarity, and a focus on growth.
          Use a supportive, professional, and constructive tone. 
          Follow Google's coaching principles: focus on specific behaviors, impact, and shared solutions.
          Help users prepare for difficult talks, structure feedback, or brainstorm development goals.
          Keep responses concise but deeply supportive.`,
        },
      });

      // We need to send the history to maintain context
      // For simplicity in this demo, we'll just send the current message
      // but in a real app we'd map messages to the GenAI format
      const response = await chat.sendMessage({ message: text });
      
      const modelMessage: Message = {
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that. Could you try rephrasing?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm having a little trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant shadow-elevation-1">
      {/* Chat Header */}
      <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary-container text-on-primary-container">
            <Icon>psychology</Icon>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Empathetic Coach</h3>
            <p className="text-xs text-on-surface-variant">Always here to support your growth</p>
          </div>
        </div>
        <IconButton>
          <Icon>more_vert</Icon>
        </IconButton>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-surface-container-lowest"
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-secondary-container text-on-secondary-container rounded-tr-none' 
                    : 'bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant'
                }`}
              >
                <div className="markdown-body prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
              <span className="text-[10px] text-on-surface-variant opacity-60 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-surface-container-high p-4 rounded-2xl rounded-tl-none border border-outline-variant flex gap-1">
              <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-surface border-t border-outline-variant">
        <AiInput 
          onSend={handleSend}
          placeholder="Ask for coaching advice, feedback structure, or growth tips..."
        />
        <p className="text-[10px] text-center text-on-surface-variant mt-3 opacity-60">
          Coach AI can provide guidance but use your best judgment for sensitive human situations.
        </p>
      </div>
    </div>
  );
};

export default ChatCoach;
