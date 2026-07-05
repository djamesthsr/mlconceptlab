import React, { useState } from "react";
import { 
  Building, 
  CheckCircle, 
  HelpCircle, 
  Activity, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Star, 
  Compass, 
  Loader2 
} from "lucide-react";
import { InvestigationResult } from "../types";

interface MLInvestigationProps {
  investigationResults: Record<string, InvestigationResult>;
  isCompleted: boolean;
  onSaveResult: (orgId: string, result: InvestigationResult) => void;
  onCompleteInvestigation: () => void;
  onNavigate: (tab: string) => void;
}

interface CaseStudy {
  id: string;
  org: string;
  problem: string;
  choices: string[];
  correctAnswer: string;
  hints: string;
  details: string;
}

export default function MLInvestigation({
  investigationResults,
  isCompleted,
  onSaveResult,
  onCompleteInvestigation,
  onNavigate
}: MLInvestigationProps) {

  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>("");

  const cases: CaseStudy[] = [
    {
      id: "hospital",
      org: "City General Hospital",
      problem: "Predict disease susceptibility from historical clinical records and diagnosed patient outcomes.",
      choices: ["Supervised", "Unsupervised", "Reinforcement"],
      correctAnswer: "Supervised",
      hints: "The hospital already possesses historical clinical records which are labeled with diagnosed outcomes (e.g., 'Sick' or 'Healthy').",
      details: "A machine learning pipeline is required to digest patient biomarkers (heart rate, blood panels, genomic variants) and flag high-risk individuals based on previously recorded cases."
    },
    {
      id: "retail",
      org: "Starlight Retail Group",
      problem: "Group anonymous retail customers into segments based on matching buying habits and frequencies.",
      choices: ["Supervised", "Unsupervised", "Reinforcement"],
      correctAnswer: "Unsupervised",
      hints: "There are no pre-existing categories or labels. We simply want to cluster shoppers who buy similar items.",
      details: "The business wishes to optimize their email promotions. They want to naturally cluster their dense transactions database to reveal latent shopping personalities."
    },
    {
      id: "gaming",
      org: "Aero Studios Gaming",
      problem: "Train an intelligent non-player character (NPC) to master gameplay strategies and play on par with humans.",
      choices: ["Supervised", "Unsupervised", "Reinforcement"],
      correctAnswer: "Reinforcement",
      hints: "The system should learn dynamically by testing actions on the virtual engine, receiving rewards for staying alive.",
      details: "The developer wants to train an autonomous fighter jet in a flight simulator. The agent must optimize flight coordinates and tactical behaviors on its own."
    },
    {
      id: "bank",
      org: "Meridian Trust Bank",
      problem: "Identify fraudulent credit card transactions among millions of daily online purchase records.",
      choices: ["Supervised", "Unsupervised"],
      correctAnswer: "Supervised",
      hints: "The dataset includes history records marked explicitly as 'Legitimate' or 'Fraudulent'.",
      details: "Financial fraud requires rapid classification. The bank has historical records of billions of swipes, with chargebacks already tagged as fraud."
    },
    {
      id: "warehouse",
      org: "Nexus Autonomous Warehouses",
      problem: "Instruct a logistics delivery drone to learn the shortest, safest route through a changing layout.",
      choices: ["Supervised", "Reinforcement"],
      correctAnswer: "Reinforcement",
      hints: "The drone receives continuous positive rewards for arriving at coordinates quickly and penalties for collisions.",
      details: "The layout of shelves and forklifts shifts in real-time. The system must learn dynamic obstacle avoidance through continuous trial-and-error simulation loops."
    }
  ];

  const activeCase = cases[activeCaseIndex];
  const activeResult = investigationResults[activeCase.id];

  const handleSelectChoice = async (choice: string) => {
    if (activeResult) return; // Case already answered
    setSelectedChoice(choice);
    setEvaluating(true);

    const isCorrect = choice === activeCase.correctAnswer;
    let mentorFeedback = "";

    try {
      const response = await fetch("/api/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "investigation",
          data: {
            org: activeCase.org,
            problem: activeCase.problem,
            choice,
            correctAnswer: activeCase.correctAnswer
          }
        }),
      });
      const data = await response.json();
      mentorFeedback = data.feedback;
    } catch (e) {
      console.error(e);
      // Fallback feedback if Gemini server is unresponsive
      mentorFeedback = isCorrect 
        ? `Excellent job! The ${activeCase.org} problem features historical records with known results. This aligns precisely with Supervised/Reinforcement paradigms.`
        : `Unsupervised Learning discovers cluster patterns but cannot map input targets. This requires alternative structural alignment. Let's adjust parameters.`;
    }

    const result: InvestigationResult = {
      choice,
      isCorrect,
      feedback: mentorFeedback
    };

    onSaveResult(activeCase.id, result);
    setCurrentFeedback(mentorFeedback);
    setEvaluating(false);

    // If this completes the 5th scenario
    const totalAnswered = Object.keys({ ...investigationResults, [activeCase.id]: result }).length;
    if (totalAnswered >= cases.length) {
      onCompleteInvestigation();
    }
  };

  const handleNextCase = () => {
    setSelectedChoice(null);
    setCurrentFeedback("");
    setActiveCaseIndex((prev) => Math.min(cases.length - 1, prev + 1));
  };

  // Stats calculation
  const totalSolvedCount = Object.keys(investigationResults).length;
  const correctCount = Object.values(investigationResults).filter(r => r.isCorrect).length;
  const accuracy = totalSolvedCount > 0 ? Math.round((correctCount / cases.length) * 100) : 0;

  return (
    <div className="space-y-8" id="ml-investigation-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">ML Consultant Office</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            You are advising five pioneering organizations. Inspect their case files, evaluate the data types, and recommend the correct learning model.
          </p>
        </div>
        
        {/* Active consulting dashboard */}
        <div className="glass-light border border-white/10 p-4 rounded-2xl flex items-center gap-6" id="consultant-scorecard">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Diagnosed</div>
            <div className="text-xl font-extrabold text-white">{totalSolvedCount} / {cases.length}</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Accuracy</div>
            <div className="text-xl font-extrabold text-cyan-400">{accuracy}%</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Rating</div>
            <div className="flex gap-0.5 text-amber-500 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={12} 
                  fill={star <= Math.ceil((correctCount / cases.length) * 5) ? "currentColor" : "none"} 
                  className={star <= Math.ceil((correctCount / cases.length) * 5) ? "text-amber-500" : "text-white/10"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Organization Directory Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Case Files</h3>
          <div className="space-y-2">
            {cases.map((c, idx) => {
              const res = investigationResults[c.id];
              const isActive = idx === activeCaseIndex;

              let borderClass = "border-white/10 bg-white/5";
              if (isActive) borderClass = "border-cyan-400 bg-cyan-500/10";
              else if (res) borderClass = res.isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5";

              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveCaseIndex(idx); setSelectedChoice(null); }}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all hover:border-white/20 cursor-pointer ${borderClass}`}
                  id={`case-sidebar-item-${c.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 text-slate-300 ${isActive ? 'text-cyan-400' : ''}`}>
                      <Building size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-display">{c.org}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">CASE {idx + 1} // Susceptibility</p>
                    </div>
                  </div>
                  {res && (
                    res.isCorrect 
                    ? <span className="text-emerald-400 text-xs font-bold font-mono">APPROVED</span>
                    : <span className="text-red-400 text-xs font-bold font-mono">DEFICIT</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Case Analysis */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6 relative" id="active-case-analyzer">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">ACTIVE FILE // {activeCase.org}</span>
              <h2 className="text-2xl font-black text-white tracking-tight font-display">{activeCase.org} Directive</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Structural Objective</h3>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                {activeCase.problem}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Dataset Details</h3>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                {activeCase.details}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400 font-mono">SCIENTIFIC CLUE:</strong> {activeCase.hints}
            </div>
          </div>

          {/* Model selection interface */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Recommend Training Methodology</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeCase.choices.map((choice) => {
                const res = investigationResults[activeCase.id];
                const isSelected = res ? res.choice === choice : selectedChoice === choice;
                const isCorrect = choice === activeCase.correctAnswer;
                
                let btnClass = "border-white/10 hover:border-white/20 bg-white/5 text-slate-200 cursor-pointer";
                if (res) {
                  if (res.choice === choice) {
                    btnClass = res.isCorrect 
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold"
                      : "border-red-500 bg-red-500/20 text-red-400 font-bold";
                  } else if (choice === activeCase.correctAnswer) {
                    btnClass = "border-emerald-500/30 bg-white/5 text-emerald-400 font-medium";
                  } else {
                    btnClass = "border-transparent bg-white/5 text-slate-600 opacity-40 cursor-default";
                  }
                } else if (isSelected) {
                  btnClass = "border-cyan-400 bg-cyan-500/10 text-white font-bold";
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleSelectChoice(choice)}
                    disabled={!!res || evaluating}
                    className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${btnClass}`}
                    id={`case-${activeCase.id}-choice-${choice}`}
                  >
                    {choice} Learning
                  </button>
                );
              })}
            </div>

            {/* AI evaluating loader */}
            {evaluating && (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-slate-300 text-sm font-medium animate-pulse" id="mentor-evaluating-loader">
                <Loader2 className="animate-spin text-cyan-400" size={18} />
                <span>AI Mentor reviewing analytical credentials...</span>
              </div>
            )}

            {/* AI Mentor feedback display */}
            {(activeResult || currentFeedback) && !evaluating && (
              <div className={`p-5 rounded-2xl border space-y-3 ${
                (activeResult?.isCorrect || selectedChoice === activeCase.correctAnswer) 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-red-500/10 border-red-500/20'
              }`} id="mentor-feedback-box">
                <div className="flex items-center gap-2">
                  <Sparkles className={(activeResult?.isCorrect || selectedChoice === activeCase.correctAnswer) ? "text-emerald-400" : "text-red-400"} size={16} />
                  <span className="text-xs font-extrabold uppercase font-mono tracking-wider">AI Research Mentor Evaluation</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeResult ? activeResult.feedback : currentFeedback}
                </p>
              </div>
            )}
          </div>

          {/* Forward controls */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-xs text-slate-500 font-mono uppercase">AI SCIENTIST PORTAL</span>
            
            {activeResult && activeCaseIndex < cases.length - 1 && (
              <button
                onClick={handleNextCase}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                id="next-case-btn"
              >
                Inspect Next Case Study
                <ArrowRight size={14} />
              </button>
            )}

            {isCompleted && activeCaseIndex === cases.length - 1 && (
              <button
                onClick={() => onNavigate("detective")}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer shadow-cyan-500/20"
                id="investigation-finish-btn"
              >
                Launch Dataset Detective Lab
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
