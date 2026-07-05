import React, { useState } from "react";
import { 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  HelpCircle, 
  Brain, 
  LayoutGrid, 
  GitFork, 
  Zap, 
  Mail, 
  Users, 
  Flame, 
  Lock
} from "lucide-react";

interface LearningLabProps {
  labCompleted: boolean;
  knowledgeCheckCompleted: boolean;
  knowledgeCheckScore: number;
  onCompleteLab: () => void;
  onCompleteKnowledgeCheck: (score: number) => void;
  onNavigate: (tab: string) => void;
}

export default function LearningLab({ 
  labCompleted, 
  knowledgeCheckCompleted, 
  knowledgeCheckScore, 
  onCompleteLab, 
  onCompleteKnowledgeCheck,
  onNavigate 
}: LearningLabProps) {
  
  const [activeDoor, setActiveDoor] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideAnswers, setSlideAnswers] = useState<Record<number, string>>({});
  const [slideFeedback, setSlideFeedback] = useState<Record<number, string>>({});

  // Knowledge Check quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const slides = [
    {
      title: "How Machines Learn",
      subtitle: "The Three Core Pathways",
      content: "Just as humans learn from teachers, textbooks, or trial and error, computers learn through three distinct scientific frameworks: Supervised Learning, Unsupervised Learning, and Reinforcement Learning. As a Machine Learning Scientist, you must analyze datasets and decide which pathway to use to train the AI.",
      interactiveType: "intro",
    },
    {
      title: "Supervised Learning Lab",
      subtitle: "Learning from Labeled Examples",
      content: "Supervised Learning acts like learning with a teacher. The AI is fed a historical dataset of inputs along with their corresponding correct labels (answers). The AI analyzes these labeled pairs to learn the general formula. Once trained, it can predict labels for new, unseen data.",
      scenario: "Spam Email Filter: The machine is fed thousands of emails, already flagged by engineers as 'Spam' or 'Not Spam'. It analyzes vocabulary patterns, senders, and layout structures to classify subsequent emails.",
      question: "What helps this AI learn spam patterns?",
      options: [
        { key: "labeled", text: "Labeled Emails (e.g. historical database of categorized emails)" },
        { key: "guessing", text: "Random Guessing (e.g. trial-and-error classification)" },
        { key: "speed", text: "High Internet Speed (e.g. rapid network processing)" }
      ],
      correctKey: "labeled",
      correctFeedback: "Correct! Highly accurate historical labels are necessary for Supervised Learning. The AI learns from previous correct answers.",
      incorrectFeedback: "Incorrect. Random guessing is inefficient, and network speed doesn't aid training logic. Supervised Learning strictly relies on labeled datasets."
    },
    {
      title: "Unsupervised Learning Lab",
      subtitle: "Discovering Hidden Structures",
      content: "Unsupervised Learning acts like learning without a teacher. The AI is given raw, uncategorized datasets with no labels or outcomes. The algorithm's job is to inspect the dimensions of the data, find hidden similarities, and cluster them into patterns or groups naturally.",
      scenario: "Customer Segmentation: A retail chain feeds raw purchasing history (frequency, amount, item types) into the AI. The system identifies 4 separate clusters of shoppers with matching habits (e.g. 'deal-seekers', 'bulk-buyers') without any manual human tagging.",
      question: "What is the primary action of Unsupervised AI in this scenario?",
      options: [
        { key: "predict", text: "Predict future pricing trends" },
        { key: "groups", text: "Find natural groups or clusters" },
        { key: "translate", text: "Translate customer product reviews" }
      ],
      correctKey: "groups",
      correctFeedback: "Correct! The primary power of Unsupervised Learning is clustering. It identifies natural segmentations and hidden trends in raw, unlabelled data.",
      incorrectFeedback: "Incorrect. Predicting known parameters is supervised, while translation is a different NLP task. Finding groups is the core of Unsupervised learning."
    },
    {
      title: "Reinforcement Learning Arena",
      subtitle: "Optimizing through Reward & Penalty",
      content: "Reinforcement Learning mimics trial-and-error learning. The AI (called an Agent) interacts with an active environment. It tries different actions, receives a penalty for mistakes, and receives a numerical 'reward' (positive feedback) for success. It learns a policy to maximize cumulative rewards.",
      scenario: "Robot Walking: A virtual bipedal robot is placed on a track. It tries thousands of small joint movements. Falling over results in a penalty (-10 points); moving forward 1 meter yields a reward (+100 points). Over time, the robot teaches itself to sprint.",
      question: "How does the reinforcement AI improve its walking ability?",
      options: [
        { key: "books", text: "Reading structural design books" },
        { key: "trial", text: "Trial and Error (with rewards and penalties)" },
        { key: "memorize", text: "Memorizing previously programmed footsteps" }
      ],
      correctKey: "trial",
      correctFeedback: "Correct! Reinforcement Learning uses trial-and-error feedback loops. The agent optimizes its strategy based on positive rewards and negative penalties.",
      incorrectFeedback: "Incorrect. There are no pre-written books or footsteps in this dynamic environment. Reinforcement relies strictly on environmental trials."
    },
    {
      title: "Comparative Research Matrix",
      subtitle: "Summary of ML Paradigms",
      interactiveType: "compare",
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      q: "Which Machine Learning type requires labeled data to train the model?",
      options: [
        { key: "A", text: "Unsupervised Learning" },
        { key: "B", text: "Supervised Learning" },
        { key: "C", text: "Reinforcement Learning" }
      ],
      correct: "B"
    },
    {
      id: 2,
      q: "Which Machine Learning type is best suited for discovering hidden patterns or grouping customers without human categories?",
      options: [
        { key: "A", text: "Supervised Learning" },
        { key: "B", text: "Reinforcement Learning" },
        { key: "C", text: "Unsupervised Learning" }
      ],
      correct: "C"
    },
    {
      id: 3,
      q: "Which Machine Learning type utilizes a reward and penalty system to train an agent through active environmental interaction?",
      options: [
        { key: "A", text: "Reinforcement Learning" },
        { key: "B", text: "Supervised Learning" },
        { key: "C", text: "Unsupervised Learning" }
      ],
      correct: "A"
    },
    {
      id: 4,
      q: "Can a single advanced AI system combine multiple learning methods (e.g. Supervised and Reinforcement) to solve complex problems?",
      options: [
        { key: "A", text: "True (e.g. Hybrid systems)" },
        { key: "B", text: "False (An AI must only use exactly one type)" }
      ],
      correct: "A"
    }
  ];

  const handleSlideOption = (slideIndex: number, optionKey: string, correctKey: string) => {
    if (slideAnswers[slideIndex]) return; // Answer locked
    
    setSlideAnswers({ ...slideAnswers, [slideIndex]: optionKey });
    const isCorrect = optionKey === correctKey;
    const currentSlideObj = slides[slideIndex];
    const feedback = isCorrect ? currentSlideObj.correctFeedback : currentSlideObj.incorrectFeedback;
    setSlideFeedback({ ...slideFeedback, [slideIndex]: feedback || "" });

    // If we have answered all three questions on slides 1, 2, 3
    const answeredCount = Object.keys({ ...slideAnswers, [slideIndex]: optionKey }).length;
    if (answeredCount >= 3) {
      onCompleteLab(); // Marks Lab Completed (XP registers)
    }
  };

  const handleQuizOption = (qId: number, optionKey: string) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optionKey });
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) {
      alert("Please answer all diagnostic questions first.");
      return;
    }

    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(finalPercent);
    setQuizSubmitted(true);
    onCompleteKnowledgeCheck(finalPercent);
  };

  return (
    <div className="space-y-10" id="learning-lab-container">
      {/* Immersive Virtual Door Selector */}
      {!activeDoor ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">Cognitive Laboratories</h1>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Welcome, Scientist. The AI Innovation Research Lab is split into three core chambers. Explore each door to inspect how machines learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" id="laboratory-doors">
            {/* Supervised Door */}
            <div 
              onClick={() => { setActiveDoor("supervised"); setCurrentSlide(1); }}
              className="group cursor-pointer p-6 rounded-[2rem] glass hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all text-left space-y-4"
              id="supervised-door"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <Mail size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">SECTOR A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display">Supervised Learning</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Input-Output Maps // Labeled sets</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Machines learn mapping formulas from pre-labeled historical examples. Perfect for spam-filters and diagnostics.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyan-400 flex items-center gap-1 font-mono">
                Enter Chamber <ArrowRight size={14} />
              </div>
            </div>

            {/* Unsupervised Door */}
            <div 
              onClick={() => { setActiveDoor("unsupervised"); setCurrentSlide(2); }}
              className="group cursor-pointer p-6 rounded-[2rem] glass hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-left space-y-4"
              id="unsupervised-door"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Users size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">SECTOR B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors font-display">Unsupervised Learning</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Cluster Structures // No Labels</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Algorithms scour dense multidimensional spaces to discover natural clusters and trends autonomously.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                Enter Chamber <ArrowRight size={14} />
              </div>
            </div>

            {/* Reinforcement Door */}
            <div 
              onClick={() => { setActiveDoor("reinforcement"); setCurrentSlide(3); }}
              className="group cursor-pointer p-6 rounded-[2rem] glass hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/5 transition-all text-left space-y-4"
              id="reinforcement-door"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
                  <Flame size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">SECTOR C</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors font-display">Reinforcement Learning</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Agent Environment // Reward Loops</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Agents seek path optimizations through sequential trials, earning rewards or penalties in live simulations.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-rose-400 flex items-center gap-1 font-mono">
                Enter Chamber <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Virtual Presentation slides inside the selected chamber */
        <div className="space-y-6" id="presentation-deck">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveDoor(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              id="back-to-doors-btn"
            >
              <ArrowLeft size={14} /> Back to Door selection
            </button>
            <div className="text-xs font-mono text-slate-400">
              SLIDE {currentSlide + 1} OF {slides.length}
            </div>
          </div>

          {/* Core Interactive Card */}
          <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6 relative" id="active-slide-card">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight font-display">{slides[currentSlide].title}</h2>
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">{slides[currentSlide].subtitle}</p>
            </div>

            {/* Slide Body */}
            {slides[currentSlide].interactiveType === "compare" ? (
              /* COMPARISON MATRIX SLIDE */
              <div className="space-y-6 animate-fade-in" id="comparison-matrix-view">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Excellent. You have explored all three cognitive chambers. Use this quick comparison card to lock in your scientific parameters:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-xs tracking-wider font-mono">
                        <th className="py-3 px-4">Paradigm</th>
                        <th className="py-3 px-4">Core Training Data</th>
                        <th className="py-3 px-4">Algorithmic Goal</th>
                        <th className="py-3 px-4">Real-World Case</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-4 px-4 font-bold text-cyan-400">Supervised</td>
                        <td className="py-4 px-4">Labeled examples (inputs + targets)</td>
                        <td className="py-4 px-4">Map input to discrete or continuous labels</td>
                        <td className="py-4 px-4">Spam filter, Tumor classification</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold text-emerald-400">Unsupervised</td>
                        <td className="py-4 px-4">Raw inputs only (no manual human tags)</td>
                        <td className="py-4 px-4">Discover clusters and associate trends</td>
                        <td className="py-4 px-4">Customer shopping segmentation</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold text-rose-400">Reinforcement</td>
                        <td className="py-4 px-4">Environmental feed & custom reward policy</td>
                        <td className="py-4 px-4">Maximize cumulative feedback points</td>
                        <td className="py-4 px-4">Self-driving routes, Robot gait control</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* REGULAR INTERACTIVE SLIDES */
              <div className="space-y-6">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {slides[currentSlide].content}
                </p>

                {slides[currentSlide].scenario && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">LAB CASE STUDY EVIDENCE:</span>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {slides[currentSlide].scenario}
                    </p>
                  </div>
                )}

                {/* Multiple choice question for the slide */}
                {slides[currentSlide].question && (
                  <div className="space-y-4 pt-2 border-t border-slate-800/40">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <HelpCircle size={16} className="text-indigo-400" />
                      {slides[currentSlide].question}
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {slides[currentSlide].options?.map((opt) => {
                        const isSelected = slideAnswers[currentSlide] === opt.key;
                        const isCorrect = opt.key === slides[currentSlide].correctKey;
                        const hasAnswered = !!slideAnswers[currentSlide];

                        let borderClass = "border-slate-800 hover:border-slate-700 bg-slate-950/40";
                        if (isSelected) {
                          borderClass = isCorrect ? "border-emerald-500 bg-emerald-950/25" : "border-red-500 bg-red-950/25";
                        }

                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleSlideOption(currentSlide, opt.key, slides[currentSlide].correctKey || "")}
                            disabled={hasAnswered}
                            className={`p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${borderClass} ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
                            id={`slide-${currentSlide}-option-${opt.key}`}
                          >
                            <span className={isSelected ? "font-semibold text-white" : "text-slate-300"}>
                              {opt.text}
                            </span>
                            {isSelected && (
                              isCorrect ? <Check className="text-emerald-400" size={16} /> : <X className="text-red-400" size={16} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanatory feedback if answered */}
                    {slideFeedback[currentSlide] && (
                      <div className={`p-4 rounded-xl text-xs leading-relaxed ${slideAnswers[currentSlide] === slides[currentSlide].correctKey ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-900/30' : 'bg-red-950/20 text-red-300 border border-red-900/30'}`}>
                        {slideFeedback[currentSlide]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Slider / Carousel Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                id="prev-slide-btn"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-6 bg-cyan-400' : 'w-2 bg-white/10'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  if (currentSlide < slides.length - 1) {
                    setCurrentSlide((prev) => prev + 1);
                  } else {
                    // Comparative matrix complete
                    setActiveDoor(null);
                  }
                }}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                id="next-slide-btn"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Knowledge Check Section */}
      <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="knowledge-check-section">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <HelpCircle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">Scientist Knowledge Check</h2>
            <p className="text-xs text-slate-400 font-mono">CALIBRATE MODEL SELECTION COMPREHENSION</p>
          </div>
        </div>

        <p className="text-sm text-slate-300">
          Verify your theoretical understanding of machine cognition before diagnosing raw client datasets. A passing score of <strong className="text-cyan-400">80% or greater</strong> unlocks additional credentials.
        </p>

        {/* Diagnostic Quiz Grid */}
        <div className="space-y-6 pt-2">
          {quizQuestions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3" id={`quiz-q-${q.id}`}>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-xs text-cyan-400 mt-1 font-bold">0{idx + 1}.</span>
                <h4 className="text-sm font-semibold text-slate-200 leading-relaxed">{q.q}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {q.options.map((opt) => {
                  const isSelected = quizAnswers[q.id] === opt.key;
                  const isCorrect = opt.key === q.correct;
                  const showResult = quizSubmitted;

                  let optClass = "border-white/10 hover:border-white/20 text-slate-300 bg-white/5 hover:bg-white/10 cursor-pointer";
                  if (isSelected) {
                    optClass = "border-cyan-400 bg-cyan-500/10 text-white font-semibold";
                  }
                  if (showResult) {
                    if (isCorrect) {
                      optClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold";
                    } else if (isSelected) {
                      optClass = "border-red-500 bg-red-500/20 text-red-300";
                    } else {
                      optClass = "border-transparent bg-white/5 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleQuizOption(q.id, opt.key)}
                      disabled={quizSubmitted}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${optClass}`}
                      id={`quiz-${q.id}-opt-${opt.key}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit or Score Board */}
        {quizSubmitted ? (
          <div className="p-5 rounded-2xl glass-light border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4" id="quiz-result-banner">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">Calibration Score</div>
              <div className="text-2xl font-black text-white mt-1">
                {quizScore}% ({quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length} / {quizQuestions.length} Correct)
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {quizScore >= 80 
                  ? "Status: Verified! You have successfully calibrated your baseline cognition." 
                  : "Status: Calibration deficit. Re-examine the door chambers and submit answers again."
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              {quizScore < 80 && (
                <button
                  onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs font-semibold rounded-lg cursor-pointer"
                  id="retry-quiz-btn"
                >
                  Recalibrate (Retry)
                </button>
              )}
              <button
                onClick={() => onNavigate("investigation")}
                disabled={quizScore < 80}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-white/5 disabled:to-white/5 disabled:text-slate-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                id="proceed-to-consulting-btn"
              >
                Launch Consultative Scenarios
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
              id="submit-knowledge-check-btn"
            >
              Submit Diagnostic Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
