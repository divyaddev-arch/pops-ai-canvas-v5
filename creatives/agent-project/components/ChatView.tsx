import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton, Icon, Chip, Button } from '../../../packages/design-vibe/gm3-react-components/src';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

interface ChatViewProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text?: string) => void;
  isThinking: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  starterChips?: string[];
  onSupportClick?: () => void;
  title?: string;
  subtitle?: string;
  summary?: string;
  children?: React.ReactNode;
}

/**
 * ChatView Component - AI Studio Stability Standard
 * 
 * DESIGN RULES:
 * 1. Leading Edge: Rounded corners (28px) on the left side for a modern Material 3 feel.
 * 2. Stability: Mandatory 'overscroll-contain' to prevent parent scroll chaining.
 * 3. Isolation: Uses targeted ref.scrollTo() to avoid global window scroll jumps.
 */
export const ChatView: React.FC<ChatViewProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isThinking,
  inputValue,
  onInputChange,
  starterChips = [],
  onSupportClick,
  title = "AI Coach",
  subtitle = "Active Session • AI Advisor",
  summary = "I'm helping you navigate your performance review and growth plan with empathy.",
  children
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Rule: Always use targeted scrollTo on the container ref to avoid breaking global UI positioning
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-[400px] bg-white border-l border-outline-variant/20 shadow-elevation-3 z-50 flex flex-col rounded-l-[28px] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D3E3FD] flex items-center justify-center">
                <Icon className="text-[#0842A0] !text-[20px]">auto_awesome</Icon>
              </div>
              <div>
                <h2 className="text-[16px] font-medium text-on-surface">{title}</h2>
                <p className="text-[11px] text-on-surface-variant">{subtitle}</p>
              </div>
            </div>
            <IconButton onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </div>

          {/* Summary Section - Rule: Always have a summary at the top */}
          <div className="px-6 py-3 bg-secondary-container/30 border-b border-outline-variant/30">
            <div className="flex items-start gap-2">
              <Icon className="text-primary !text-[16px] mt-0.5">info</Icon>
              <p className="text-[12px] text-on-secondary-container font-medium leading-tight">
                {summary}
              </p>
            </div>
          </div>

          {/* Messages Container - Rule: overscroll-contain is mandatory here */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 overscroll-contain"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-[16px] text-[14px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary-container text-on-primary-container rounded-tr-[4px]' 
                    : 'bg-surface-container-high text-on-surface rounded-tl-[4px]'
                }`}>
                  {msg.isLoading ? (
                    <div className="flex gap-1 py-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            {children}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-outline-variant bg-surface">
            {starterChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {starterChips.map(chip => (
                  <Chip 
                    key={chip} 
                    label={chip} 
                    onClick={() => onSendMessage(chip)}
                    className="!bg-surface-container-high !border-none"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 p-2 bg-surface-container-high rounded-[24px] border border-outline">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-1 text-[14px]"
              />
              <IconButton 
                onClick={() => onSendMessage()}
                disabled={!inputValue.trim() || isThinking}
                className="!bg-primary !text-on-primary disabled:!bg-surface-container-high disabled:!text-on-surface-variant"
              >
                <Icon>{isThinking ? 'hourglass_empty' : 'send'}</Icon>
              </IconButton>
            </div>

            {onSupportClick && (
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={onSupportClick}
                  className="!text-primary !text-[12px]"
                >
                  <Icon className="mr-2 !text-[16px]">contact_support</Icon>
                  Get support from People Ops
                </Button>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
