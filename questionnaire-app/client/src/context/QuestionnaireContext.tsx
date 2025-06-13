import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Questionnaire, Question, Option } from '../types/question';

interface QuestionnaireContextType {
  questionnaire: Questionnaire;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  updateQuestionnaire: (updates: Partial<Questionnaire>) => void;
}

const defaultQuestions: Omit<Question, 'id'>[] = [
  {
    type: 'single-choice',
    title: 'What is your experience with real-time data synchronization platforms?',
    description: 'Please select the option that best describes your experience level.',
    required: true,
    options: [
      { id: uuidv4(), text: 'No experience' },
      { id: uuidv4(), text: 'Basic understanding' },
      { id: uuidv4(), text: 'Hands-on experience with one platform' },
      { id: uuidv4(), text: 'Extensive experience with multiple platforms' }
    ]
  },
  {
    type: 'multiple-choice',
    title: 'Which of the following technologies have you worked with?',
    description: 'Select all that apply.',
    required: true,
    options: [
      { id: uuidv4(), text: 'Apache Kafka' },
      { id: uuidv4(), text: 'Apache Flink' },
      { id: uuidv4(), text: 'Apache Spark' },
      { id: uuidv4(), text: 'RabbitMQ' },
      { id: uuidv4(), text: 'AWS Kinesis' }
    ]
  },
  {
    type: 'rating',
    title: 'Rate your experience with conflict resolution in distributed systems',
    description: '1 being no experience, 5 being expert level',
    required: true,
    ratingScale: 5
  },
  {
    type: 'text',
    title: 'Describe a challenging data synchronization problem you\'ve solved',
    description: 'Please provide details about the problem, your approach, and the outcome.',
    required: true
  },
  {
    type: 'ranking',
    title: 'Rank the following aspects of data synchronization by importance',
    description: 'Drag to reorder from most important (top) to least important (bottom)',
    required: true,
    rankingCriteria: [
      { id: uuidv4(), text: 'Data Consistency', weight: 5 },
      { id: uuidv4(), text: 'Performance', weight: 4 },
      { id: uuidv4(), text: 'Scalability', weight: 3 },
      { id: uuidv4(), text: 'Error Handling', weight: 2 },
      { id: uuidv4(), text: 'Monitoring', weight: 1 }
    ]
  }
];

const defaultQuestionnaire: Questionnaire = {
  id: uuidv4(),
  title: 'AtlasSync Customer Screening',
  description: 'AtlasSync is a real-time data synchronization platform being developed to support seamless integration between TechCorp\'s suite of SaaS tools and third-party enterprise systems (e.g., Salesforce, NetSuite, Snowflake). The platform is designed to handle high-throughput event streams, ensure data consistency across services, and support bi-directional sync with conflict resolution.',
  coverScreen: {
    title: 'AtlasSync Customer Screening',
    description: 'AtlasSync is a real-time data synchronization platform being developed to support seamless integration between TechCorp\'s suite of SaaS tools and third-party enterprise systems (e.g., Salesforce, NetSuite, Snowflake). The platform is designed to handle high-throughput event streams, ensure data consistency across services, and support bi-directional sync with conflict resolution.',
    keywords: ['Real-time Sync', 'Data Integration', 'Enterprise Systems', 'High-throughput', 'Conflict Resolution'],
    aiChatEnabled: true,
  },
  questions: defaultQuestions.map(q => ({ ...q, id: uuidv4() })),
  status: 'draft',
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>(defaultQuestionnaire);

  const addQuestion = (question: Omit<Question, 'id'>) => {
    const newQuestion: Question = {
      ...question,
      id: uuidv4(),
    };
    setQuestionnaire(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }));
  };

  const reorderQuestions = (startIndex: number, endIndex: number) => {
    setQuestionnaire(prev => {
      const questions = [...prev.questions];
      const [removed] = questions.splice(startIndex, 1);
      questions.splice(endIndex, 0, removed);
      return { ...prev, questions };
    });
  };

  const updateQuestionnaire = (updates: Partial<Questionnaire>) => {
    setQuestionnaire(prev => ({ ...prev, ...updates }));
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        questionnaire,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        updateQuestionnaire,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
} 