import React from 'react';
import { 
  PromptBlock, 
  ResponseHeader, 
  SourcesButton, 
  FeedbackBar, 
  CanvasControlCard, 
  SuggestionChip 
} from './SideAgentChatComponents';
import { GoogleGenAI } from "@google/genai";

interface SideAgentProps {
  onClose?: () => void;
  onExpand?: () => void;
  onMore?: () => void;
  userName?: string;
  systemInstruction?: string;
}

interface Message {
  type: 'user' | 'agent';
  text: string;
  showSources?: boolean;
  controlCardTitle?: string;
  suggestions?: string[];
}

export const CustomSideAgent: React.FC<SideAgentProps> = ({
  onClose,
  onExpand,
  onMore,
  userName = 'Andie',
  systemInstruction = "You are a helpful assistant for the Google Home application. Help the user with their HR tasks, vacation booking, and other productivity needs."
}) => {
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSend = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    // Add user message
    const newMessages: Message[] = [...messages, { type: 'user', text: trimmedText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({
            role: m.type === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: trimmedText }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const agentText = response.text || "I'm sorry, I couldn't generate a response.";
      
      // Basic parsing for demo purposes (can be improved)
      const agentResponse: Message = {
        type: 'agent',
        text: agentText,
        showSources: agentText.length > 200, // Just a heuristic for the demo
      };

      setMessages([...newMessages, agentResponse]);
    } catch (error) {
      console.error("Error generating agent response:", error);
      setMessages([...newMessages, { type: 'agent', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-[360px] h-full bg-white border border-[#C4C7C5] rounded-2xl flex flex-col font-google-sans overflow-hidden shadow-sm" 
      id="side-agent"
    >
      {/* Side sheet header (Primary) */}
      <div className="w-full h-[72px] flex items-center justify-between px-4 py-4 border-b border-[#E8EAED]" id="side-agent-header">
        <div className="flex items-center gap-2">
          {/* Icon container (Google AI Logo) */}
          <div className="w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 15V15.0087V15C19.3435 14.9996 18.6933 15.129 18.0869 15.3806C17.4804 15.6322 16.9297 16.0011 16.4663 16.4662L17.4838 18L18.5363 18.5362C18.7152 18.3235 18.9396 18.1536 19.193 18.0392C19.4463 17.9248 19.7221 17.8686 20 17.875C20.77 17.875 21.445 18.2712 21.7013 18.9675C21.9575 19.6637 21.8125 20.295 21.375 20.75L20 22.125L17.7313 24.3412L15.375 26.5C13.7338 25.42 12 22.7687 12 20C12.0066 17.8796 12.8487 15.8473 14.3438 14.3437L13.5063 13.0062L12.2338 12.21C11.2072 13.2307 10.3929 14.4446 9.83789 15.7816C9.28287 17.1186 8.9981 18.5523 9.00001 20V20.0212C9.00001 24.375 11.6575 27.2387 12.2138 27.7912C13.5775 29.1487 14.8075 30 15.375 30C15.587 29.9998 15.7967 29.9552 15.9904 29.8691C16.1842 29.7829 16.3578 29.6572 16.5 29.5C16.5 29.5 22.4663 24.1575 22.5 24.125C23.77 22.9 25 21.5275 25 20C25 18.6739 24.4732 17.4021 23.5355 16.4644C22.5979 15.5267 21.3261 15 20 15Z" fill="#4285F4"/>
              <path d="M27.7812 12.225C26.7597 11.203 25.5468 10.3923 24.2119 9.83916C22.877 9.28604 21.4462 9.00134 20.0012 9.00134C18.5562 9.00134 17.1254 9.28604 15.7905 9.83916C14.4556 10.3923 13.2427 11.203 12.2212 12.225L14.3462 14.35C15.8395 12.8531 17.8655 12.0095 19.9799 12.0043C22.0943 11.9992 24.1244 12.8329 25.6249 14.3225L27.3062 13.6837L27.7812 12.225Z" fill="#34A853"/>
              <path d="M19.7088 26.6363L20.0001 26.375L17.7276 24.3375L17.4663 24.585L19.7088 26.6363Z" fill="#185ABC"/>
              <path d="M27.295 26.5687L25.6437 25.6362C25.3245 25.9473 24.9841 26.2359 24.625 26.5L20 22.1337L18.625 20.7587C18.3513 20.458 18.1925 20.0703 18.1765 19.664C18.1605 19.2577 18.2883 18.8588 18.5375 18.5375C18.0375 18.0375 17.0575 17.0475 16.4725 16.46C16.0062 16.9241 15.6361 17.4757 15.3835 18.0832C15.1308 18.6907 15.0005 19.342 15 20C15 21.5 16.095 22.7637 17.375 24.0062C18.5937 25.19 20 26.3812 20 26.3812L23.5 29.5062C23.9362 29.8962 24.25 29.985 24.625 29.985C25.1037 29.985 25.9425 29.53 27.7775 27.7612C27.7787 27.775 27.2887 26.575 27.295 26.5687Z" fill="#EA4335"/>
              <path d="M30.9998 20.0001C31.0017 18.5526 30.7169 17.1191 30.1619 15.7823C29.6068 14.4455 28.7926 13.2318 27.7661 12.2113L25.6473 14.3363C26.3936 15.0785 26.9857 15.9611 27.3895 16.9331C27.7932 17.9052 28.0006 18.9475 27.9998 20.0001C28.004 21.0467 27.7987 22.0836 27.3959 23.0496C26.9932 24.0157 26.4012 24.8913 25.6548 25.6251L25.6436 25.6363L27.7773 27.7776C28.799 26.7587 29.6096 25.5483 30.1626 24.2156C30.7155 22.8829 31.0001 21.4542 30.9998 20.0113V20.0001Z" fill="#FBBC04"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-[#1F1F1F]">My Google AI</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMore} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-[#444746]" title="More options">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <g clipPath="url(#clip0_10784_2848)">
                <path d="M12 20C11.45 20 10.975 19.8083 10.575 19.425C10.1917 19.025 10 18.55 10 18C10 17.45 10.1917 16.9833 10.575 16.6C10.975 16.2 11.45 16 12 16C12.55 16 13.0167 16.2 13.4 16.6C13.8 16.9833 14 17.45 14 18C14 18.55 13.8 19.025 13.4 19.425C13.0167 19.8083 12.55 20 12 20ZM12 14C11.45 14 10.975 13.8083 10.575 13.425C10.1917 13.025 10 12.55 10 12C10 11.45 10.1917 10.9833 10.575 10.6C10.975 10.2 11.45 10 12 10C12.55 10 13.0167 10.2 13.4 10.6C13.8 10.9833 14 11.45 14 12C14 12.55 13.8 13.025 13.4 13.425C13.0167 13.8083 12.55 14 12 14ZM12 8C11.45 8 10.975 7.80833 10.575 7.425C10.1917 7.025 10 6.55 10 6C10 5.45 10.1917 4.98333 10.575 4.6C10.975 4.2 11.45 4 12 4C12.55 4 13.0167 4.2 13.4 4.6C13.8 4.98333 14 5.45 14 6C14 6.55 13.8 7.025 13.4 7.425C13.0167 7.80833 12.55 8 12 8Z" fill="#444746"/>
              </g>
              <defs>
                <clipPath id="clip0_10784_2848">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          <button onClick={onExpand} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-[#444746]" title="Expand">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <g clipPath="url(#clip0_10784_2857)">
                <path d="M3 21V13H5V17.6L17.6 5H13V3H21V11H19V6.4L6.4 19H11V21H3Z" fill="#444746"/>
              </g>
              <defs>
                <clipPath id="clip0_10784_2857">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-[#444746]" title="Close">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <g clipPath="url(#clip0_10784_2866)">
                <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#444746"/>
              </g>
              <defs>
                <clipPath id="clip0_10784_2866">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {/* Content (Chat Stream or Initial View) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4" id="side-agent-content">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-10 w-full">
            <div className="text-center">
              <h2 className="text-[28px] font-medium leading-[36px] bg-gradient-to-r from-[#4285F4] to-[#8D42F7] text-transparent bg-clip-text mb-1">
                Hello, {userName}
              </h2>
              <p className="text-2xl font-normal leading-[32px] text-[#444746]">
                How can I help you today?
              </p>
            </div>

            {/* Response intent chips cluster */}
            <div className="mt-8 flex flex-col gap-2 w-full max-w-[328px]">
              <button 
                onClick={() => handleSend("What can you do?")}
                className="bg-[#E9EEF6] text-[#1F1F1F] rounded-full px-4 py-2.5 text-sm font-medium hover:bg-[#DFE4EC] transition-colors text-left truncate"
              >
                What can you do?
              </button>
              <button 
                onClick={() => handleSend("Book vacation")}
                className="bg-[#E9EEF6] text-[#1F1F1F] rounded-full px-4 py-2.5 text-sm font-medium hover:bg-[#DFE4EC] transition-colors text-left truncate"
              >
                Book Vacation
              </button>
              <button 
                onClick={() => handleSend("How do I borrow vacation time?")}
                className="bg-[#E9EEF6] text-[#1F1F1F] rounded-full px-4 py-2.5 text-sm font-medium hover:bg-[#DFE4EC] transition-colors text-left truncate"
              >
                How do I borrow vacation time?
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            msg.type === 'user' ? (
              <PromptBlock key={idx}>{msg.text}</PromptBlock>
            ) : (
              <div key={idx} className="flex flex-col gap-2">
                <ResponseHeader />
                <div className="text-base text-[#1F1F1F] pl-10">
                  {msg.text}
                </div>
                {msg.controlCardTitle && (
                  <div className="pl-10">
                    <CanvasControlCard title={msg.controlCardTitle} />
                  </div>
                )}
                {msg.showSources && (
                  <div className="pl-10">
                    <SourcesButton />
                  </div>
                )}
                {msg.suggestions && (
                  <div className="pl-10 mt-2 flex flex-col gap-2">
                    {msg.suggestions.map((sug, sIdx) => (
                      <SuggestionChip key={sIdx} label={sug} onClick={() => handleSend(sug)} />
                    ))}
                  </div>
                )}
                <div className="pl-10">
                  <FeedbackBar />
                </div>
              </div>
            )
          ))
        )}
        {loading && (
          <div className="flex flex-col gap-2 animate-pulse">
            <ResponseHeader />
            <div className="h-4 bg-gray-200 rounded w-3/4 ml-10"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 ml-10"></div>
          </div>
        )}
      </div>

      {/* Prompt input field MVP */}
      <div className="w-full bg-white border-t border-[#E8EAED] p-4 flex flex-col gap-3 relative" id="side-agent-input-container">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask a question" 
            disabled={loading}
            className="w-full h-14 border border-[#747775] rounded-full pl-6 pr-14 text-base text-[#1F1F1F] placeholder-[#444746] focus:outline-none focus:border-[#0B57D0] disabled:bg-gray-50"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={loading}
            className="absolute right-2 top-2 w-10 h-10 bg-transparent flex items-center justify-center rounded-full hover:bg-black/5 text-[#1F1F1F] disabled:opacity-50"
            title="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <g clipPath="url(#clip0_10784_4061)">
                <path d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17ZM5 17V12V7V10.5V13.5V17Z" fill="currentColor"/>
              </g>
              <defs>
                <clipPath id="clip0_10784_4061">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        
        {/* Disclaimer */}
        <p className="text-xs text-[#444746] text-center px-2">
          AI sometimes generates inaccurate info, so double-check responses.
        </p>
      </div>
    </div>
  );
};
