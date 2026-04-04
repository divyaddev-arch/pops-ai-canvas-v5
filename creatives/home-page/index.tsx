import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Icon,
  Chip,
  Snackbar,
} from '@my-google-project/gm3-react-components';

import { motion, AnimatePresence } from 'motion/react';
import { PromptInput } from './PromptInput';
import { ChatView } from './ChatView';
import { useAuth } from '../../src/lib/AuthContext';
import { db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where, getDocs, limit, updateDoc, doc } from '../../src/lib/firebase';
import { handleFirestoreError, OperationType } from '../../src/lib/firestoreUtils';
import { generateChatResponseNew, buildSystemInstruction } from '../../src/services/geminiService';
import personData from '../../person_mock_data.json';
import expectationsData from '../../expectations_mock_data.json';
import ratingsData from '../../ratings_mock_data.json';

type ConversationState = 'IDLE' | 'CHECKING' | 'CONFIRMING' | 'GATHERING_DETAILS' | 'SHOWING_PROMPT';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp?: any;
  type?: 'text' | 'prompt';
}

interface Project {
  id: string;
  projectName: string;
  createdAt: any;
}

const Page01 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'home' | 'chat' | 'library' | 'starred' | 'shared'>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [state, setState] = useState<ConversationState>('IDLE');
  const { user } = useAuth();
  const userEmail = user?.email || 'richardmccoll@google.com';

  const getInitialUserContext = (email: string) => {
    const person = (personData as any[]).find(p => 
      p.email_addresses?.some((e: any) => e.address === email)
    ) || (personData as any[])[0];
    
    const personId = person.person_number;
    const expectations = (expectationsData as any[]).filter(e => e.owner === personId);
    const ratings = (ratingsData as any[]).filter(r => r.subject_person_id === personId);
    
    return { person, expectations, ratings };
  };

  const [agentState, setAgentState] = useState<any>({
    isCareerCoaching: false,
    userDetails: '',
    conversationHistory: [],
    userContext: getInitialUserContext(userEmail),
    loggedInUserName: user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
    userEmail: userEmail,
    intent: null,
    tone: null,
    custom: null
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Update userContext if user changes
    setAgentState(prev => ({
      ...prev,
      userContext: getInitialUserContext(userEmail),
      loggedInUserName: user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
      userEmail: userEmail
    }));
  }, [userEmail, user?.displayName]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error toggling full-screen mode:", err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userInitial = user?.displayName?.[0] || user?.email?.[0] || 'A';
  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  // Fetch projects
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where('ownerId', '==', user.uid)
      // orderBy('createdAt', 'desc') // Removed to avoid composite index requirement
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Projects snapshot received, size:', snapshot.size);
      const projectsData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Project data from Firestore:', doc.id, data);
        return {
          id: doc.id,
          projectName: data.projectName || data.project_name || data['project name'] || data.name || data.title || '',
          ...data
        };
      }) as Project[];

      // Sort in memory to avoid composite index requirement
      projectsData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
        const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
        return timeB - timeA;
      });

      setProjects(projectsData);
    }, (error) => {
      console.error('Error fetching projects:', error);
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return () => unsubscribe();
  }, [user]);

  // Sync messages
  useEffect(() => {
    if (!currentProjectId || !currentSessionId) {
      setMessages([]);
      return;
    }

    const path = `projects/${currentProjectId}/sessions/${currentSessionId}/messages`;
    const q = query(
      collection(db, path)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Messages snapshot received for project:', currentProjectId, 'session:', currentSessionId, 'size:', snapshot.size);
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Sort locally to handle null timestamps and ensure consistent order
      messagesData.sort((a, b) => {
        const getTime = (ts: any) => {
          if (!ts) return Date.now() + 1000; // Put pending at the end
          if (ts.toMillis) return ts.toMillis();
          if (ts instanceof Date) return ts.getTime();
          if (typeof ts === 'number') return ts;
          return Date.now();
        };
        const timeA = getTime(a.timestamp);
        const timeB = getTime(b.timestamp);
        if (timeA !== timeB) return timeA - timeB;
        return a.id.localeCompare(b.id); // Tie-breaker using document ID
      });

      setMessages(messagesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [currentProjectId, currentSessionId]);

  useEffect(() => {
    console.log('Current view changed to:', view);
  }, [view]);

  const handleClearChat = () => {
    setMessages([]);
    setCurrentProjectId(null);
    setCurrentSessionId(null);
    setView('home');
    setAgentState({
      isCareerCoaching: false,
      userDetails: '',
      conversationHistory: [],
      userContext: getInitialUserContext(userEmail),
      loggedInUserName: user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
      userEmail: userEmail,
      intent: null,
      tone: null,
      custom: null
    });
  };

  const createNewProjectAndSession = async (initialPrompt?: string) => {
    if (!user) return;

    try {
      // 1. Create Project
      const projectName = initialPrompt
        ? (initialPrompt.length > 40 ? initialPrompt.substring(0, 40) + '...' : initialPrompt)
        : 'New Project';

      const projectRef = await addDoc(collection(db, 'projects'), {
        projectName: projectName,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });

      // 2. Create Session
      const sessionRef = await addDoc(collection(db, `projects/${projectRef.id}/sessions`), {
        projectId: projectRef.id,
        projectName: projectName,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      setCurrentProjectId(projectRef.id);
      setCurrentSessionId(sessionRef.id);
      return { projectId: projectRef.id, sessionId: sessionRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects or sessions');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    let projId = currentProjectId;
    let sessId = currentSessionId;

    // If we are on the home screen, we always want to create a new project
    let freshState = agentState;
    if (view === 'home' || !projId || !sessId) {
      const result = await createNewProjectAndSession(content);
      if (result) {
        projId = result.projectId;
        sessId = result.sessionId;
        
        // Reset agent state for the new project to avoid leakage
        freshState = {
          isCareerCoaching: false,
          userDetails: '',
          conversationHistory: [],
          userContext: getInitialUserContext(userEmail),
          loggedInUserName: user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
          intent: null,
          tone: null,
          custom: null
        };
        setAgentState(freshState);
      } else {
        return;
      }
    }

    setView('chat');
    const path = `projects/${projId}/sessions/${sessId}/messages`;

    try {
      // Save user message
      const userMsgPath = `projects/${projId}/sessions/${sessId}/messages`;
      await addDoc(collection(db, userMsgPath), {
        role: 'user',
        content,
        timestamp: serverTimestamp()
      });

      // Process with Meta-Agent logic
      setIsAgentTyping(true);
      const instr = buildSystemInstruction(JSON.stringify(freshState));

      let response;
      try {
        response = await generateChatResponseNew(content, instr);
      } catch (geminiError: any) {
        console.error("Gemini API failed:", geminiError);
        // Save a fallback message to Firestore so the user knows what happened
        await addDoc(collection(db, userMsgPath), {
          role: 'agent',
          content: "I'm sorry, I encountered an internal error while processing your request. Please try again in a moment.",
          timestamp: serverTimestamp(),
          error: true
        });
        setIsAgentTyping(false);
        return;
      }

      setIsAgentTyping(false);
      setState('IDLE');

      // Parse response
      let messageToUser = response;
      let updatedState = freshState;

      if (response.includes('| JSON_START |')) {
        const parts = response.split('| JSON_START |');
        messageToUser = parts[0].trim();
        let jsonPart = parts[1].split('| JSON_END |')[0].trim();

        const firstBrace = jsonPart.indexOf('{');
        const lastBrace = jsonPart.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonPart = jsonPart.substring(firstBrace, lastBrace + 1);
          try {
            const parsedState = JSON.parse(jsonPart);
            updatedState = { ...freshState, ...parsedState };
            setAgentState(updatedState);
            // Persist agent state to session
            if (projId && sessId) {
              updateDoc(doc(db, `projects/${projId}/sessions/${sessId}`), {
                agentState: updatedState
              }).catch(e => console.error("Failed to persist agent state:", e));
            }
          } catch (e) {
            console.error("Failed to parse agent state", e, "Raw JSON Part:", jsonPart);
          }
        }
      }

      // Save agent response
      await addDoc(collection(db, path), {
        role: 'agent',
        content: messageToUser,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      setIsAgentTyping(false);
      setState('IDLE');
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleSelectProject = async (project: Project) => {
    console.log('handleSelectProject called for project:', project.id, 'projectName:', project.projectName);
    if (!user) {
      console.error('No user found when selecting project');
      return;
    }

    console.log('Setting currentProjectId to:', project.id);
    setCurrentProjectId(project.id);
    console.log('Setting view to chat');
    setView('chat');

    // Reset agent state when switching projects to avoid state leakage
    setAgentState({
      isCareerCoaching: false,
      userDetails: '',
      conversationHistory: [],
      userContext: getInitialUserContext(userEmail),
      loggedInUserName: user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
      userEmail: userEmail,
      intent: null,
      tone: null,
      custom: null
    });

    // Get the latest session for this project
    try {
      console.log('Fetching sessions for project:', project.id);
      const sessionsQ = query(
        collection(db, `projects/${project.id}/sessions`),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const sessionSnapshot = await getDocs(sessionsQ);
      if (!sessionSnapshot.empty) {
        const sessionDoc = sessionSnapshot.docs[0];
        const sessionId = sessionDoc.id;
        const sessionData = sessionDoc.data();
        console.log('Found existing session:', sessionId, 'with state:', sessionData.agentState);
        setCurrentSessionId(sessionId);
        
        if (sessionData.agentState) {
          setAgentState(sessionData.agentState);
        }
      } else {
        console.log('No session found, creating new one');
        // Create a new session if none exists
        const sessionRef = await addDoc(collection(db, `projects/${project.id}/sessions`), {
          projectId: project.id,
          projectName: project.projectName || 'Untitled Project',
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        console.log('Created new session:', sessionRef.id);
        setCurrentSessionId(sessionRef.id);
      }
    } catch (error) {
      console.error('Error in handleSelectProject:', error);
      handleFirestoreError(error, OperationType.LIST, `projects/${project.id}/sessions`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-surface text-on-surface overflow-hidden font-google-sans-text relative" id="page01-root-container">
      <div className="h-16 bg-surface border-b border-outline-variant text-on-surface flex items-center justify-between px-6 relative z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl font-google-sans font-medium">POPS AI CANVAS</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <aside className="w-[256px] h-full bg-[#F8FAFD] border-r border-outline-variant flex flex-col p-0 gap-0 overflow-y-auto shrink-0" id="custom-sidebar">
          <div className="p-2 pt-2 flex flex-col gap-4">
            {/* Extended FAB */}
            <div className="pl-2 pr-0 pt-2 pb-0">
              <Button
                variant="filled"
                className="!w-[173px] !h-[56px] !rounded-2xl !bg-[#D3E3FD] !text-[#0842A0] !normal-case flex items-center justify-center gap-2 shadow-none font-google-sans font-medium"
                onClick={handleClearChat}
              >
                <Icon className="text-[#0842A0] material-symbols-outlined">add</Icon>
                <span className="text-base">Create project</span>
              </Button>
            </div>

            {/* Menu Items */}
            <div className="w-[248px] flex flex-col gap-0">
              <Button
                variant="text"
                className={`!justify-start !text-left !h-[48px] !px-[18px] !rounded-full !normal-case font-google-sans-text ${view === 'home' ? '!bg-secondary-container !text-on-secondary-container' : '!text-on-surface'}`}
                onClick={() => setView('home')}
              >
                <Icon className="mr-[14px] opacity-60 material-symbols-outlined">home</Icon>
                <span className="font-medium text-sm">Home</span>
              </Button>

              {/* Section Header */}
              <div className="h-[48px] flex items-end px-[16px] pb-[8px]">
                <span className="text-sm font-google-sans font-medium text-[#444746]">Recent</span>
              </div>

              <div className="flex flex-col gap-0">
                {projects.slice(0, 3).map((p) => (
                  <Button
                    key={`recent-${p.id}`}
                    variant="text"
                    className={`!justify-start !text-left !h-[40px] !px-[18px] !rounded-full !normal-case !text-sm font-google-sans-text ${currentProjectId === p.id ? '!bg-secondary-container !text-on-secondary-container' : '!text-on-surface/80 hover:!text-on-surface'}`}
                    onClick={() => handleSelectProject(p)}
                  >
                    <Icon className="mr-3 text-sm opacity-60 material-symbols-outlined">chat_bubble</Icon>
                    <span className="truncate flex-1">{p.projectName || 'Untitled Project'}</span>
                  </Button>
                ))}
                {projects.length === 0 && (
                  <div className="px-[18px] py-2 text-xs opacity-40 italic font-google-sans-text">No recent projects</div>
                )}
              </div>

              {/* Section Header */}
              <div className="h-[48px] flex items-end px-[16px] pb-[8px]">
                <span className="text-sm font-google-sans font-medium text-[#444746]">Library</span>
              </div>

              {/* All projects accordion */}
              <div className="flex flex-col">
                <Button
                  variant="text"
                  className={`!justify-start !text-left !h-[48px] !px-[18px] !rounded-full !normal-case font-google-sans-text ${showAllProjects ? '!bg-secondary-container/30' : ''}`}
                  onClick={() => setShowAllProjects(!showAllProjects)}
                >
                  <Icon className="mr-[14px] opacity-60 material-symbols-outlined">grid_view</Icon>
                  <span className="font-medium text-sm flex-1">All projects</span>
                  <Icon className={`transition-transform duration-200 material-symbols-outlined ${showAllProjects ? 'rotate-180' : ''}`}>expand_more</Icon>
                </Button>
                
                <AnimatePresence>
                  {showAllProjects && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col ml-4 mt-1 border-l border-outline-variant/30"
                    >
                      {projects.length > 0 ? (
                        projects.map((p) => (
                          <Button
                            key={p.id}
                            variant="text"
                            className={`!justify-start !text-left !h-[40px] !px-[18px] !rounded-full !normal-case !text-xs font-google-sans-text ${currentProjectId === p.id ? '!bg-secondary-container !text-on-secondary-container' : '!text-on-surface/70 hover:!text-on-surface'}`}
                            onClick={() => handleSelectProject(p)}
                          >
                            <Icon className="mr-3 text-sm opacity-40 material-symbols-outlined">chat_bubble</Icon>
                            <span className="truncate flex-1">{p.projectName || 'Untitled Project'}</span>
                          </Button>
                        ))
                      ) : (
                        <div className="px-[18px] py-3 text-xs opacity-40 italic font-google-sans-text">No projects yet</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="text"
                className={`!justify-start !text-left !h-[48px] !px-[18px] !rounded-full !normal-case font-google-sans-text ${view === 'starred' ? '!bg-secondary-container !text-on-secondary-container' : '!text-on-surface'}`}
                onClick={() => setView('starred')}
              >
                <Icon className="mr-[14px] opacity-60 material-symbols-outlined">grade</Icon>
                <span className="font-medium text-sm">Starred projects</span>
              </Button>

              <Button
                variant="text"
                className={`!justify-start !text-left !h-[48px] !px-[18px] !rounded-full !normal-case font-google-sans-text ${view === 'shared' ? '!bg-secondary-container !text-on-secondary-container' : '!text-on-surface'}`}
                onClick={() => setView('shared')}
              >
                <Icon className="mr-[14px] opacity-60 material-symbols-outlined">group</Icon>
                <span className="font-medium text-sm">Shared with me</span>
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 overflow-hidden relative bg-surface-container-lowest">
          <main className={`flex-1 overflow-y-auto flex flex-col transition-all duration-300 ${view === 'home' ? 'bg-gradient-to-b from-[#FCF2F8] to-[#F3F5FD]' : 'bg-white'}`}>
            <div className="flex-grow flex flex-col min-h-0" id="page01-div-12">
              <div className={`flex-grow flex flex-col items-center ${view === 'home' ? 'justify-center p-6' : 'p-0'} w-full min-h-0`}>
                {view === 'home' ? (
                  <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 shrink-0" id="page01-div-13">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <h1 className="text-[57px] leading-[64px] -tracking-[0.5px] font-google-sans font-medium text-center max-w-3xl" id="page01-h1-1">
                        <span className="bg-[linear-gradient(63deg,#4285F4_16.87%,#9B72CB_52.91%,#D96570_83.39%)] bg-clip-text text-transparent">
                          How can I help, {userName}?
                        </span>
                      </h1>
                    </motion.div>

                    <PromptInput onSend={handleSendMessage} id="page01-prompt-input-1" />

                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl" id="suggestion-chips-container">
                      {[
                        { label: 'Team Development', icon: 'groups' },
                        { label: 'Strategic Roadmap', icon: 'map' },
                        { label: 'Performance Review', icon: 'analytics' },
                        { label: 'Career Growth', icon: 'trending_up' }
                      ].map((chip) => (
                        <Chip
                          key={chip.label}
                          label={chip.label}
                          leadingIcon={<Icon className="material-symbols-outlined">{chip.icon}</Icon>}
                          onClick={() => handleSendMessage(chip.label)}
                          className="!bg-white !border-outline-variant hover:!bg-[#F1F3F4] transition-colors cursor-pointer"
                        />
                      ))}
                    </div>

                    <div className="w-full h-1" />
                  </div>
                ) : view === 'chat' ? (
                  <div className="w-full h-full flex flex-col min-h-0" id="chat-view-main-container">
                    <ChatView
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      onClearChat={handleClearChat}
                      isAgentTyping={isAgentTyping}
                      agentState={agentState}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant p-12">
                    <Icon className="text-6xl mb-4 opacity-20 material-symbols-outlined">grid_view</Icon>
                    <h2 className="text-2xl font-google-sans font-medium">Project Canvas</h2>
                    <p className="text-sm font-google-sans-text opacity-60 mt-2">Select a project or start a conversation to begin building.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Snackbar
        open={showSnackbar}
        message="Prompt copied"
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
};

export default Page01;
