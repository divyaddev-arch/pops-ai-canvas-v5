import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Mock Data Imports
import personData from '../../person_mock_data.json';
import expectationsData from '../../expectations_mock_data.json';
import ratingsData from '../../ratings_mock_data.json';
import okrData from '../../okr_mock_data.json';

// Types
interface Person {
  person_number: number;
  username: string;
  preferred_name: {
    given_name: string;
    family_name: string;
  };
  email_addresses: { address: string; is_primary: boolean }[];
  work: {
    preferred_title: string;
    visible_advanced_job_family: { name: string };
    advanced_job_details: { sensitive_information: { level: string } };
    relationships: { direct_manager: { username: string; person_number: number } | null };
  };
}

interface Expectation {
  expectation_id: string;
  owner: number;
  title: string;
  description: string;
  status: string;
  category: string;
  focus_percent: number;
}

interface Rating {
  subject_person_id: number;
  rating: string;
}

interface OKR {
  title: string;
  priority: string;
  owner: string;
  key_results: { title: string; target: number | string; current: number | string; unit?: string }[];
}

interface CareerCoachViewProps {
  userName?: string;
  userEmail?: string;
}

export const CareerCoachView: React.FC<CareerCoachViewProps> = ({ 
  userName: propUserName, 
  userEmail: propUserEmail = 'richardmccoll@google.com' 
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | '1:1-prep' | 'reflection-log'>('dashboard');
  const [reflection, setReflection] = useState('');
  const [prepStep, setPrepStep] = useState(0);
  const [dismissedCards, setDismissedCards] = useState<number[]>([]);

  // Data Fetching Logic
  const person = (personData as any[]).find(p => 
    p.email_addresses.some((e: any) => e.address === propUserEmail)
  ) as Person || (personData as any[])[0] as Person;

  const personId = person.person_number;
  const username = person.username;
  const userExpectations = (expectationsData as any[]).filter(e => e.owner === personId) as Expectation[];
  const userRatings = (ratingsData as any[]).filter(r => r.subject_person_id === personId) as Rating[];
  const userOKRs = (okrData.okrs as any[]).filter(o => o.owner === username) as OKR[];

  const userName = propUserName || person.preferred_name.given_name;
  const userTeam = person.work.visible_advanced_job_family.name;
  
  // Find manager's name from personData
  const managerId = person.work.relationships.direct_manager?.person_number;
  const manager = managerId ? (personData as any[]).find(p => p.person_number === managerId) : null;
  const userManager = manager?.preferred_name.given_name || 'your manager';
  
  const latestRating = userRatings[0]?.rating.replace('IMPACT_', '').toLowerCase() || 'consistent';

  const prepSteps = [
    { title: "Personal Check-in", question: "How are you feeling about your energy levels this week?", placeholder: "I'm feeling..." },
    { title: "Team Health", question: "Is there anyone on the team who needs extra support right now?", placeholder: "I've noticed..." },
    { title: "Strategic Vision", question: "What's one long-term goal you want to discuss with " + userManager + "?", placeholder: "I want to focus on..." }
  ];

  const encouragementCards = [
    { id: 1, title: "Empathy is a Superpower", text: "Your focus on team health is what makes you a great leader. Don't underestimate the impact of a simple 'How are you?'", icon: "favorite" },
    { id: 2, title: "Sustainable Growth", text: "Remember that leadership is a marathon. Taking time for reflection today saves hours of burnout tomorrow.", icon: "eco" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFFDF7] p-8 md:p-12 font-google-sans-text text-[#37474F]">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto space-y-10"
      >
        {/* Welcome Header */}
        <motion.section variants={itemVariants} className="space-y-2">
          <h1 className="text-4xl font-google-sans font-medium text-[#2E7D32]">
            Welcome back, {userName}
          </h1>
          <p className="text-xl text-[#546E7A]">
            Senior Director in {userTeam} • Your recent <span className="font-semibold text-[#1976D2]">{latestRating}</span> impact is worth celebrating.
          </p>
          <div className="flex gap-4 mt-6">
            {['dashboard', '1:1-prep', 'reflection-log'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  currentView === view 
                  ? 'bg-[#2E7D32] text-white shadow-md' 
                  : 'bg-white text-[#546E7A] border border-[#CFD8DC] hover:bg-[#F1F8E9]'
                }`}
              >
                {view === 'dashboard' ? 'Overview' : view === '1:1-prep' ? '1:1 Prep' : 'Reflection Journal'}
              </button>
            ))}
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Growth Tracker */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E0]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-google-sans font-medium text-[#263238]">Growth Tracker</h2>
                    <span className="text-sm text-[#78909C]">Sustainable Innovation</span>
                  </div>
                  <div className="space-y-6">
                    {userExpectations.slice(0, 3).map((exp) => (
                      <div key={exp.expectation_id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{exp.title}</span>
                          <span className="text-[#2E7D32]">{exp.focus_percent}% Focus</span>
                        </div>
                        <div className="h-2 bg-[#F1F8E9] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${exp.focus_percent}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-[#81C784]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E0]">
                  <h2 className="text-2xl font-google-sans font-medium text-[#263238] mb-6">Active OKRs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userOKRs.map((okr, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#F0F4C3]/30 border border-[#DCE775]/50">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{okr.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-white text-[#827717] font-bold">{okr.priority}</span>
                          <span className="text-xs text-[#546E7A]">{okr.key_results.length} Key Results</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Encouragement Cards */}
              <div className="space-y-6">
                <h2 className="text-xl font-google-sans font-medium text-[#263238] px-2">Mentor's Insights</h2>
                {encouragementCards.filter(c => !dismissedCards.includes(c.id)).map((card) => (
                  <motion.div 
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#E3F2FD] rounded-2xl p-6 shadow-sm border border-[#BBDEFB] relative group"
                  >
                    <button 
                      onClick={() => setDismissedCards([...dismissedCards, card.id])}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded-full"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-xl text-[#1976D2]">
                        <span className="material-symbols-outlined">{card.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-google-sans font-medium text-[#0D47A1] mb-1">{card.title}</h3>
                        <p className="text-sm text-[#1565C0] leading-relaxed">{card.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="p-6 rounded-2xl border-2 border-dashed border-[#CFD8DC] flex flex-col items-center justify-center text-center space-y-2">
                  <span className="material-symbols-outlined text-[#B0BEC5] text-3xl">lightbulb</span>
                  <p className="text-xs text-[#78909C]">New insights will appear as you update your reflection journal.</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === '1:1-prep' && (
            <motion.div
              key="1:1-prep"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-lg border border-[#E0E0E0]"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-google-sans font-medium text-[#263238]">1:1 Preparation</h2>
                  <p className="text-[#546E7A]">Guided flow for your meeting with {userManager}</p>
                </div>
                <div className="flex gap-1">
                  {prepSteps.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i <= prepStep ? 'bg-[#2E7D32]' : 'bg-[#E0E0E0]'}`} />
                  ))}
                </div>
              </div>

              <motion.div 
                key={prepStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">Step {prepStep + 1}: {prepSteps[prepStep].title}</span>
                  <h3 className="text-2xl font-google-sans text-[#37474F]">{prepSteps[prepStep].question}</h3>
                </div>
                <textarea 
                  placeholder={prepSteps[prepStep].placeholder}
                  className="w-full h-40 p-6 rounded-2xl bg-[#F9FBE7] border border-[#DCEDC8] focus:ring-2 focus:ring-[#81C784] focus:border-transparent outline-none transition-all resize-none text-lg"
                />
                <div className="flex justify-between pt-6">
                  <button 
                    disabled={prepStep === 0}
                    onClick={() => setPrepStep(prepStep - 1)}
                    className="px-8 py-3 rounded-full text-[#546E7A] font-medium hover:bg-[#F5F5F5] disabled:opacity-30"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => prepStep < prepSteps.length - 1 ? setPrepStep(prepStep + 1) : setCurrentView('dashboard')}
                    className="px-10 py-3 rounded-full bg-[#2E7D32] text-white font-medium shadow-md hover:bg-[#1B5E20] transition-all"
                  >
                    {prepStep === prepSteps.length - 1 ? 'Finish & Save' : 'Next Step'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentView === 'reflection-log' && (
            <motion.div
              key="reflection-log"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-[#FFFDE7] rounded-3xl p-10 shadow-sm border border-[#FFF9C4]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white rounded-2xl text-[#FBC02D] shadow-sm">
                    <span className="material-symbols-outlined text-3xl">edit_note</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-google-sans font-medium text-[#263238]">Reflection Journal</h2>
                    <p className="text-[#795548]">Capture your thoughts on leadership impact and team culture.</p>
                  </div>
                </div>
                <textarea 
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Today I was thinking about..."
                  className="w-full h-80 p-8 rounded-2xl bg-white/80 border border-[#FFF59D] focus:ring-2 focus:ring-[#FBC02D] outline-none transition-all resize-none text-xl leading-relaxed font-serif italic"
                />
                <div className="flex justify-end mt-6">
                  <button 
                    onClick={() => {
                      alert('Reflection saved to your growth journey.');
                      setReflection('');
                    }}
                    className="px-10 py-4 rounded-full bg-[#FBC02D] text-[#5D4037] font-bold shadow-md hover:bg-[#F9A825] transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">save</span>
                    Save Reflection
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                  <h4 className="font-bold text-[#2E7D32] mb-2">Prompt of the Day</h4>
                  <p className="text-sm text-[#546E7A]">"What is one thing you did this week that made a team member feel psychologically safe?"</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                  <h4 className="font-bold text-[#1976D2] mb-2">Leadership Tip</h4>
                  <p className="text-sm text-[#546E7A]">Vulnerability is a strength. Sharing a mistake with your team can build immense trust.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
