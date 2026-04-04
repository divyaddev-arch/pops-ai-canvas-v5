import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TopAppBar,
  SideNav
} from '../../packages/design-vibe/ue';
import { 
  IconButton, 
  Chip, 
  Button, 
  Icon,
  Card,
  Badge
} from '../../packages/design-vibe/gm3-react-components/src';
import { GeminiSparkIcon } from '../../packages/design-vibe/gm3-react-components/src/styles/icons/GeminiSparkIcon';
import { useAuth } from '../../src/lib/AuthContext';
import { 
  generateChatResponseStream 
} from '../../src/services/geminiService';
import { ChatView } from './components/ChatView';

// --- Types ---

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

interface OKR {
  title: string;
  priority: string;
  key_results: Array<{
    title: string;
    metric: string;
    target: string | number;
    current: string | number;
    owner: string;
  }>;
}

interface DashboardData {
  okrs: OKR[];
  userProfile: any;
}

// --- Constants ---

const NAVIGATOR_SYSTEM_INSTRUCTION = (userName: string, okrs: string) => `
You are "The Navigator", a specialized Growth & Performance AI agent designed for ${userName}, a Senior Director (L8) in Software Engineering.

# Persona & Tone:
- Executive and Direct. 
- Concise, professional, and focused on the bottom line (ROI & Strategy).
- Address the user as ${userName}.
- Redact all SPI/Compensation data.

# Context (2026 OKRs):
${okrs}

# Capabilities:
- Analyze team ROI and strategic alignment.
- Generate growth plans and 1-1 templates.
- Review OKR progress and identify risks.
- Reference the 2026 OKRs (AI breakthroughs, hardware efficiency, quantum algorithms) in all generated text and suggestions.

# Output Format:
- Use bullet points for clarity.
- Focus on ROI-focused talking points.
- Provide actionable templates (e.g., 1-1 templates).
`;

const INITIAL_MESSAGES = (userName: string): Message[] => [
  {
    id: '1',
    role: 'agent',
    content: `Good morning, ${userName}. I've analyzed the current ROI & Strategy overview. How can I assist you with your Growth & Performance objectives today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '2',
    role: 'user',
    content: "Generate a 1-1 template for my EM focused on the 5x hardware efficiency KR.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '3',
    role: 'agent',
    content: `Here is a concise 1-1 template focused on the **5x Hardware Perf-per-Watt** Key Result:

### 1-1 Template: Hardware Efficiency Strategy
**Focus**: KR 4.2 - 5x Performance-per-Watt Improvement

**Talking Points**:
*   **Current Velocity**: Review progress on the GenAI workload prototype. Are we hitting the interim power-draw targets?
*   **Bottleneck Identification**: Identify any hardware-software integration friction points slowing down the validation phase.
*   **Resource Allocation**: Ensure the Systems Team has priority access to the new testing rigs.
*   **ROI Impact**: Quantify how this efficiency gain translates to reduced TCO for our 2026 cloud deployments.

**Action Items**:
*   [ ] Finalize prototype validation schedule by EOW.
*   [ ] Draft ROI summary for the Q3 Strategy Review.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

const STARTER_CHIPS = [
  "Analyze team ROI",
  "Generate growth plan",
  "Review OKR alignment"
];

// --- Sub-components ---

const Breadcrumbs: React.FC<{ path: string[] }> = ({ path }) => {
  return (
    <nav className="flex items-center gap-1 px-8 py-4 text-[13px] text-slate-500 select-none">
      {path.map((item, index) => (
        <React.Fragment key={item}>
          <div className={`flex items-center gap-1 ${index === path.length - 1 ? "text-slate-900 font-medium" : "hover:text-navy-600 cursor-pointer transition-colors"}`}>
            {item}
          </div>
          {index < path.length - 1 && (
            <Icon className="!text-[16px] opacity-40">chevron_right</Icon>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

const CanvasControlCard: React.FC<{ title: string; icon: string; onClick?: () => void }> = ({ title, icon, onClick }) => {
  return (
    <div className="w-full mb-4">
      <div 
        onClick={onClick}
        className="flex items-center gap-4 p-3 bg-white rounded-[8px] border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Icon className="text-slate-600 !text-[18px]">{icon}</Icon>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-medium text-slate-900">{title}</h4>
        </div>
        <Button variant="outlined" size="small" className="!rounded-full !text-[11px] !h-7">
          Export to Email
        </Button>
      </div>
    </div>
  );
};

const AgentProject: React.FC = () => {
  const { user } = useAuth();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Strategic Growth Plans');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedRailId, setSelectedRailId] = useState('growth');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const userName = user?.displayName?.split(' ')[0] || 'Harshit';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const okrRes = await fetch('/okr_mock_data.json');
        const okrData = await okrRes.json();
        
        const personRes = await fetch('/person_mock_data.json');
        const personData = await personRes.json();
        
        setDashboardData({
          okrs: okrData.okrs,
          userProfile: personData.find((p: any) => p.username === 'richardmccoll') // Mocking as Richard for data richness
        });

        setMessages(INITIAL_MESSAGES(userName));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    fetchData();
  }, [userName]);

  const okrSummary = dashboardData?.okrs.map(o => `- ${o.title}`).join('\n') || '';

  const destinations = [
    { id: 'new_chat', icon: 'chat_spark', label: 'New Chat' },
    { id: 'recent', icon: 'history', label: 'Recent' },
    { id: 'divider', icon: 'horizontal_rule', label: '', dividerAbove: true },
    { id: 'growth', icon: 'trending_up', label: 'Growth', selected: selectedRailId === 'growth' },
    { id: 'performance', icon: 'speed', label: 'Performance', selected: selectedRailId === 'performance' },
    { id: 'compensation', icon: 'payments', label: 'Compensation', selected: selectedRailId === 'compensation' },
    { id: 'benefits', icon: 'card_giftcard', label: 'Benefits', selected: selectedRailId === 'benefits' },
    { id: 'hiring', icon: 'person_add', label: 'Hiring', selected: selectedRailId === 'hiring' },
    { id: 'culture', icon: 'diversity_3', label: 'Culture', selected: selectedRailId === 'culture' },
  ];

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    const agentMsgId = (Date.now() + 1).toString();
    const loadingId = 'loading-' + agentMsgId;
    
    setMessages(prev => [...prev, {
      id: loadingId,
      role: 'agent',
      content: '',
      timestamp: '',
      isLoading: true
    }]);

    try {
      const stream = await generateChatResponseStream(messageText, NAVIGATOR_SYSTEM_INSTRUCTION(userName, okrSummary));
      
      let fullText = "";
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [...filtered, {
          id: agentMsgId,
          role: 'agent',
          content: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      });

      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(m => 
          m.id === agentMsgId ? { ...m, content: fullText } : m
        ));
      }
    } catch (error) {
      console.error("Failed to generate response:", error);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [...filtered, {
          id: Date.now().toString(),
          role: 'agent',
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFD] overflow-hidden font-sans" id="navigator-root">
      <TopAppBar 
        title="My Google"
        avatarInitial={userName[0]}
        showMenu={false}
        showSearch={false}
        actions={[
          { id: 'help', icon: 'help', label: 'Help' },
          { id: 'settings', icon: 'settings', label: 'Settings' },
          { id: 'spark', icon: <Icon className="!text-slate-500">auto_awesome</Icon>, label: 'The Navigator AI' }
        ]}
        onActionClick={(id) => {
          if (id === 'spark') setIsAiOpen(!isAiOpen);
        }}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <SideNav 
          destinations={destinations}
          onDestinationClick={(dest) => {
            if (dest.id !== 'divider') setSelectedRailId(dest.id);
          }}
          onFabClick={() => setIsAiOpen(true)}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <motion.div 
            animate={{ paddingRight: isAiOpen ? 400 : 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col overflow-y-auto overscroll-contain"
          >
            <Breadcrumbs path={['Home', 'Growth & Performance', 'The Navigator']} />
            
            <div className="px-8 py-4 max-w-7xl w-full mx-auto">
              <div className="mb-6">
                <h1 className="text-[28px] font-medium text-slate-900 tracking-tight">Good morning, {userName}. ROI & Strategy Overview.</h1>
              </div>

              {/* KPI Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card variant="outlined" className="!p-4 !rounded-[8px] bg-white border-slate-200">
                  <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider mb-1">AI Training Efficiency</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-semibold text-slate-900">2x Improvement</span>
                    <Badge className="!bg-emerald-50 !text-emerald-700 !px-1.5 !py-0.5 !text-[10px]">Target</Badge>
                  </div>
                </Card>
                <Card variant="outlined" className="!p-4 !rounded-[8px] bg-white border-slate-200">
                  <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider mb-1">Hardware Perf-per-Watt</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-semibold text-slate-900">5x Improvement</span>
                    <Badge className="!bg-emerald-50 !text-emerald-700 !px-1.5 !py-0.5 !text-[10px]">Target</Badge>
                  </div>
                </Card>
                <Card variant="outlined" className="!p-4 !rounded-[8px] bg-white border-slate-200">
                  <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider mb-1">Quantum Milestones</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-semibold text-slate-900">On Track</span>
                    <Badge className="!bg-blue-50 !text-blue-700 !px-1.5 !py-0.5 !text-[10px]">Status</Badge>
                  </div>
                </Card>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-200 mb-6">
                {['Strategic Growth Plans', '1-1 Templates', 'Technical Strategy'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-[14px] font-medium transition-colors relative ${
                      activeTab === tab ? 'text-navy-700' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-700"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Data Grid */}
              <Card variant="outlined" className="!p-0 !rounded-[8px] overflow-hidden bg-white border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: "L7 Promo Case: AI Breakthroughs", status: "Critical", date: "Oct 15, 2026", color: "red" },
                      { title: "Hardware Efficiency Roadmap", status: "Healthy", date: "Nov 02, 2026", color: "emerald" },
                      { title: "Quantum Algorithm Milestone", status: "At Risk", date: "Oct 28, 2026", color: "amber" },
                      { title: "Team ROI Analysis Q3", status: "Healthy", date: "Dec 10, 2026", color: "emerald" },
                      { title: "Technical Strategy V2", status: "Healthy", date: "Nov 20, 2026", color: "emerald" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3 text-[13px] text-slate-900 font-medium">{row.title}</td>
                        <td className="px-4 py-3">
                          <Badge className={`!bg-${row.color}-50 !text-${row.color}-700 !px-2 !py-0.5 !text-[11px] !rounded-full`}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">{row.date}</td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="text" 
                            size="small" 
                            className="!text-navy-600 !text-[12px] hover:!bg-navy-50"
                            onClick={() => {
                              setIsAiOpen(true);
                              handleSendMessage(`Analyze the status of "${row.title}"`);
                            }}
                          >
                            Export to Email
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </motion.div>

          <ChatView 
            isOpen={isAiOpen}
            onClose={() => setIsAiOpen(false)}
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            inputValue={inputValue}
            onInputChange={setInputValue}
            starterChips={STARTER_CHIPS}
            title="The Navigator"
            subtitle="Executive AI Agent"
            summary="I'm focused on ROI & Strategy alignment with your 2026 OKRs."
          >
            {/* Custom Interactive Card in Chat */}
            <div className="px-6 py-2">
               <CanvasControlCard 
                title="One-click Export to Email" 
                icon="mail" 
                onClick={() => console.log("Exporting...")}
              />
            </div>
          </ChatView>
        </main>
      </div>
    </div>
  );
};

export default AgentProject;
