export type QuestionType = 'text' | 'multiple-choice' | 'single-choice' | 'rating' | 'ranking' | 'matrix';

export interface Option {
  id: string;
  text: string;
  followUpQuestionId?: string;
}

export interface RankingCriteria {
  id: string;
  text: string;
  weight: number;
}

export interface MatrixConfig {
  rows: { id: string; label: string }[];
  columns: { id: string; label: string }[];
  multipleChoice?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: Option[];
  rankingCriteria?: RankingCriteria[];
  ratingScale?: number;
  matrixConfig?: MatrixConfig;
  followUpQuestions?: Question[];
  parentQuestionId?: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  coverScreen: {
    title: string;
    description: string;
    keywords: string[];
    aiChatEnabled: boolean;
  };
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
} 