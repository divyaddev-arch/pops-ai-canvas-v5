import React from 'react';
import { Icon, IconButton, TextField, Button, Snackbar } from './index';
import { useAuth } from '../src/lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { refineProjectPrompt, generateChatResponseNew } from '../src/services/geminiService'; // Import the refiner!

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

    // 1. NEW INTERPRETER STEP: Identify Navigation Slot
    const navStructure = `
Available Navigation IDs:
- Growth ('growth'): overview, career, profiles, learning, location, role, immigration, mobility, school
- Performance ('performance'): overview, timeline, expectations, feedback, discussions, reviews
- Compensation ('compensation'): overview, policy, pay, equity, gtime
- Hiring ('hiring'): overview
- Benefits ('benefits'): overview, internet, timeoff, healthcare, financial, wellbeing, additional
- Culture ('culture'): culture, engage, recognition
- Help Center ('help-center'): support, requests, employment, managers
    `;

    const interpreterPrompt = `Analyze this user request context: "${context}". 
Based on this navigation structure:
${navStructure}

You need to pick between 2 options:
Option 1: The user ONLY wants a standalone, full-screen conversational agent (chat view) to talk to.
Option 2: The user wants to build a proper page with components (tables, charts, forms, etc.) that fits into the navigation rail. 

CRITICAL HEURISTIC: If the user requests BOTH a page (e.g., "career page") AND a coach or assistant (e.g., "manager coach"), this falls under Option 2. The layout will be a functional page in the main area, with the coach behavior handled by the right-hand Side Agent component. Do NOT select Option 1 just because the user mentions a coach or chatting, unless they explicitly want a full-page chat experience.

Identify the most appropriate Rail ID and Drawer Item ID if it fits a page. Also identify if the intent is Option 1.
Return ONLY JSON in this format: { "railId": "...", "drawerItemId": "...", "isNewChat": true/false } (set isNewChat to true for Option 1, and false for Option 2)`;

    let railId = 'hiring', drawerItemId = 'overview', isNewChat = false; // Fallbacks
    try {
      const mappingResponse = await generateChatResponseNew(interpreterPrompt, "You are a specialized navigation interpreter.");
      const mapping = JSON.parse(mappingResponse.replace(/```json|```/g, '').trim());
      railId = mapping.railId;
      drawerItemId = mapping.drawerItemId;
      isNewChat = mapping.isNewChat || false;
    } catch (e) {
      console.warn("Failed to interpret navigation slot", e);
    }

    let basePrompt = '';
    
    if (isNewChat) {
      basePrompt = `Build a new chat page file inside the 'creatives/' directory.
The new component MUST import and call the \`UnifiedLayout\` component from \`../../packages/ue/UnifiedLayout\`.
It MUST pass \`activeId="new-chat"\` directly to the \`UnifiedLayout\`.
Inside the layout, wire the pure \`<ChatView>\` component (from \`../../packages/ue/ChatView\`) as the SOLE child.
Pass the following Final System Instructions as props to ChatView:
"""
${agentState?.systemInstructions || 'You are a helpful assistant.'}
"""
Do NOT add any extra cards, headers, footers, quotes, or styling gimmicks.
- CRITICAL ARCHITECTURAL CONSTRAINT: You are strictly FORBIDDEN from modifying or creating files in the 'packages/' directory (including 'packages/ue/'). This directory is a read-only library.
- CRITICAL ARCHITECTURAL CONSTRAINT: You are strictly FORBIDDEN from modifying the navigation rail items, the 'NavigationRail' component, or the underlying navigation structure. The navigation rail is a fixed system component and must remain unchanged. Your page should integrate into the existing navigation by using the provided 'activeId' and 'activeDrawerItemId' in the 'UnifiedLayout' wrapper.
- CRITICAL ARCHITECTURAL CONSTRAINT: Any and all new code, pages, or components you generate must be placed exclusively inside the 'creatives/' directory. If you need a customized version of a library component, you must clone and modify it inside 'creatives/', never in 'packages/'.`;
    } else {
      basePrompt = `Build the project based on the following context:

"${context}"

Page Navigation Mapping:
- Rail ID: '${railId}'
- Drawer Item ID: '${drawerItemId}'
- The generated component should be a standalone page that wraps its custom content in \`<UnifiedLayout activeId="${railId}" activeDrawerItemId="${drawerItemId}">\`.

${agentState?.systemInstructions ? `Final System Instructions for the Agent:
"""
${agentState.systemInstructions}
"""` : ''}

User Context (Dynamic Fetching):
- The application MUST fetch the user's profile, expectations, and performance history dynamically based on the currently logged-in user's email.
- Use 'person_mock_data.json', 'expectations_mock_data.json', and 'ratings_mock_data.json' as the data sources.
- The UI MUST react to the logged-in user's data.
- Persona Selected: \${persona}

Persona Enforcement:
- If Persona is "Supportive Mentor": Use empathetic, encouraging language. Focus on long-term growth and psychological safety.
- If Persona is "Executive and Direct": Be extremely concise. Focus on ROI, high-level strategy, and bottom-line impact.
- If Persona is "Academic & Analytical": Use formal, precise language. Reference frameworks, data points, and research-backed methodologies.
- If Persona is "Growth & Performance Agent": Focus on specific metrics, KPIs, and immediate performance improvements.

Technical Implementation:
- Create the component file inside the 'creatives/' directory.
- If the target route mapped is 'home' (activeId === 'home'), read \`packages/ue/HomePage.tsx\` and use its contents as a baseline/clone to apply edits, targeting the new file!
- The new component MUST import and call the \`UnifiedLayout\` component from \`../../packages/ue/UnifiedLayout\`. 
- It MUST pass the resolved navigation IDs: \`activeId="${railId}"\` and \`activeDrawerItemId="${drawerItemId}"\` directly to the \`UnifiedLayout\`.
- All custom content should be passed as the \`children\` of that layout wrapper.
- COMPONENT PRIORITY: 
  1. Check 'packages/ue/' first. If a block exists, import and use it.
  2. If missing, check 'packages/gm3-react-components/' for base Material You elements. Do NOT invent random React components or use arbitrary HTML tags where a GM3 component exists.
  3. Only generate custom pure TSX if missing from both.
- CRITICAL ARCHITECTURAL CONSTRAINT: You are strictly FORBIDDEN from modifying or creating files in the 'packages/' directory (including 'packages/ue/'). This directory is a read-only library.
- CRITICAL ARCHITECTURAL CONSTRAINT: You are strictly FORBIDDEN from modifying the navigation rail items, the 'NavigationRail' component, or the underlying navigation structure. The navigation rail is a fixed system component and must remain unchanged. Your page should integrate into the existing navigation by using the provided 'activeId' and 'activeDrawerItemId' in the 'UnifiedLayout' wrapper.
- CRITICAL ARCHITECTURAL CONSTRAINT: Any and all new code, pages, or components you generate must be placed exclusively inside the 'creatives/' directory. If you need a customized version of a library component, you must clone and modify it inside 'creatives/', never in 'packages/'.
- CRITICAL (Side Agent Customization): The default 'SideAgent' in 'packages/ue/' has hardcoded responses. To make it functional with persona instructions, you MUST clone both 'UnifiedLayout.tsx' and 'SideAgent.tsx' into 'creatives/', modify the cloned SideAgent to use the "Final System Instructions" provided above, and update the cloned UnifiedLayout to use your custom SideAgent. Note that the SideAgent is a separate component in the right column that is toggled via the 'spark' action in the Top App Bar; design the page content to complement it.
- Use 'motion/react' for smooth, high-quality transitions.
- CRITICAL: The application MUST use placeholders like {{USER_NAME}}, {{USER_ROLE}}, {{USER_TEAM}}, {{USER_MANAGER}}, {{USER_EXPECTATIONS}}, {{USER_RATINGS}}, and {{USER_OKRS}} in its system instructions and resolve them at runtime using the application's data providers.
- CRITICAL (Auto-Routing for Dev): To view the new page immediately, you MUST import your new component into 'src/App.tsx' and REDIRECT the application to load your new page by default. This means you should REPLACE the default component (e.g., <HomePage />) with your new component in the main return statement of AppContent. Do NOT add new routes, hash-routing logic, or conditional checks; simply ensure the new page is the primary view rendered.

Tone-Specific UE Design and Interaction Rules:
\${toneSpecificUERules}
`;
    }

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