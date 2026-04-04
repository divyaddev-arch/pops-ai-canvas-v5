import React from 'react';
import { Icon, IconButton, TextField, Button, Snackbar } from '@my-google-project/gm3-react-components';
import { useAuth } from '../../src/lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { refineProjectPrompt } from '../../src/services/geminiService'; // Import the refiner!

import personData from '../../person_mock_data.json';
import managerHierarchy from '../../manager_heirarchy_mock_data.json';
import expectationsData from '../../expectations_mock_data.json';
import ratingsData from '../../ratings_mock_data.json';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onCreateProject?: () => void;
  isAgentTyping?: boolean;
  agentState?: any;
}

export const ChatView: React.FC<ChatViewProps> = ({ 
  messages, 
  onSendMessage, 
  onClearChat, 
  onCreateProject, 
  isAgentTyping = false,
  agentState 
}) => {
  const { user } = useAuth();
  const userEmail = user?.email || 'richardmccoll@google.com'; // Using an existing email from mock data
  const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'A';
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = React.useState('');
  const [generatedPrompt, setGeneratedPrompt] = React.useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  const isConciergeResponse = (content: string) => {
    return content.includes("Compassionate HR Concierge") && content.includes("Zen & Minimalist");
  };

  const shouldShowCreatePrompt = (msg: Message, index: number) => {
    if (msg.role !== 'agent' || index !== messages.length - 1 || generatedPrompt) return false;
    
    // If we have systemInstructions in agentState, it's the definitive signal that the session is complete
    if (agentState?.systemInstructions) return true;

    if (isConciergeResponse(msg.content)) return true;

    const contentLower = msg.content.toLowerCase();
    
    // Only very specific, definitive completion phrases should trigger this without systemInstructions
    if (contentLower.includes("session is now complete") ||
        contentLower.includes("session is complete") ||
        contentLower.includes("session has ended") ||
        contentLower.includes("configuration is complete") ||
        contentLower.includes("final project prompt is ready")) {
      return true;
    }

    if (index >= 2) {
      const prevUserMsg = messages[index - 1];
      const prevAgentMsg = messages[index - 2];

      const userSaidYes = prevUserMsg.role === 'user' &&
        (prevUserMsg.content.toLowerCase().trim() === 'yes' ||
          prevUserMsg.content.toLowerCase().startsWith('yes,') ||
          prevUserMsg.content.toLowerCase().startsWith('yes '));

      const prevAgentContent = prevAgentMsg.content.toLowerCase();
      const agentAskedToEnd = prevAgentMsg.role === 'agent' &&
        ((prevAgentContent.includes("conclude") ||
          prevAgentContent.includes("end") ||
          prevAgentContent.includes("finish")) &&
          prevAgentContent.includes("session"));

      if (userSaidYes && agentAskedToEnd) return true;
    }

    return false;
  };

  // Upgraded to Async to leverage Gemini API to check styling & UI consistency
  const handleCreatePrompt = async (context: string) => {
    // 1. Detect Persona from agentState or context
    let persona = agentState?.tone || "Supportive Mentor"; 
    
    // Fallback detection if tone is not in state
    if (!agentState?.tone) {
      if (context.includes("Executive and Direct")) persona = "Executive and Direct";
      else if (context.includes("Academic & Analytical")) persona = "Academic & Analytical";
      else if (context.includes("Growth & Performance Agent")) persona = "Growth & Performance Agent";
      else if (context.includes("Supportive Mentor")) persona = "Supportive Mentor";
    }

    let toneSpecificUERules = "";
    if (persona === "Executive and Direct") {
      toneSpecificUERules = `
- UI Aesthetic: High-density dashboard, minimal padding, sharp corners.
- Components: Prioritize KPI cards, data grids, and executive summaries.
- Interaction: "One-click" actions, direct navigation, and "Bottom Line" toggles.
- Visuals: Professional, high-contrast color palette (e.g., Slate, Navy, White).`;
    } else if (persona === "Supportive Mentor") {
      toneSpecificUERules = `
- UI Aesthetic: Spacious, soft, and inviting. Use large rounded corners (rounded-2xl) and gentle shadows.
- Components: Progress trackers, "Reflection" text areas, and encouraging micro-copy.
- Interaction: Guided step-by-step flows, celebratory feedback (e.g., motion animations), and "Help" tooltips.
- Visuals: Warm and calming colors (e.g., Sage, Soft Blue, Cream).`;
    } else if (persona === "Academic & Analytical") {
      toneSpecificUERules = `
- UI Aesthetic: Structured, hierarchical, and scholarly. Use clear typography and distinct sections.
- Components: Detailed charts with annotations, "Deep Dive" sidebars, and citation/reference blocks.
- Interaction: Searchable indices, collapsible methodology sections, and data export features.
- Visuals: Neutral and sophisticated palette (e.g., Stone, Charcoal, Parchment).`;
    } else if (persona === "Growth & Performance Agent") {
      toneSpecificUERules = `
- UI Aesthetic: Dynamic, high-energy, and results-focused. Use bold accents and active elements.
- Components: "Next Best Action" widgets, countdown timers, and achievement badges.
- Interaction: Real-time progress updates, gamified task completion, and proactive notifications.
- Visuals: Vibrant and motivating colors (e.g., Electric Blue, Success Green, Warning Orange).`;
    }

    const basePrompt = `Build the project based on the following context:

"${context}"

${agentState?.systemInstructions ? `Final System Instructions for the Agent:
"""
${agentState.systemInstructions}
"""` : ''}

User Context (Dynamic Fetching):
- The application MUST fetch the user's profile, expectations, and performance history dynamically based on the currently logged-in user's email.
- Use 'person_mock_data.json', 'expectations_mock_data.json', and 'ratings_mock_data.json' as the data sources.
- The UI MUST react to the logged-in user's data.
- Persona Selected: ${persona}

Persona Enforcement:
- If Persona is "Supportive Mentor": Use empathetic, encouraging language. Focus on long-term growth and psychological safety.
- If Persona is "Executive and Direct": Be extremely concise. Focus on ROI, high-level strategy, and bottom-line impact.
- If Persona is "Academic & Analytical": Use formal, precise language. Reference frameworks, data points, and research-backed methodologies.
- If Persona is "Growth & Performance Agent": Focus on specific metrics, KPIs, and immediate performance improvements.

Technical Implementation:
- Create the main component in 'creatives/agent-project/AgentProject.tsx'.
- Update 'src/App.tsx' to import and display 'AgentProject' as the primary application component, replacing the current 'Homepage' import.
- Ensure the project is immediately visible on the screen after the build, bypassing the current home-page.
- ONLY modify files within the 'creatives' folder (plus the necessary App.tsx update).
- Use 'motion/react' for smooth, high-quality transitions.
- CRITICAL: Ensure all generated pages use background-color: #F8FAFD as the base style for the container or body if applicable.
- CRITICAL: The application MUST use placeholders like {{USER_NAME}}, {{USER_ROLE}}, {{USER_TEAM}}, {{USER_MANAGER}}, {{USER_EXPECTATIONS}}, {{USER_RATINGS}}, and {{USER_OKRS}} in its system instructions and resolve them at runtime using the application's data providers.

Tone-Specific UE Design and Interaction Rules:
${toneSpecificUERules}

Standard UE Design and Interaction Rules:
1. Every page should have the TopAppBar with charm icons (including gray spark icon), avatar, and "My Google" branding with logo (no searchbar).
2. All pages must be nested within the GM3 Navigation Rail sitting below the app bar, occupying full height.
3. Side Nav must have unified AI icons (new chat, recent), a divider, and product area icons.
4. Help sections in secondary drawer should be collapsed by default.
5. Use patterns like breadcrumbs and tabs on pages.
6. Avoid full-screen contextual experiences that hide the canvas or My Google navigation.
7. Use GM3 themed tables with states, expansions, and badges for tasks.
8. Tasks should be completed with AI assistance; use prompt pills and A2UI library where possible.

Ways to invoke AI from pages:
1. Spark icon in TopAppBar invokes side sheet chat (expandable to full screen) with starter chips.
2. Screen adjusts left seamlessly when AI opens (using ai-slide-from-right.txt for styling).
3. Sliding sheet and full screen elements should match; sources collapsed by default.
4. AI can use canvas control cards for interactive UI elements.
5. Full-page conversation AI needs a back button in the TopAppBar.
6. Always have a summary of the conversation on top.
7. There should be a persistent "get support" chip for ticket creation.
8. Support chip opens form sliding from right, adjusting screen left.
9. Support form must be closable.`;

    setGeneratedPrompt("Analyzing and refining prompt targeting GM3 and UE Vibe rules on Gemini...");

    try {
      const refined = await refineProjectPrompt(basePrompt);
      setGeneratedPrompt(refined);
    } catch (e: any) {
      console.error("Vibe refiner failed, fallback to base:", e);
      setGeneratedPrompt(basePrompt); // Fallback to un-refined prompt if API is unavailable
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isAtBottom);
    }
  };

  React.useEffect(() => {
    if (shouldAutoScroll) {
      const timeoutId = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isAgentTyping, generatedPrompt, shouldAutoScroll]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => scrollToBottom('auto'), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSend = () => {
    if (prompt.trim()) {
      onSendMessage(prompt);
      setPrompt('');
      setShouldAutoScroll(true);
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  return (
    <div className="flex-grow flex flex-col w-full h-full min-h-0 overflow-hidden bg-white" id="chat-view-root">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto p-6 space-y-8 min-h-0"
        id="chat-messages-container"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            id={`message-${index}`}
          >
            {message.role === 'user' ? (
              <div
                className="bg-[#E9EEF6] rounded-[16px_0_16px_16px] px-4 py-3.5 max-w-[664px] w-full"
                id={`user-message-bubble-${index}`}
              >
                <p className="text-base leading-6 text-[#1F1F1F] font-normal" id={`user-message-text-${index}`}>
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="flex-grow max-w-[664px] pt-1" id={`agent-message-bubble-${index}`}>
                <p className="text-base leading-6 text-[#1F1F1F] font-normal" id={`agent-message-text-${index}`}>
                  {message.content}
                </p>
                {shouldShowCreatePrompt(message, index) && (
                  <div className="mt-4" id="create-prompt-button-container">
                    <Button
                      variant="filled"
                      onClick={() => handleCreatePrompt(message.content)}
                      id="create-prompt-button"
                      className="!bg-[#0B57D0] !text-white rounded-full px-6"
                    >
                      Create Prompt
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
              id="generated-prompt-container"
            >
              <div className="bg-[#F0F4F9] border border-[#C4C7C5] rounded-[16px] p-6 max-w-[664px] w-full shadow-sm" id="generated-prompt-bubble">
                <div className="flex justify-between items-center mb-4" id="generated-prompt-header">
                  <h3 className="text-lg font-medium text-[#1F1F1F]" id="generated-prompt-title">Final Project Prompt</h3>
                  <IconButton onClick={copyToClipboard} id="copy-prompt-button" title="Copy to clipboard">
                    <Icon>content_copy</Icon>
                  </IconButton>
                </div>
                <pre className="text-sm leading-5 text-[#444746] font-mono whitespace-pre-wrap bg-white p-4 rounded-lg border border-[#E3E3E3]" id="generated-prompt-text">
                  {generatedPrompt}
                </pre>
                <div className="mt-4 flex justify-end" id="generated-prompt-footer">
                  <p className="text-xs text-[#444746] italic">Copy this prompt to build the project.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAgentTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
              id="agent-typing-indicator"
            >
              <div className="bg-[#F0F4F9] p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0B57D0] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#0B57D0] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#0B57D0] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <Snackbar
        open={showSnackbar}
        message="Prompt copied to clipboard"
        onClose={() => setShowSnackbar(false)}
      />

      <div className="w-full flex flex-col items-center shrink-0" id="chat-input-area">
        <div className="w-full h-11 bg-gradient-to-b from-white/0 to-white" id="chat-input-scrim" />

        <div className="w-full max-w-[720px] px-4 pb-3 flex flex-col items-center gap-3" id="chat-input-container">
          <div className="w-full flex items-end gap-1" id="chat-field-container">
            <div className="flex-grow min-h-[56px] rounded-[28px] border border-[#747775] bg-white flex items-center px-6 py-2" id="chat-input-field">
              <TextField
                multiline
                autoGrow
                noLabel
                label="Ask a question"
                variant="filled-minimal"
                placeholder="Ask a question"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full max-w-none"
                containerClassName="!bg-transparent flex-grow"
                inputClassName="bg-transparent border-none focus:ring-0 p-0 text-base text-[#444748] placeholder:text-[#444748] h-full resize-none"
                id="chat-prompt-input-field"
              />
            </div>
            <div className="w-12 h-14 flex items-end justify-center pb-1" id="chat-action-buttons">
              <IconButton
                id="chat-send-button"
                disabled={!prompt.trim()}
                onClick={handleSend}
              >
                <Icon className="text-[#1F1F1F]">send</Icon>
              </IconButton>
            </div>
          </div>

          <p className="text-xs text-[#444746] text-center leading-4 tracking-[0.1px]" id="chat-disclaimer">
            AI sometimes generates inaccurate info, so double-check responses.
          </p>
        </div>
      </div>
    </div>
  );
};
