import React, { useEffect, useState } from "react";
import { 
  Award, 
  CheckCircle, 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  RefreshCw, 
  ArrowRight, 
  Bookmark, 
  HelpCircle, 
  ChevronRight, 
  Flame
} from "lucide-react";
import { MissionState } from "../types";

interface MissionReportProps {
  state: MissionState;
  onNavigate: (tab: string) => void;
  onUnlockBadge: () => void;
}

export default function MissionReport({ state, onNavigate, onUnlockBadge }: MissionReportProps) {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(true);
  const [celebrate, setCelebrate] = useState(false);

  // XP breakdown
  const completionXP = 80;
  const isPerfectKnowledge = state.progress.knowledgeCheckScore === 100;
  const perfectKnowledgeXP = isPerfectKnowledge ? 20 : 0;
  
  const correctInvsCount = Object.keys(state.investigationResults).filter(key => state.investigationResults[key]?.isCorrect).length;
  const isPerfectInvs = correctInvsCount === 5;
  const perfectInvsXP = isPerfectInvs ? 20 : 0;

  const totalXPObtained = completionXP + perfectKnowledgeXP + perfectInvsXP;

  const fetchReport = async () => {
    setLoading(true);
    setReportText("");
    try {
      const response = await fetch("/api/mission-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: state.userName,
          score: state.progress.knowledgeCheckScore,
          answers: state.answers,
          reflection: state.reflections
        }),
      });
      const data = await response.json();
      setReportText(data.report);
      
      // Auto-unlock badge state in parent
      onUnlockBadge();
      
      // Trigger celebrate visual pop
      setCelebrate(true);
    } catch (e) {
      console.error(e);
      setReportText(
        `### LAB EVALUATION REPORT
**Scientist:** ${state.userName}  
**Badge Status:** Certified Machine Learning Scientist (🧠)  

Your performance across all diagnostic modules is highly commendable. You demonstrated clear analytical capacity inside our virtual chambers, categorizing complex datasets and advising organizations on appropriate learning configurations.

**Next Milestone:** Module 5 - The AI Project Cycle. Ensure your feature extraction pipelines are fully optimized before initializing.

Congratulations on securing ${totalXPObtained} XP and unlocking your credentials!`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [state.userName]);

  return (
    <div className="space-y-8" id="mission-report-container">
      {/* Badge Unlocking Celebration Header */}
      <div className={`p-6 md:p-8 rounded-[2rem] border text-center space-y-4 relative overflow-hidden transition-all duration-1000 ${
        celebrate 
          ? 'glass border-amber-500 shadow-2xl shadow-amber-500/10' 
          : 'glass border-white/10 shadow-xl'
      }`} id="badge-celebration-hero">
        
        {celebrate && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-ping h-2 w-2 rounded-full bg-amber-400"></div>
            <div className="absolute top-1/3 right-1/4 animate-ping h-3 w-3 rounded-full bg-yellow-500 delay-300"></div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`h-24 w-24 rounded-full border-4 flex items-center justify-center text-5xl transition-all duration-1000 select-none ${
            celebrate 
              ? 'bg-amber-500/10 border-amber-500 scale-110 shadow-lg shadow-amber-500/20 animate-pulse' 
              : 'bg-white/5 border-white/10'
          }`} id="giant-badge">
            🧠
          </div>
          
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">CREDENTIAL LEVEL: GRANTED</span>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">Machine Learning Scientist</h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Your diagnostic evaluations, dataset calibrations, and essay portfolios have been verified by the AI Directorate. You are officially certified.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: XP Breakdown & Detailed AI Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: XP Scoreboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-[2rem] glass shadow-xl space-y-5" id="xp-scoreboard">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              Scientific XP Scoreboard
            </h3>

            <div className="space-y-4">
              {/* Total large stats */}
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Score</span>
                <div className="text-4xl font-black text-white mt-1">{totalXPObtained} XP</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-1 uppercase">MAXIMUM SECTOR AWARD: 120 XP</div>
              </div>

              {/* Line items */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/10">
                  <span className="text-slate-300">Mission Base Completion</span>
                  <span className="font-bold text-white">+{completionXP} XP</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/10">
                  <span className="text-slate-300 flex items-center gap-1">
                    Knowledge Check Perfect Score
                    {isPerfectKnowledge ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold">OK</span>
                    ) : (
                      <span className="text-[10px] bg-white/5 text-slate-500 px-1.5 py-0.5 rounded-lg font-mono">MISS</span>
                    )}
                  </span>
                  <span className={`font-bold ${isPerfectKnowledge ? 'text-white' : 'text-slate-600'}`}>
                    +{perfectKnowledgeXP} XP
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/10">
                  <span className="text-slate-300 flex items-center gap-1">
                    Perfect Consultant Diagnostics
                    {isPerfectInvs ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold">OK</span>
                    ) : (
                      <span className="text-[10px] bg-white/5 text-slate-500 px-1.5 py-0.5 rounded-lg font-mono">MISS</span>
                    )}
                  </span>
                  <span className={`font-bold ${isPerfectInvs ? 'text-white' : 'text-slate-600'}`}>
                    +{perfectInvsXP} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 5 Progression Announcement */}
          <div className="p-6 rounded-[2rem] glass border border-white/10 space-y-4" id="next-module-roadmap">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Bookmark size={16} />
              Module 5 Roadmap
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your comprehension of ML concepts prepares you for **Module 5: The AI Project Cycle**. In the next module, you will design complete end-to-end solutions by exploring:
            </p>

            <div className="space-y-2">
              {[
                "Problem Scoping (defining machine boundaries)",
                "Data Acquisition (securing data pipelines)",
                "Model Training & Parameter Choice",
                "Outcome Evaluation & Client Reporting"
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <ChevronRight size={12} className="text-cyan-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle size={12} /> MODULE 5 UNLOCKED AUTOMATICALLY
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Director Evaluation Report */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Lab Evaluation Dossier</h3>
            <button 
              onClick={fetchReport}
              disabled={loading}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded transition-colors cursor-pointer"
              title="Regenerate Report"
              id="regenerate-report-btn"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 rounded-[2rem] glass border border-white/10 flex flex-col items-center justify-center space-y-4 min-h-[350px]" id="report-loading">
              <Loader2 className="animate-spin text-cyan-400" size={32} />
              <div className="text-center space-y-1">
                <p className="text-sm font-mono text-slate-300">Synthesizing personalized student assessment...</p>
                <p className="text-xs text-slate-500 font-mono">Digesting cognitive matrix variables & reflections</p>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 rounded-[2rem] glass-light border border-white/10 shadow-xl space-y-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[350px]" id="director-report-card">
              <div className="border-b border-white/10 pb-4 mb-4 space-y-1">
                <div>AI INNOVATION RESEARCH LAB // DIAGNOSTICS DECK</div>
                <div className="text-[10px] text-slate-500">REF: MOD.04.REPORT.GENAI.V2</div>
              </div>
              
              <div className="prose prose-sm prose-invert max-w-none text-slate-300 space-y-4" id="report-text-render">
                {reportText.split("\n\n").map((para, i) => {
                  if (para.startsWith("###") || para.startsWith("**")) {
                    return <h4 key={i} className="text-sm font-bold text-white uppercase tracking-wider mt-4">{para.replace(/###|\*\*/g, "").trim()}</h4>;
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
