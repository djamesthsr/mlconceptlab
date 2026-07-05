export interface ActivityProgress {
  missionBrief: boolean;
  learningLab: boolean;
  knowledgeCheck: boolean;
  knowledgeCheckScore: number; // percentage (0-100)
  mlInvestigation: boolean;
  datasetDetective: boolean;
  workflowChallenge: boolean;
  journeyTimeline: boolean;
  reflectionSubmitted: boolean;
}

export interface QuizAnswers {
  labQuestions: Record<string, string>;
  knowledgeCheck: Record<string, string>;
  datasetDetective: Record<string, string>;
  workflowOrder: string[];
  journeyQuiz: Record<string, string>;
}

export interface Reflections {
  interest: string;
  dailyLife: string;
  goodData: string;
  workflowWhy: string;
}

export interface InvestigationResult {
  choice: string;
  isCorrect: boolean;
  feedback: string;
}

export interface MissionState {
  userName: string;
  xp: number;
  badgeUnlocked: boolean;
  currentTab: string; // 'dashboard' | 'brief' | 'lab' | 'investigation' | 'detective' | 'journey' | 'report'
  progress: ActivityProgress;
  answers: QuizAnswers;
  reflections: Reflections;
  investigationResults: Record<string, InvestigationResult>;
}
