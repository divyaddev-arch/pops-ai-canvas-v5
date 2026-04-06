import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UnifiedLayout } from '../packages/ue/UnifiedLayout';
import { Icon } from '../packages/gm3-react-components';

// Mock data imports
import personData from '../person_mock_data.json';
import expectationsData from '../expectations_mock_data.json';
import ratingsData from '../ratings_mock_data.json';
import okrData from '../okr_mock_data.json';

// Interfaces for type safety
interface Person {
  person_number: number;
  username: string;
  preferred_name: { given_name: string; family_name: string };
  work: {
    preferred_title: string;
    visible_advanced_job_family: { name: string };
  };
  email_addresses: { address: string; is_primary: boolean }[];
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
  review_period_id: string;
}

interface OKR {
  title: string;
  priority: string;
  owner: string;
  key_results: { title: string; target: any; current: any; metric?: string }[];
}

const GrowthOverview: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'reflection' | 'prep'>('dashboard');
  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // User context (Divya)
  const userEmail = 'divyaddev@google.com';
  
  // Resolve user data
  const person = (personData as any[]).find(p => 
    p.email_addresses?.some((e: any) => e.address === userEmail)
  ) || (personData as any[])[0];

  const userName = "Divya"; // Explicitly requested
  const userRole = "Senior Director"; // Explicitly requested
  const userTeam = person.work.visible_advanced_job_family.name;
  const personId = person.person_number;
  const username = person.username;

  const userExpectations = (expectationsData as any[]).filter(e => e.owner === personId);
  const userRatings = (ratingsData as any[]).filter(r => r.subject_person_id === personId);
  const userOKRs = (okrData.okrs as any[]).filter(o => o.owner === username);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveReflection = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const systemInstruction = `You are a Growth and Performance Advisor for ${userName}. 
Your goal is to help them monitor team health, track OKRs, and prepare for 1:1s.
Focus on providing insights into team dynamics and suggesting actionable growth steps based on the current performance data.`;

  if (loading) {
    return (
      <UnifiedLayout 
        activeId="growth" 
        activeDrawerItemId="overview" 
        userName={userName} 
        userEmail={userEmail}
        systemInstruction={systemInstruction}
      >
        <div className="flex items-center justify-center h-full">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#A7C080] border-t-transparent rounded-full"
          />
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout 
      activeId="growth" 
      activeDrawerItemId="overview" 
      userName={userName} 
      userEmail={userEmail}
      systemInstruction={systemInstruction}
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-semibold text-[#2D3436] tracking-tight"
            >
              Welcome back, {userName}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#636E72] mt-1 text-lg"
            >
              How are you feeling about your team's trajectory today?
            </motion.p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-[#A7C080] text-white shadow-sm' : 'bg-white text-[#636E72] hover:bg-[#F1F3F4]'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setCurrentView('reflection')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === 'reflection' ? 'bg-[#A7C080] text-white shadow-sm' : 'bg-white text-[#636E72] hover:bg-[#F1F3F4]'}`}
            >
              Journal
            </button>
            <button 
              onClick={() => setCurrentView('prep')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === 'prep' ? 'bg-[#A7C080] text-white shadow-sm' : 'bg-white text-[#636E72] hover:bg-[#F1F3F4]'}`}
            >
              1:1 Prep
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Progress & Stats */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Growth Progress Tracker */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#E9ECEF]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#E7F3FF] rounded-lg">
                        <Icon size={20} className="text-[#4A90E2]">trending_up</Icon>
                      </div>
                      <h2 className="text-xl font-medium text-[#2D3436]">Growth Progress</h2>
                    </div>
                    <span className="text-sm font-medium text-[#A7C080] bg-[#F4F9F1] px-3 py-1 rounded-full">On Track</span>
                  </div>

                  <div className="space-y-8">
                    {userOKRs.slice(0, 2).map((okr, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-[#2D3436] line-clamp-1">{okr.title}</span>
                          <span className="text-[#636E72]">75%</span>
                        </div>
                        <div className="h-2 w-full bg-[#F1F3F4] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1, delay: 0.2 * idx }}
                            className="h-full bg-[#A7C080] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 grid grid-cols-3 gap-4">
                    <div className="p-4 bg-[#FDFCF0] rounded-xl border border-[#F9F6E5]">
                      <p className="text-xs text-[#636E72] uppercase tracking-wider font-semibold">Expectations</p>
                      <p className="text-2xl font-bold text-[#2D3436] mt-1">{userExpectations.length}</p>
                      <p className="text-[10px] text-[#A7C080] mt-1 flex items-center gap-1">
                        <Icon size={12}>check_circle</Icon> All Active
                      </p>
                    </div>
                    <div className="p-4 bg-[#F4F9F1] rounded-xl border border-[#E9F2E6]">
                      <p className="text-xs text-[#636E72] uppercase tracking-wider font-semibold">Latest Rating</p>
                      <p className="text-2xl font-bold text-[#2D3436] mt-1">Outstanding</p>
                      <p className="text-[10px] text-[#A7C080] mt-1 flex items-center gap-1">
                        <Icon size={12}>trending_up</Icon> Top 5%
                      </p>
                    </div>
                    <div className="p-4 bg-[#E7F3FF] rounded-xl border border-[#D9E9F9]">
                      <p className="text-xs text-[#636E72] uppercase tracking-wider font-semibold">Team Health</p>
                      <p className="text-2xl font-bold text-[#2D3436] mt-1">92%</p>
                      <p className="text-[10px] text-[#4A90E2] mt-1 flex items-center gap-1">
                        <Icon size={12}>sentiment_satisfied</Icon> High Safety
                      </p>
                    </div>
                  </div>
                </section>

                {/* Expectations List */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-[#E9ECEF]">
                  <h3 className="text-lg font-medium text-[#2D3436] mb-6 flex items-center gap-2">
                    <Icon size={20} className="text-[#F1C40F]">auto_awesome</Icon> Focus Areas for {userRole}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userExpectations.slice(0, 4).map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-[#F1F3F4] hover:border-[#A7C080] transition-colors group cursor-default">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-[#A7C080] bg-[#F4F9F1] px-2 py-0.5 rounded uppercase tracking-tighter">
                            {exp.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-[#636E72]">{exp.focus_percent}% Focus</span>
                        </div>
                        <h4 className="font-medium text-[#2D3436] mt-2 group-hover:text-[#A7C080] transition-colors">{exp.title}</h4>
                        <p className="text-xs text-[#636E72] mt-1 line-clamp-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Mentor Insights & Quick Actions */}
              <div className="space-y-6">
                
                {/* Supportive Mentor Card */}
                <section className="bg-[#A7C080] p-8 rounded-2xl shadow-md text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <Icon size={40} className="mb-4 opacity-80">favorite</Icon>
                    <h3 className="text-xl font-semibold mb-2">Mentor's Note</h3>
                    <p className="text-sm leading-relaxed opacity-90 italic">
                      "Divya, your focus on psychological safety within the {userTeam} team is already showing results. Remember that leadership is a marathon, not a sprint. Take a moment to reflect on your wins this week."
                    </p>
                    <button 
                      onClick={() => setCurrentView('reflection')}
                      className="mt-6 w-full py-3 bg-white text-[#A7C080] rounded-xl font-medium text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      Open Journal <Icon size={16}>arrow_forward</Icon>
                    </button>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full" />
                  <div className="absolute top-10 -left-10 w-20 h-20 bg-white opacity-5 rounded-full" />
                </section>

                {/* 1:1 Prep Quick Card */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E9ECEF]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#FDFCF0] rounded-lg">
                      <Icon size={20} className="text-[#F1C40F]">calendar_today</Icon>
                    </div>
                    <h3 className="text-lg font-medium text-[#2D3436]">Upcoming 1:1s</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFD] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E7F3FF] flex items-center justify-center text-[#4A90E2] font-bold">JD</div>
                        <div>
                          <p className="text-sm font-medium text-[#2D3436]">Jordan D.</p>
                          <p className="text-xs text-[#636E72]">Tomorrow, 10:00 AM</p>
                        </div>
                      </div>
                      <Icon size={16} className="text-[#C4C7C5] group-hover:text-[#A7C080]">chevron_right</Icon>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFD] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F4F9F1] flex items-center justify-center text-[#A7C080] font-bold">SL</div>
                        <div>
                          <p className="text-sm font-medium text-[#2D3436]">Sarah L.</p>
                          <p className="text-xs text-[#636E72]">Thursday, 2:30 PM</p>
                        </div>
                      </div>
                      <Icon size={16} className="text-[#C4C7C5] group-hover:text-[#A7C080]">chevron_right</Icon>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentView('prep')}
                    className="mt-6 w-full py-2 text-[#A7C080] font-medium text-sm hover:underline"
                  >
                    View all templates
                  </button>
                </section>

                {/* SideAgent Trigger */}
                <section className="bg-[#F8FAFD] p-6 rounded-2xl border-2 border-dashed border-[#C4C7C5] flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[#A7C080]">auto_awesome</Icon>
                  </div>
                  <h4 className="text-sm font-medium text-[#2D3436]">Need a sounding board?</h4>
                  <p className="text-xs text-[#636E72] mt-1 mb-4">Your Supportive Mentor agent is ready to discuss leadership strategies.</p>
                  <button className="px-6 py-2 bg-[#2D3436] text-white rounded-full text-xs font-medium hover:bg-black transition-colors flex items-center gap-2">
                    <Icon size={12}>chat_bubble</Icon> Talk to Agent
                  </button>
                </section>

              </div>
            </motion.div>
          )}

          {currentView === 'reflection' && (
            <motion.div 
              key="reflection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-10 rounded-3xl shadow-md border border-[#E9ECEF]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#FDFCF0] rounded-2xl">
                    <Icon size={24} className="text-[#F1C40F]">menu_book</Icon>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-[#2D3436]">Leadership Journal</h2>
                    <p className="text-[#636E72]">A quiet space for your thoughts, {userName}.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#636E72] ml-1">What's on your mind today regarding your leadership journey?</label>
                    <textarea 
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Reflect on a recent challenge, a team win, or a personal growth moment..."
                      className="w-full h-64 p-6 bg-[#FDFCF0] border-none rounded-2xl text-[#2D3436] placeholder-[#C4C7C5] focus:ring-2 focus:ring-[#A7C080] resize-none text-lg leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#636E72]">
                      <Icon size={16}>schedule</Icon>
                      Last saved: Just now
                    </div>
                    <button 
                      onClick={handleSaveReflection}
                      disabled={isSaving || !reflectionText}
                      className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${saveSuccess ? 'bg-[#A7C080] text-white' : 'bg-[#2D3436] text-white hover:bg-black disabled:opacity-50'}`}
                    >
                      {isSaving ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : saveSuccess ? (
                        <><Icon size={16}>check_circle</Icon> Saved</>
                      ) : (
                        <><Icon size={16}>save</Icon> Save Reflection</>
                      )}
                    </button>
                  </div>
                </div>

                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-[#F4F9F1] rounded-2xl border border-[#E9F2E6] flex items-center gap-3 text-[#A7C080]"
                  >
                    <Icon size={20}>auto_awesome</Icon>
                    <span className="text-sm font-medium">Beautiful reflection, Divya. Taking time for this is a leadership win in itself.</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'prep' && (
            <motion.div 
              key="prep"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-[#2D3436]">1:1 Conversation Preparation</h2>
                <p className="text-[#636E72] mt-2">Empower your team through meaningful, growth-oriented dialogue.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "The Growth Path",
                    desc: "Focus on long-term aspirations and skill development.",
                    icon: <Icon size={24} className="text-[#A7C080]">trending_up</Icon>,
                    bg: "bg-[#F4F9F1]",
                    border: "border-[#E9F2E6]"
                  },
                  {
                    title: "Psychological Safety",
                    desc: "Check-in on team dynamics and individual well-being.",
                    icon: <Icon size={24} className="text-[#E67E22]">favorite</Icon>,
                    bg: "bg-[#FEF5ED]",
                    border: "border-[#FDEBD0]"
                  },
                  {
                    title: "Strategic Alignment",
                    desc: "Connect individual work to the broader team vision.",
                    icon: <Icon size={24} className="text-[#4A90E2]">trending_up</Icon>,
                    bg: "bg-[#E7F3FF]",
                    border: "border-[#D9E9F9]"
                  }
                ].map((template, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className={`p-8 rounded-3xl border ${template.border} ${template.bg} shadow-sm cursor-pointer group transition-all`}
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {template.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-[#2D3436] mb-2">{template.title}</h3>
                    <p className="text-sm text-[#636E72] leading-relaxed mb-8">{template.desc}</p>
                    <button className="w-full py-3 bg-white text-[#2D3436] rounded-xl font-medium text-sm border border-transparent group-hover:border-[#A7C080] transition-all">
                      Use Template
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E9ECEF]">
                <h3 className="text-lg font-medium text-[#2D3436] mb-4">Recent Prep Notes</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#F8FAFD] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#A7C080]" />
                      <span className="text-sm font-medium text-[#2D3436]">Jordan D. - Career Pathing</span>
                    </div>
                    <span className="text-xs text-[#636E72]">2 days ago</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F8FAFD] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#F1C40F]" />
                      <span className="text-sm font-medium text-[#2D3436]">Sarah L. - Project Feedback</span>
                    </div>
                    <span className="text-xs text-[#636E72]">Last week</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </UnifiedLayout>
  );
};

export default GrowthOverview;
