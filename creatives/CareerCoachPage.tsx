import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import UnifiedLayout from './UnifiedLayout';

// Mock Data for Divya (Senior Director, Software Engineering)
const USER_DATA = {
  name: "Divya",
  role: "Senior Director, Software Engineering",
  team: "Google AI & Cloud Leadership",
  manager: "Richard M.",
  rating: "IMPACT_OUTSTANDING",
  expectations: [
    { title: "Lead and grow Software Engineering teams", focus: 50, description: "Mentor and coach Engineering Managers and TLs." },
    { title: "Cross-functional Strategy", focus: 30, description: "Represent Eng org in leadership forums." },
    { title: "Organizational Health", focus: 15, description: "Foster a healthy, inclusive culture." },
    { title: "Technical Innovation", focus: 5, description: "Drive innovation in engineering teams." }
  ],
  okrs: [
    { title: "Enterprise AI Leadership", progress: 75, kr: "Grow AI revenue by 60% YoY" },
    { title: "Developer Productivity", progress: 60, kr: "Increase AI-enhanced dev usage by 500k" }
  ]
};

const Icon: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{children}</span>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-[#E8EAED] p-6 ${className}`}>
    {children}
  </div>
);

const ReflectionJournal = () => {
  const [reflection, setReflection] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    if (!reflection.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setReflection('');
  };

  return (
    <Card className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#0B57D0]">
            <Icon>edit_note</Icon>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1F1F1F]">Leadership Journal</h3>
            <p className="text-sm text-[#444746]">Reflect on your leadership moments today.</p>
          </div>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-[#0B57D0] flex items-center gap-1"
            >
              <Icon className="text-sm">check_circle</Icon>
              Saved to your growth path
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <textarea 
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="What leadership challenge did you navigate today, Divya?"
        className="flex-1 w-full p-4 rounded-xl border border-[#C4C7C5] focus:outline-none focus:border-[#0B57D0] resize-none text-base text-[#1F1F1F] placeholder-[#747775] bg-[#F8FAFD]"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-black/5 text-[#444746]" title="Add tag">
            <Icon>label</Icon>
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 text-[#444746]" title="Add mood">
            <Icon>sentiment_satisfied</Icon>
          </button>
        </div>
        <button 
          onClick={handleSave}
          disabled={!reflection.trim()}
          className="px-6 py-2 bg-[#0B57D0] text-white rounded-full font-medium hover:bg-[#0842A0] disabled:bg-[#E8EAED] disabled:text-[#C4C7C5] transition-colors"
        >
          Save Reflection
        </button>
      </div>
    </Card>
  );
};

const GrowthTracker = () => {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#1F1F1F]">Growth Tracker</h3>
        <button className="text-sm font-medium text-[#0B57D0] hover:underline">View Roadmap</button>
      </div>
      <div className="space-y-6">
        {USER_DATA.expectations.map((exp, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-[#1F1F1F]">{exp.title}</span>
              <span className="text-[#444746]">{exp.focus}% focus</span>
            </div>
            <div className="h-2 w-full bg-[#E8EAED] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${exp.focus}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="h-full bg-[#0B57D0]"
              />
            </div>
            <p className="text-xs text-[#747775]">{exp.description}</p>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-[#E8EAED]">
        <div className="flex items-center gap-3 p-3 bg-[#F8FAFD] rounded-xl border border-[#E8EAED]">
          <div className="w-10 h-10 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#137333]">
            <Icon>trending_up</Icon>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1F1F1F]">Impact Rating: {USER_DATA.rating.replace('_', ' ')}</p>
            <p className="text-xs text-[#444746]">You're consistently exceeding expectations in team growth.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const OneOnOnePrep = () => {
  const templates = [
    { title: "The Growth Path", icon: "alt_route", color: "bg-[#E8F0FE] text-[#0B57D0]" },
    { title: "Psychological Safety", icon: "security", color: "bg-[#E6F4EA] text-[#137333]" },
    { title: "Strategic Alignment", icon: "ads_click", color: "bg-[#FEF7E0] text-[#B17D06]" },
    { title: "Conflict Resolution", icon: "handshake", color: "bg-[#FCE8E6] text-[#C5221F]" }
  ];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#1F1F1F]">1:1 Preparation Tool</h3>
        <Icon className="text-[#444746]">more_horiz</Icon>
      </div>
      <p className="text-sm text-[#444746]">Choose a template to structure your next growth conversation.</p>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((t, idx) => (
          <button 
            key={idx}
            className="flex flex-col gap-3 p-4 rounded-xl border border-[#E8EAED] hover:border-[#0B57D0] hover:bg-[#F8FAFD] transition-all text-left group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.color}`}>
              <Icon>{t.icon}</Icon>
            </div>
            <span className="text-sm font-medium text-[#1F1F1F] group-hover:text-[#0B57D0]">{t.title}</span>
          </button>
        ))}
      </div>
      <button className="mt-2 w-full py-2.5 border border-[#C4C7C5] rounded-full text-sm font-medium text-[#444746] hover:bg-black/5 transition-colors">
        Create Custom Template
      </button>
    </Card>
  );
};

const StrategicContext = () => {
  return (
    <Card className="flex flex-col gap-4 bg-[#0B57D0] text-white border-none">
      <div className="flex items-center gap-2">
        <Icon className="text-white/80">insights</Icon>
        <h3 className="text-lg font-medium">Strategic Context</h3>
      </div>
      <div className="space-y-4">
        {USER_DATA.okrs.map((okr, idx) => (
          <div key={idx} className="p-4 bg-white/10 rounded-xl border border-white/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">{okr.title}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{okr.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${okr.progress}%` }}
                transition={{ duration: 1, delay: idx * 0.2 }}
                className="h-full bg-white"
              />
            </div>
            <p className="text-xs text-white/70">{okr.kr}</p>
          </div>
        ))}
      </div>
      <button className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-white hover:bg-white/10 py-2 rounded-lg transition-colors">
        View All OKRs
        <Icon className="text-sm">arrow_forward</Icon>
      </button>
    </Card>
  );
};

const SYSTEM_INSTRUCTION = `You are a Supportive Mentor for Divya, a Senior Director of Software Engineering at Google. 
Your goal is to provide empathetic, strategic, and encouraging career coaching. 
Focus on team health, long-term growth, and leadership excellence. 
Use a warm, professional tone. Always refer to Divya by name. 
When discussing performance or OKRs, be constructive and focus on the 'why' and 'how' of growth.
You have access to Divya's context:
- Role: Senior Director, Software Engineering
- Team: Google AI & Cloud Leadership
- Manager: Richard M.
- Current Focus: Leading and growing Software Engineering teams, Cross-functional Strategy, Organizational Health.
- OKRs: Enterprise AI Leadership, Developer Productivity.
Keep responses concise but meaningful.`;

export const CareerCoachPage: React.FC = () => {
  return (
    <UnifiedLayout 
      activeId="growth" 
      activeDrawerItemId="career"
      systemInstructions={SYSTEM_INSTRUCTION}
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 py-4">
        {/* Header Section */}
        <header className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-medium text-[#1F1F1F]"
          >
            Career Coach
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#444746] text-lg"
          >
            Welcome back, Divya. Let's focus on your leadership journey today.
          </motion.p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Journal and Prep */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-[400px]">
              <ReflectionJournal />
            </div>
            <OneOnOnePrep />
          </div>

          {/* Right Column: Tracker and Context */}
          <div className="lg:col-span-5 space-y-6">
            <GrowthTracker />
            <StrategicContext />
            
            {/* Quick Actions Card */}
            <Card className="bg-[#F8FAFD]">
              <h3 className="text-sm font-medium text-[#444746] uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Request Feedback", icon: "rate_review" },
                  { label: "Schedule Mentorship", icon: "calendar_today" },
                  { label: "Update Growth Plan", icon: "edit" }
                ].map((action, idx) => (
                  <button 
                    key={idx}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-[#1F1F1F] group"
                  >
                    <Icon className="text-[#444746] group-hover:text-[#0B57D0]">{action.icon}</Icon>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default CareerCoachPage;
