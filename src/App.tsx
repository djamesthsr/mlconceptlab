import React, { useState, useEffect } from "react";
import { MissionState, InvestigationResult } from "./types";
import Dashboard from "./components/Dashboard";
import MissionBrief from "./components/MissionBrief";
import LearningLab from "./components/LearningLab";
import MLInvestigation from "./components/MLInvestigation";
import DatasetDetective from "./components/DatasetDetective";
import MachineLearningJourney from "./components/MachineLearningJourney";
import MissionReport from "./components/MissionReport";
import { 
  Brain, 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Database, 
  TrendingUp, 
  Award, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";

const LOCAL_STORAGE_KEY = "ml_concepts_lab_progress_v1";

const defaultState: MissionState = {
  userName: "D. James",
  xp: 0,
  badgeUnlocked: false,
  currentTab: "dashboard",
  progress: {
    missionBrief: false,
    learningLab: false,
    knowledgeCheck: false,
    knowledgeCheckScore: 0,
    mlInvestigation: false,
    datasetDetective: false,
    workflowChallenge: false,
    journeyTimeline: false,
    reflectionSubmitted: false
  },
  answers: {
    labQuestions: {},
    knowledgeCheck: {},
    datasetDetective: {},
    workflowOrder: [],
    journeyQuiz: {}
  },
  reflections: {
    interest: "",
    dailyLife: "",
    goodData: "",
    workflowWhy: ""
  },
  investigationResults: {}
};

export default function App() {
  const [state, setState] = useState<MissionState>(defaultState);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Ensure robust structure
        setState({
          ...defaultState,
          ...parsed,
          progress: { ...defaultState.progress, ...(parsed.progress || {}) },
          answers: { ...defaultState.answers, ...(parsed.answers || {}) },
          reflections: { ...defaultState.reflections, ...(parsed.reflections || {}) },
          investigationResults: parsed.investigationResults || {}
        });
      } catch (e) {
        console.error("Failed to parse progress cache", e);
      }
    }
  }, []);

  // Save progress on state change
  const saveState = (updated: MissionState) => {
    setState(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleUpdateName = (newName: string) => {
    const updated = { ...state, userName: newName };
    saveState(updated);
  };

  const handleNavigate = (tab: string) => {
    const updated = { ...state, currentTab: tab };
    saveState(updated);
    setSidebarOpen(false);
  };

  // Gamification: State-triggering XP logs
  const handleCompleteBrief = () => {
    if (state.progress.missionBrief) return;
    const nextProgress = { ...state.progress, missionBrief: true };
    const nextXP = state.xp + 10; // +10 XP
    const updated = { ...state, progress: nextProgress, xp: nextXP };
    saveState(updated);
  };

  const handleCompleteLab = () => {
    if (state.progress.learningLab) return;
    const nextProgress = { ...state.progress, learningLab: true };
    const nextXP = state.xp + 10; // +10 XP
    const updated = { ...state, progress: nextProgress, xp: nextXP };
    saveState(updated);
  };

  const handleCompleteKnowledgeCheck = (score: number) => {
    const alreadyDone = state.progress.knowledgeCheck;
    const isPerfect = score === 100;
    
    let xpGain = 0;
    if (!alreadyDone) {
      xpGain += 10; // Base complete
    }
    if (isPerfect && state.progress.knowledgeCheckScore < 100) {
      xpGain += 20; // Perfect bonus
    }

    const nextProgress = { 
      ...state.progress, 
      knowledgeCheck: true, 
      knowledgeCheckScore: Math.max(state.progress.knowledgeCheckScore, score) 
    };
    
    const updated = { 
      ...state, 
      progress: nextProgress, 
      xp: state.xp + xpGain 
    };
    saveState(updated);
  };

  const handleSaveInvestigationResult = (orgId: string, result: InvestigationResult) => {
    const nextInvs = { ...state.investigationResults, [orgId]: result };
    const updated = { ...state, investigationResults: nextInvs };
    saveState(updated);
  };

  const handleCompleteInvestigation = () => {
    if (state.progress.mlInvestigation) return;
    
    // Check if perfect score of 5
    const correctCount = Object.keys(state.investigationResults).filter(key => state.investigationResults[key]?.isCorrect).length;
    let bonusXP = 0;
    if (correctCount === 5) {
      bonusXP = 20; // Perfect consultation award
    }

    const nextProgress = { ...state.progress, mlInvestigation: true };
    const nextXP = state.xp + 20 + bonusXP; // +20 XP base + potential 20 XP bonus

    const updated = { ...state, progress: nextProgress, xp: nextXP };
    saveState(updated);
  };

  const handleCompleteDetective = () => {
    if (state.progress.datasetDetective) return;
    const nextProgress = { ...state.progress, datasetDetective: true };
    const nextXP = state.xp + 15; // +15 XP

    const updated = { ...state, progress: nextProgress, xp: nextXP };
    saveState(updated);
  };

  const handleCompleteWorkflow = (essay: string) => {
    if (state.progress.workflowChallenge) return;
    const nextProgress = { ...state.progress, workflowChallenge: true };
    const nextReflections = { ...state.reflections, workflowWhy: essay };
    const nextXP = state.xp + 15; // +15 XP

    const updated = { 
      ...state, 
      progress: nextProgress, 
      reflections: nextReflections, 
      xp: nextXP 
    };
    saveState(updated);
  };

  const handleViewTimeline = () => {
    if (state.progress.journeyTimeline) return;
    const nextProgress = { ...state.progress, journeyTimeline: true };
    const nextXP = state.xp + 10; // +10 XP

    const updated = { ...state, progress: nextProgress, xp: nextXP };
    saveState(updated);
  };

  const handleCompleteReflection = (essays: { interest: string; dailyLife: string; goodData: string }) => {
    if (state.progress.reflectionSubmitted) return;
    const nextProgress = { ...state.progress, reflectionSubmitted: true };
    const nextReflections = { 
      ...state.reflections, 
      interest: essays.interest,
      dailyLife: essays.dailyLife,
      goodData: essays.goodData
    };
    const nextXP = state.xp + 20; // +20 XP final portfolio

    const updated = { 
      ...state, 
      progress: nextProgress, 
      reflections: nextReflections, 
      xp: nextXP 
    };
    saveState(updated);
  };

  const handleUnlockBadge = () => {
    if (state.badgeUnlocked) return;
    const updated = { ...state, badgeUnlocked: true };
    saveState(updated);
  };

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to recalibrate? This will erase all XP and metrics.")) {
      saveState(defaultState);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Nav side links
  const navLinks = [
    { id: "dashboard", name: "Dashboard Hub", icon: LayoutDashboard },
    { id: "brief", name: "Mission Brief", icon: FileText },
    { id: "lab", name: "ML Cognitive Lab", icon: HelpCircle },
    { id: "investigation", name: "ML Consultant", icon: Compass },
    { id: "detective", name: "Dataset Detective", icon: Database },
    { id: "journey", name: "Journey & Essays", icon: TrendingUp },
    { id: "report", name: "Laboratory Report", icon: Award },
  ];

  return (
    <div className="min-h-screen app-root-bg text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Banner Control Rail */}
      <header className="border-b border-white/10 glass px-6 py-4 sticky top-0 z-40 flex items-center justify-between" id="global-header">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded lg:hidden"
            title="Menu"
            id="mobile-menu-trigger"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/20">
              <Brain size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-cyan-400 tracking-widest uppercase">COGNITIVE INTERFACE</span>
              <h1 className="text-sm font-bold text-white tracking-tight uppercase font-display">ML Concepts Hub</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-300">
            <span>{state.xp} XP</span>
          </div>

          <div className="text-xs text-slate-300 font-mono hidden md:block border-l border-white/10 pl-4">
            USER: <span className="text-cyan-400 font-bold">{state.userName}</span>
          </div>

          <button
            onClick={handleResetProgress}
            className="text-[10px] text-slate-400 hover:text-red-400 font-mono transition-colors uppercase border border-white/10 px-2 py-1 rounded hover:border-red-500/30 bg-white/5"
            id="reset-progress-btn"
          >
            Recalibrate Hub
          </button>
        </div>
      </header>

      {/* Main Structural split */}
      <div className="flex-1 flex relative">
        
        {/* Navigation Sidebar Drawer */}
        <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-slate-950/40 border-r border-white/10 p-5 flex flex-col justify-between h-[calc(100vh-69px)] lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px]`} id="navigation-sidebar">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">LAB DIRECTORY</span>
              <p className="text-xs text-slate-300">Section 04: ML Scientist</p>
            </div>

            <nav className="space-y-1.5" id="sidebar-nav-links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = state.currentTab === link.id;

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 font-bold' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    id={`nav-link-${link.id}`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    {link.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYSTEM: SECURE</span>
            </div>
            <div>STREAK: ACTIVE</div>
            <div>VER: 4.1.0-LAB</div>
          </div>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full" id="viewport-stage">
          {state.currentTab === "dashboard" && (
            <Dashboard 
              state={state} 
              onNavigate={handleNavigate}
              onUpdateName={handleUpdateName}
            />
          )}

          {state.currentTab === "brief" && (
            <MissionBrief 
              userName={state.userName}
              isCompleted={state.progress.missionBrief}
              onComplete={handleCompleteBrief}
              onNavigate={handleNavigate}
            />
          )}

          {state.currentTab === "lab" && (
            <LearningLab 
              labCompleted={state.progress.learningLab}
              knowledgeCheckCompleted={state.progress.knowledgeCheck}
              knowledgeCheckScore={state.progress.knowledgeCheckScore}
              onCompleteLab={handleCompleteLab}
              onCompleteKnowledgeCheck={handleCompleteKnowledgeCheck}
              onNavigate={handleNavigate}
            />
          )}

          {state.currentTab === "investigation" && (
            <MLInvestigation 
              investigationResults={state.investigationResults}
              isCompleted={state.progress.mlInvestigation}
              onSaveResult={handleSaveInvestigationResult}
              onCompleteInvestigation={handleCompleteInvestigation}
              onNavigate={handleNavigate}
            />
          )}

          {state.currentTab === "detective" && (
            <DatasetDetective 
              detectiveCompleted={state.progress.datasetDetective}
              workflowCompleted={state.progress.workflowChallenge}
              onCompleteDetective={handleCompleteDetective}
              onCompleteWorkflow={handleCompleteWorkflow}
              onNavigate={handleNavigate}
            />
          )}

          {state.currentTab === "journey" && (
            <MachineLearningJourney 
              timelineViewed={state.progress.journeyTimeline}
              reflectionCompleted={state.progress.reflectionSubmitted}
              onViewTimeline={handleViewTimeline}
              onCompleteReflection={handleCompleteReflection}
              onNavigate={handleNavigate}
            />
          )}

          {state.currentTab === "report" && (
            <MissionReport 
              state={state}
              onNavigate={handleNavigate}
              onUnlockBadge={handleUnlockBadge}
            />
          )}
        </main>
      </div>
    </div>
  );
}
