import React, { useState } from "react";
import { 
  Database, 
  Brain, 
  Check, 
  X, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Cpu 
} from "lucide-react";

interface DatasetDetectiveProps {
  detectiveCompleted: boolean;
  workflowCompleted: boolean;
  onCompleteDetective: () => void;
  onCompleteWorkflow: (essay: string) => void;
  onNavigate: (tab: string) => void;
}

interface DatasetCard {
  id: string;
  desc: string;
  correctCategory: "Supervised" | "Unsupervised" | "Reinforcement";
  details: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  desc: string;
  idealOrder: number;
}

export default function DatasetDetective({
  detectiveCompleted,
  workflowCompleted,
  onCompleteDetective,
  onCompleteWorkflow,
  onNavigate
}: DatasetDetectiveProps) {

  // Card Classification State
  const datasetCards: DatasetCard[] = [
    {
      id: "flower",
      desc: "Flower images with species names explicitly marked",
      correctCategory: "Supervised",
      details: "High-resolution botanical photographs where each image is associated with a specific taxonomic species string."
    },
    {
      id: "shopper",
      desc: "Shopping transaction logs without any category headers",
      correctCategory: "Unsupervised",
      details: "A raw feed of shopping baskets containing timestamps, items, and quantities with zero tags or human notes."
    },
    {
      id: "walk_reward",
      desc: "Robot receiving positive rewards upon reaching the target coordinate",
      correctCategory: "Reinforcement",
      details: "An active agent running joint trials on a physical simulation canvas, calibrated to maximize sensor targets."
    },
    {
      id: "spam_labels",
      desc: "Historical email database categorized as Spam / Not Spam",
      correctCategory: "Supervised",
      details: "An archive of half a million corporate emails, hand-filtered and labeled by network security officers."
    },
    {
      id: "music_raw",
      desc: "Dense music listening logs with no categorization tags",
      correctCategory: "Unsupervised",
      details: "A streaming log representing user playbacks with song IDs, session times, and skip triggers, devoid of annotations."
    },
    {
      id: "drone_avoid",
      desc: "Logistics drone learning obstacle avoidance through collision trials",
      correctCategory: "Reinforcement",
      details: "A drone firmware simulation learning to maneuver around columns, receiving a penalties for proximity alerts."
    }
  ];

  const [classifiedCards, setClassifiedCards] = useState<Record<string, "Supervised" | "Unsupervised" | "Reinforcement" | null>>({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [errorCount, setErrorCount] = useState<Record<string, boolean>>({});

  // Workflow Sorter State
  const initialSteps: WorkflowStep[] = [
    { id: "prep", name: "Prepare Data", desc: "Clean up errors, handle outliers, and normalize attributes.", idealOrder: 2 },
    { id: "collect", name: "Collect Data", desc: "Gather relevant clinical records, transaction feeds, or logs.", idealOrder: 1 },
    { id: "test", name: "Test Model", desc: "Evaluate model parameters against validation datasets.", idealOrder: 4 },
    { id: "train", name: "Train Model", desc: "Let the model explore formulas and identify mathematical trends.", idealOrder: 3 },
    { id: "deploy", name: "Deploy AI", desc: "Expose model endpoints to production clients and users.", idealOrder: 6 },
    { id: "improve", name: "Improve Model", desc: "Refine training weights using active real-world telemetry.", idealOrder: 5 }
  ];

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(initialSteps);
  const [workflowEssay, setWorkflowEssay] = useState("");
  const [workflowError, setWorkflowError] = useState("");

  const handleClassify = (cardId: string, category: "Supervised" | "Unsupervised" | "Reinforcement") => {
    const card = datasetCards.find(c => c.id === cardId)!;
    const isCorrect = card.correctCategory === category;

    if (isCorrect) {
      setClassifiedCards(prev => {
        const next = { ...prev, [cardId]: category };
        // Check if all are complete
        const completedCount = Object.values(next).filter(Boolean).length;
        if (completedCount === datasetCards.length) {
          onCompleteDetective();
        }
        return next;
      });
      setErrorCount(prev => ({ ...prev, [cardId]: false }));
      // Go to next card automatically if possible
      if (activeCardIndex < datasetCards.length - 1) {
        setTimeout(() => {
          setActiveCardIndex(prev => prev + 1);
        }, 300);
      }
    } else {
      setErrorCount(prev => ({ ...prev, [cardId]: true }));
      // clear error after a short bounce
      setTimeout(() => {
        setErrorCount(prev => ({ ...prev, [cardId]: false }));
      }, 1000);
    }
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...workflowSteps];
    if (direction === "up" && index > 0) {
      const temp = newSteps[index];
      newSteps[index] = newSteps[index - 1];
      newSteps[index - 1] = temp;
    } else if (direction === "down" && index < newSteps.length - 1) {
      const temp = newSteps[index];
      newSteps[index] = newSteps[index + 1];
      newSteps[index + 1] = temp;
    }
    setWorkflowSteps(newSteps);
  };

  const checkWorkflowOrder = () => {
    const isCorrect = workflowSteps.every((step, idx) => step.idealOrder === idx + 1);
    if (!isCorrect) {
      setWorkflowError("The pipeline is jammed! Check step descriptions to align the sequence from initial collection to final deployment.");
      return false;
    }
    setWorkflowError("");
    return true;
  };

  const handleSubmitWorkflow = () => {
    const orderCorrect = checkWorkflowOrder();
    if (!orderCorrect) return;

    if (!workflowEssay.trim() || workflowEssay.trim().length < 15) {
      setWorkflowError("Please write a brief reflection answer (minimum 15 characters) to validate this laboratory report.");
      return;
    }

    onCompleteWorkflow(workflowEssay);
  };

  const allClassified = Object.values(classifiedCards).filter(Boolean).length === datasetCards.length;
  const isWorkflowSorted = workflowSteps.every((step, idx) => step.idealOrder === idx + 1);

  return (
    <div className="space-y-10" id="dataset-detective-container">
      {/* Activity A: Dataset Classification */}
      <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="classification-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <Database size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">Activity 3A: Confidential Dataset Matching</h2>
            <p className="text-xs text-slate-400 font-mono">CLASSIFY RAW ARCHIVES INTO PARADIGM DRAWERS</p>
          </div>
        </div>

        <p className="text-sm text-slate-300">
          The lab has received six confidential diagnostic data packets. Inspect their schemas and map them to the corresponding Machine Learning strategy:
        </p>

        {/* Classifier Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Left Columns: Card Deck Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex gap-2 justify-center">
              {datasetCards.map((card, idx) => {
                const status = classifiedCards[card.id];
                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === activeCardIndex 
                        ? 'w-8 bg-cyan-400' 
                        : status 
                          ? 'w-2 bg-emerald-400' 
                          : 'w-2 bg-white/10'
                    }`}
                    title={`Card ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Selected Card display */}
            <div className={`p-6 rounded-2xl bg-white/5 border transition-all duration-300 ${
              errorCount[datasetCards[activeCardIndex].id] 
                ? 'border-red-500 animate-shake' 
                : classifiedCards[datasetCards[activeCardIndex].id]
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-white/10'
            }`} id="detective-active-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">PACKET 0{activeCardIndex + 1}</span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug font-display">
                    {datasetCards[activeCardIndex].desc}
                  </h3>
                </div>
                {classifiedCards[datasetCards[activeCardIndex].id] && (
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono uppercase">
                    MATCHED
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                {datasetCards[activeCardIndex].details}
              </p>

              {/* Categorization controls */}
              {!classifiedCards[datasetCards[activeCardIndex].id] ? (
                <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10">
                  {(["Supervised", "Unsupervised", "Reinforcement"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleClassify(datasetCards[activeCardIndex].id, cat)}
                      className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all text-center cursor-pointer"
                      id={`classify-btn-${cat.toLowerCase()}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-medium mt-6 flex items-center gap-1.5 animate-fade-in">
                  <Check size={14} /> Recommended learning methodology: <strong className="font-bold uppercase font-mono">{classifiedCards[datasetCards[activeCardIndex].id]}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Right Columns: Target drawers showing categorizations */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Laboratory Shelves</h3>
            
            {(["Supervised", "Unsupervised", "Reinforcement"] as const).map((cat) => {
              const matchedItems = datasetCards.filter(c => classifiedCards[c.id] === cat);
              let labelColor = "text-cyan-300 bg-cyan-500/10 border-cyan-500/20";
              if (cat === "Unsupervised") labelColor = "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
              if (cat === "Reinforcement") labelColor = "text-rose-300 bg-rose-500/10 border-rose-500/20";

              return (
                <div key={cat} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border ${labelColor}`}>
                      {cat} Learning Drawers
                    </span>
                    <span className="text-xs font-mono text-slate-400">{matchedItems.length} Matched</span>
                  </div>
                  
                  <div className="space-y-1.5 min-h-[48px] flex flex-col justify-center">
                    {matchedItems.length > 0 ? (
                      matchedItems.map(item => (
                        <div key={item.id} className="text-xs text-slate-300 flex items-center gap-1.5 py-1.5 px-2.5 bg-white/5 border border-white/5 rounded-lg">
                          <Check size={12} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{item.desc}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic text-center">Shelf empty. Map relevant packets here.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity B: Workflow Sorter */}
      {allClassified && (
        <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="workflow-panel">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Cpu size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-display">Activity 3B: AI Workflow Calibration</h2>
              <p className="text-xs text-slate-400 font-mono">ARRANGE THE COGNITIVE DEVELOPMENT PIPELINE</p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Arrange the machine learning pipeline steps in chronological order. Correct alignment triggers a live visual simulation. Use the control arrows to shift steps up or down.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Left 7 Columns: Sorting List */}
            <div className="lg:col-span-7 space-y-3">
              {workflowSteps.map((step, idx) => {
                const isIdeal = step.idealOrder === idx + 1;
                
                return (
                  <div 
                    key={step.id} 
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      isWorkflowSorted 
                        ? 'border-emerald-500/40 bg-emerald-500/5' 
                        : 'border-white/10 bg-white/5'
                    }`}
                    id={`workflow-step-${step.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm font-mono border ${
                        isWorkflowSorted 
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/20' 
                          : 'border-white/10 text-slate-300 bg-white/5'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white font-display">{step.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveStep(idx, "up")}
                        disabled={idx === 0 || workflowCompleted}
                        className="p-1 text-slate-300 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                        title="Move Up"
                        id={`step-${step.id}-up`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveStep(idx, "down")}
                        disabled={idx === workflowSteps.length - 1 || workflowCompleted}
                        className="p-1 text-slate-300 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                        title="Move Down"
                        id={`step-${step.id}-down`}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 5 Columns: Dynamic SVG visualization & Submit Reflection */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">AI PIPELINE VISUALIZATION</span>
                
                {/* Visual flowchart */}
                <div className="flex flex-col items-center py-4 space-y-3 relative" id="pipeline-glowing-stream">
                  {/* Vertical connector line */}
                  <div className={`absolute top-6 bottom-6 w-1 transition-colors duration-1000 ${isWorkflowSorted ? 'bg-emerald-500 shadow-md shadow-emerald-500/20 animate-pulse' : 'bg-white/10'}`} />

                  {workflowSteps.map((s, idx) => {
                    const active = isWorkflowSorted;
                    return (
                      <div 
                        key={s.id} 
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border font-mono z-10 transition-all duration-500 ${
                          active 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm' 
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}
                      >
                        {s.name.toUpperCase()}
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-400 text-center italic">
                  {isWorkflowSorted 
                    ? "✨ Pipeline calibrated! Glowing signal stream establishes standard cognitive data flow." 
                    : "⚠️ Sort the pipeline chronologically to release the locked telemetry signal stream."
                  }
                </p>
              </div>

              {/* Reflection question submission */}
              {isWorkflowSorted && (
                <div className="space-y-4 pt-4 border-t border-white/10 animate-fade-in" id="detective-reflection-box">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Reflection Probe</label>
                    <h4 className="text-xs font-bold text-white mt-1">Why should AI continue improving after deployment?</h4>
                  </div>

                  <textarea
                    rows={3}
                    value={workflowEssay}
                    onChange={(e) => setWorkflowEssay(e.target.value)}
                    disabled={workflowCompleted}
                    placeholder="Type your scientific evaluation here (e.g., shifts in real-world data distributions, feedback loops)..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 disabled:opacity-75 disabled:cursor-not-allowed"
                    id="workflow-essay-textarea"
                  />

                  {workflowError && (
                    <p className="text-xs text-red-400 font-mono">{workflowError}</p>
                  )}

                  {!workflowCompleted ? (
                    <button
                      onClick={handleSubmitWorkflow}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      id="submit-detective-report"
                    >
                      Verify Pipeline Calibration
                      <Play size={12} className="fill-current" />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-lg flex items-center gap-1.5">
                        <Check size={14} /> Reflection saved. Calibrations fully verified!
                      </div>
                      <button
                        onClick={() => onNavigate("journey")}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-bold border border-white/10 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        id="proceed-to-journey-btn"
                      >
                        Launch Learning Journey
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
