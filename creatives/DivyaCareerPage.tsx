import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Award, 
  ChevronRight, 
  MessageSquare, 
  Calendar,
  Target,
  Zap,
  Smile,
  Star,
  ArrowRight
} from 'lucide-react';

interface DivyaCareerPageProps {
  userName?: string;
  userEmail?: string;
}

export const DivyaCareerPage: React.FC<DivyaCareerPageProps> = ({ userName = 'Divya' }) => {
  // Mock data for Divya
  const userRole = "Senior Software Engineer";
  const teamName = "Core Infrastructure";
  const growthProgress = 78;
  
  const recentWins = [
    { id: 1, title: "Led the Q1 Architecture Review", date: "2 days ago", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 2, title: "Mentored 3 new joiners in the team", date: "1 week ago", icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { id: 3, title: "Optimized the data pipeline by 40%", date: "2 weeks ago", icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> }
  ];

  const growthAreas = [
    { id: 1, title: "Strategic Leadership", progress: 65, color: "bg-blue-500" },
    { id: 2, title: "Public Speaking", progress: 40, color: "bg-purple-500" },
    { id: 3, title: "System Design", progress: 90, color: "bg-emerald-500" }
  ];

  return (
    <div className="flex-1 flex flex-col gap-8 max-w-6xl mx-auto w-full pb-12">
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3 text-[#1A73E8]">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Career Reflection</span>
        </div>
        <h1 className="text-4xl font-semibold text-[#1F1F1F]">
          Welcome back, {userName}.
        </h1>
        <p className="text-xl text-[#5F6368] max-w-2xl">
          How are you feeling about your progress today? Let's take a moment to celebrate your growth and plan your next steps.
        </p>
      </motion.header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Reflection & Growth */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Reflection Space */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-[#E9EEF6] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#E8F0FE] rounded-2xl">
                  <Smile className="w-6 h-6 text-[#1A73E8]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1F1F1F]">Reflection Space</h2>
                  <p className="text-sm text-[#5F6368]">Your personal corner for growth</p>
                </div>
              </div>
              <button className="text-[#1A73E8] text-sm font-medium hover:underline flex items-center gap-1">
                View History <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-[#F8FAFD] rounded-2xl p-6 border border-[#E9EEF6]">
              <p className="text-[#444746] italic mb-4">
                "I've been focusing a lot on technical delivery lately. I want to shift some energy towards mentoring the new engineers on the team. It feels rewarding to see them grow."
              </p>
              <div className="flex items-center gap-2 text-xs text-[#747775]">
                <Calendar className="w-3 h-3" />
                <span>Last updated: April 4, 2026</span>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-3 px-4 bg-[#1A73E8] text-white rounded-xl font-medium hover:bg-[#1557B0] transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                New Reflection
              </button>
              <button className="flex-1 py-3 px-4 bg-white border border-[#C4C7C5] text-[#1F1F1F] rounded-xl font-medium hover:bg-[#F8FAFD] transition-colors">
                Guided Flow
              </button>
            </div>
          </motion.section>

          {/* Growth Tracker */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-[#E9EEF6] shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#F3E8FF] rounded-2xl">
                <Target className="w-6 h-6 text-[#9333EA]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1F1F1F]">Growth Tracker</h2>
                <p className="text-sm text-[#5F6368]">Progress towards your 2026 goals</p>
              </div>
            </div>

            <div className="space-y-6">
              {growthAreas.map((area) => (
                <div key={area.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-[#444746]">{area.title}</span>
                    <span className="text-[#5F6368]">{area.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#E9EEF6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${area.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${area.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>

        {/* Right Column: Wins & Stats */}
        <div className="flex flex-col gap-6">
          
          {/* Celebration Cards */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#FFF8E1] rounded-3xl p-8 border border-[#FFE082] shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Award className="w-6 h-6 text-[#F9AB00]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1F1F1F]">Recent Wins</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {recentWins.map((win) => (
                <div key={win.id} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-white/50">
                  <div className="mt-1">{win.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-[#1F1F1F] leading-tight">{win.title}</p>
                    <p className="text-xs text-[#5F6368] mt-1">{win.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 text-[#1A73E8] text-sm font-medium bg-white rounded-xl border border-[#FFE082] hover:bg-[#FFFDE7] transition-colors">
              Add a Win
            </button>
          </motion.section>

          {/* Quick Stats */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#E8F0FE] rounded-3xl p-8 border border-[#D2E3FC] shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Star className="w-6 h-6 text-[#1A73E8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1F1F1F]">Impact Score</h2>
            </div>
            
            <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="white"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="#1A73E8"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 * (1 - growthProgress / 100) }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#1A73E8]">{growthProgress}</span>
                  <span className="text-[10px] text-[#5F6368] uppercase font-bold tracking-widest">Growth</span>
                </div>
              </div>
              <p className="text-sm text-[#444746] mt-6 text-center">
                You're in the <span className="font-bold text-[#1A73E8]">top 15%</span> of performers in {teamName}.
              </p>
            </div>
          </motion.section>

          {/* Next Steps */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#F1F3F4] rounded-3xl p-8 border border-[#DADCE0] shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[#1F1F1F] mb-4">What's next?</h2>
            <div className="flex flex-col gap-3">
              <button className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] transition-all">
                <span className="text-sm font-medium text-[#444746]">Schedule 1:1 with Mentor</span>
                <ArrowRight className="w-4 h-4 text-[#5F6368] group-hover:text-[#1A73E8] group-hover:translate-x-1 transition-all" />
              </button>
              <button className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-[#DADCE0] hover:border-[#1A73E8] transition-all">
                <span className="text-sm font-medium text-[#444746]">Explore Leadership Path</span>
                <ArrowRight className="w-4 h-4 text-[#5F6368] group-hover:text-[#1A73E8] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.section>

        </div>

      </div>
    </div>
  );
};
