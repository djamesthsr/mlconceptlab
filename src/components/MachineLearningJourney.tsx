import React, { useState } from "react";
import { 
  TrendingUp, 
  Map, 
  Check, 
  X, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Compass, 
  MessageSquare,
  Award 
} from "lucide-react";

interface MachineLearningJourneyProps {
  timelineViewed: boolean;
  reflectionCompleted: boolean;
  onViewTimeline: () => void;
  onCompleteReflection: (essays: { interest: string; dailyLife: string; goodData: string }) => void;
  onNavigate: (tab: string) => void;
}

interface TimelineItem {
  stage: string;
  desc: string;
  scientificContext: string;
  keyMetric: string;
}

interface Scenario {
  id: string;
  system: string;
  category: "Supervised" | "Unsupervised" | "RL";
  reason: string;
}

export default function MachineLearningJourney({
  timelineViewed,
  reflectionCompleted,
  onViewTimeline,
  onCompleteReflection,
  onNavigate
}: MachineLearningJourneyProps) {

  // Timeline Data
  const timelineStages: TimelineItem[] = [
    {
      stage: "Collect Data",
      desc: "AI gathers information from digital environments.",
      scientificContext: "Data scientists aggregate raw inputs, sensor recordings, web databases, or image galleries to establish the empirical foundation.",
      keyMetric: "Raw database size & cardinality"
    },
    {
      stage: "Prepare Data",
      desc: "Remove structural errors and organize information.",
      scientificContext: "Noisy data leads to biased models. Engineers sanitize values, replace missing indices, normalize variables, and separate samples into training/validation/test sets.",
      keyMetric: "Signal-to-noise ratio & feature weights"
    },
    {
      stage: "Train Model",
      desc: "The model runs algorithms to learn mathematical patterns.",
      scientificContext: "The algorithm adjusts its internal algebraic weights, finding correlations, borders, or rewards based on the ML paradigm selected.",
      keyMetric: "Loss function convergence rate"
    },
    {
      stage: "Test Model",
      desc: "Evaluate predictions using pristine test sets.",
      scientificContext: "The model attempts predictions on validation sets it has never seen before, allowing researchers to evaluate real-world generalization.",
      keyMetric: "Confusion matrix & accuracy percentage"
    },
    {
      stage: "Improve Model",
      desc: "Refine algorithms using new inputs or parameter shifts.",
      scientificContext: "If validation yields errors, developers adjust hyperparameters (learning rate, layers, discount factors) and run new training episodes.",
      keyMetric: "F1 Score & general generalization rate"
    },
    {
      stage: "Deploy Model",
      desc: "Release the validated model to the real world.",
      scientificContext: "The model is loaded onto Cloud containers as an active microservice, allowing live applications to make inferences in milliseconds.",
      keyMetric: "API response latency & query throughput"
    }
  ];

  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [visitedTimelineSteps, setVisitedTimelineSteps] = useState<Record<number, boolean>>({ 0: true });

  const handleTimelineClick = (index: number) => {
    setActiveTimelineIndex(index);
    const nextVisited = { ...visitedTimelineSteps, [index]: true };
    setVisitedTimelineSteps(nextVisited);

    // If they have visited all 6 timeline steps
    const visitedCount = Object.keys(nextVisited).length;
    if (visitedCount === timelineStages.length && !timelineViewed) {
      onViewTimeline();
    }
  };

  // Scenario Classification Matrix Data
  const scenarios: Scenario[] = [
    {
      id: "netflix",
      system: "Netflix Recommendations",
      category: "Unsupervised",
      reason: "Netflix groups matching users based on similar viewing histories (collaborative filtering clusters) with no pre-written genre boundaries."
    },
    {
      id: "chess",
      system: "Chess Playing AI",
      category: "RL",
      reason: "The AI acts as an active agent, exploring tree moves, getting penalized for checkmate, and earning points for taking major opponent pieces."
    },
    {
      id: "face",
      system: "Face Recognition Locks",
      category: "Supervised",
      reason: "A camera scans biometric landmarks and maps them to a specific locked profile. It leverages labeled training photos to verify."
    },
    {
      id: "spotify",
      system: "Spotify Listener Groups",
      category: "Unsupervised",
      reason: "Spotify groups listeners into matching taste cohorts based on raw playlist overlap, analyzing high-dimensional listening profiles."
    },
    {
      id: "vacuum",
      system: "Robot Vacuum Cleaner",
      category: "RL",
      reason: "The vacuum maps coordinate routes, receiving a positive score for cleaning dust particles and negative scores for bumper bumps."
    },
    {
      id: "disease",
      system: "Disease Diagnosis",
      category: "Supervised",
      reason: "The diagnostic scanner relies on previous clinical trials tagged explicitly as 'Malicious' or 'Benign' to categorize tissue scans."
    }
  ];

  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, "Supervised" | "Unsupervised" | "RL">>({});

  // Essay prompts
  const [essays, setEssays] = useState({
    interest: "",
    dailyLife: "",
    goodData: ""
  });
  const [mentorFeedbacks, setMentorFeedbacks] = useState<Record<string, string>>({});
  const [submittingEssays, setSubmittingEssays] = useState<Record<string, boolean>>({});
  const [essayErrors, setEssayErrors] = useState("");

  const handleScenarioCheck = (scenarioId: string, selection: "Supervised" | "Unsupervised" | "RL") => {
    setScenarioAnswers({ ...scenarioAnswers, [scenarioId]: selection });
  };

  const handleVerifyEssay = async (field: keyof typeof essays, question: string) => {
    const text = essays[field];
    if (!text.trim() || text.trim().length < 15) {
      alert("Please write a detailed answer (at least 15 characters) before submitting to the mentor.");
      return;
    }

    setSubmittingEssays(prev => ({ ...prev, [field]: true }));
    try {
      const response = await fetch("/api/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "reflection",
          data: {
            question,
            response: text
          }
        }),
      });
      const data = await response.json();
      setMentorFeedbacks(prev => ({ ...prev, [field]: data.feedback }));
    } catch (e) {
      console.error(e);
      setMentorFeedbacks(prev => ({
        ...prev,
        [field]: "Excellent scientific insight! Your response reveals a strong conceptual grasp of machine learning dynamics."
      }));
    } finally {
      setSubmittingEssays(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmitAllReflections = () => {
    // Check if scenario matrix is complete
    const matrixComplete = Object.keys(scenarioAnswers).length === scenarios.length;
    if (!matrixComplete) {
      setEssayErrors("Please classify all everyday scenarios in the Matrix first.");
      return;
    }

    // Check if essays are completed
    if (
      !essays.interest.trim() || essays.interest.trim().length < 15 ||
      !essays.dailyLife.trim() || essays.dailyLife.trim().length < 15 ||
      !essays.goodData.trim() || essays.goodData.trim().length < 15
    ) {
      setEssayErrors("Please write a detailed response for all three reflection questions (minimum 15 characters each) before saving your scientific portfolio.");
      return;
    }

    setEssayErrors("");
    onCompleteReflection(essays);
  };

  return (
    <div className="space-y-10" id="ml-journey-container">
      {/* Timeline Section */}
      <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="journey-timeline-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-400/20">
            <Map size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">Activity 4A: Scientific Journey Timeline</h2>
            <p className="text-xs text-slate-400 font-mono">EXPLORE EACH SYSTEM DEVELOPMENT PHASE</p>
          </div>
        </div>

        <p className="text-sm text-slate-300">
          How do models evolve from data gathering to real-world integration? Click on each phase of the timeline below to inspect the engineering procedures:
        </p>

        {/* Timeline Carousel Node Map */}
        <div className="relative pt-4" id="timeline-carousel">
          {/* Horizontal line */}
          <div className="absolute top-[41px] left-8 right-8 h-1 bg-white/10 rounded hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
            {timelineStages.map((item, idx) => {
              const isActive = idx === activeTimelineIndex;
              const wasVisited = !!visitedTimelineSteps[idx];

              return (
                <button
                  key={idx}
                  onClick={() => handleTimelineClick(idx)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-400' 
                      : wasVisited 
                        ? 'border-white/10 bg-white/5 hover:border-white/20' 
                        : 'border-transparent bg-white/5 hover:border-white/10'
                  }`}
                  id={`timeline-node-${idx}`}
                >
                  <div className={`h-12 w-12 rounded-full border flex items-center justify-center font-bold text-sm font-mono mb-2 transition-all ${
                    isActive 
                      ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
                      : wasVisited 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                    0{idx + 1}
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-cyan-400' : wasVisited ? 'text-slate-200' : 'text-slate-500'}`}>
                    {item.stage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Card */}
        <div className="p-5 rounded-2xl glass-light border border-white/10 space-y-3 animate-fade-in" id="timeline-detail-box">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-base font-display">
              Phase 0{activeTimelineIndex + 1}: {timelineStages[activeTimelineIndex].stage}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">KEY PARAMETER: {timelineStages[activeTimelineIndex].keyMetric}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {timelineStages[activeTimelineIndex].desc}
          </p>
          <p className="text-xs text-slate-400 italic bg-white/5 p-3 rounded-lg border border-white/5">
            {timelineStages[activeTimelineIndex].scientificContext}
          </p>
        </div>
      </div>

      {/* Scenario Classification Matrix */}
      {timelineViewed && (
        <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="matrix-panel">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-400/20">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-display">Activity 4B: Everyday Scenario Classification Matrix</h2>
              <p className="text-xs text-slate-400 font-mono">MAP PRACTICAL SYSTEMS TO METHODOLOGIES</p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Identify the learning methodology embedded inside each modern application. Correct classifications reveal instant diagnostic rationale.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm border-collapse" id="scenario-matrix-table">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase text-xs tracking-wider font-mono">
                  <th className="py-3 px-4">AI System Case</th>
                  <th className="py-3 px-4 text-center">Supervised</th>
                  <th className="py-3 px-4 text-center">Unsupervised</th>
                  <th className="py-3 px-4 text-center">Reinforcement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {scenarios.map((sc) => {
                  const selection = scenarioAnswers[sc.id];
                  const hasSelected = !!selection;

                  return (
                    <tr key={sc.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-100 flex flex-col justify-center">
                        <span className="font-display">{sc.system}</span>
                        {hasSelected && (
                          <span className={`text-[10px] font-normal leading-normal mt-1.5 p-2 rounded-xl max-w-lg ${
                            selection === sc.category 
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          }`}>
                            <strong>{selection === sc.category ? 'Correct!' : 'Incorrect!'} Rationale:</strong> {sc.reason}
                          </span>
                        )}
                      </td>

                      {(["Supervised", "Unsupervised", "RL"] as const).map((cat) => {
                        const checked = selection === cat;
                        const isCorrect = cat === sc.category;

                        let checkClass = "border-white/10 bg-white/5 hover:border-white/20 cursor-pointer text-slate-300";
                        if (checked) {
                          checkClass = isCorrect 
                            ? "border-emerald-500 text-emerald-300 bg-emerald-500/25" 
                            : "border-rose-500 text-rose-300 bg-rose-500/25";
                        }

                        return (
                          <td key={cat} className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleScenarioCheck(sc.id, cat)}
                              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${checkClass}`}
                              id={`matrix-${sc.id}-toggle-${cat.toLowerCase()}`}
                            >
                              {cat}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reflection Essays */}
      {Object.keys(scenarioAnswers).length === scenarios.length && (
        <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="essays-panel">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-400/20">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-display">Activity 4C: Scientific Portfolio Reflections</h2>
              <p className="text-xs text-slate-400 font-mono">SUBMIT DIALOGUES TO THE EXPERT MENTOR</p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Commit your final reflective insights. Click <strong className="text-cyan-400">Consult Mentor</strong> next to each essay prompt to receive dynamic, AI-generated scientific evaluations!
          </p>

          <div className="space-y-6 pt-2">
            {[
              {
                field: "interest" as const,
                q: "Which Machine Learning type (Supervised, Unsupervised, or Reinforcement) interests you most, and why?",
                placeholder: "I find Reinforcement Learning fascinating because of how agents learn complex behaviors dynamically through continuous rewards..."
              },
              {
                field: "dailyLife" as const,
                q: "Where have you observed Machine Learning concepts in action in your daily life?",
                placeholder: "I observe Supervised Learning daily in my email spam filter and my phone's facial recognition lock, which matches biological tags..."
              },
              {
                field: "goodData" as const,
                q: "Why is high-quality, non-biased training data critical to establishing machine cognition?",
                placeholder: "High-quality data is critical because biased inputs will skew the learned formulas, resulting in inaccurate or discriminatory inferences..."
              }
            ].map((item) => {
              const isSubmitting = !!submittingEssays[item.field];
              const feedback = mentorFeedbacks[item.field];

              return (
                <div key={item.field} className="p-5 rounded-2xl glass-light border border-white/10 space-y-3" id={`essay-box-${item.field}`}>
                  <h4 className="text-sm font-bold text-white leading-normal font-display">{item.q}</h4>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <textarea
                      rows={3}
                      value={essays[item.field]}
                      onChange={(e) => setEssays({ ...essays, [item.field]: e.target.value })}
                      disabled={reflectionCompleted}
                      placeholder={item.placeholder}
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed"
                      id={`textarea-${item.field}`}
                    />

                    {!reflectionCompleted && (
                      <button
                        onClick={() => handleVerifyEssay(item.field, item.q)}
                        disabled={isSubmitting || essays[item.field].trim().length < 15}
                        className="w-full md:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-slate-600 border border-white/10 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
                        id={`mentor-consult-btn-${item.field}`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin text-cyan-400" size={14} />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} className="text-cyan-400" />
                            Consult Mentor
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Mentor assessment response */}
                  {feedback && (
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300 leading-relaxed flex items-start gap-2 animate-fade-in" id={`feedback-display-${item.field}`}>
                      <Sparkles className="text-cyan-400 shrink-0 mt-0.5 animate-pulse" size={14} />
                      <p>
                        <strong>AI Mentor Critique:</strong> {feedback}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error & Submit Portfolio controls */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {essayErrors && (
              <p className="text-xs text-rose-400 font-mono" id="essay-validation-error">{essayErrors}</p>
            )}
            <span className="text-xs text-slate-500 font-mono hidden sm:block">PORTFOLIO CALIBRATION SYSTEM</span>

            {!reflectionCompleted ? (
              <button
                onClick={handleSubmitAllReflections}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-cyan-500/20"
                id="submit-all-reflections-btn"
              >
                Seal and Submit Portfolio
                <Check size={14} />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-end">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-xl flex items-center gap-1.5">
                  <Award size={14} /> Portfolio Sealed. Mission ready for unlock!
                </div>
                <button
                  onClick={() => onNavigate("report")}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer shadow-cyan-500/20"
                  id="go-to-report-btn"
                >
                  Unlock Scientist Badge & Report
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
