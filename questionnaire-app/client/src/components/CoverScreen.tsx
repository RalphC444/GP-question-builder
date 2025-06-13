import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Avatar,
  Grid,
} from '@mui/material';
import { Send as SendIcon, Work as WorkIcon } from '@mui/icons-material';
import { Questionnaire, Question } from '../types/question';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { ThankYouPage } from './ThankYouPage';
import { useTheme } from '@mui/material/styles';
import { QuestionInput } from './QuestionInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface EmploymentHistory {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  keywords: string[];
}

interface CoverScreenProps {
  questionnaire: Questionnaire;
  onAccept: () => void;
  onDecline: () => void;
  isPreviewMode?: boolean;
  questions?: Question[];
}

const projectKeywords = [
  'real-time',
  'data synchronization',
  'integration',
  'SaaS',
  'enterprise systems',
  'high-throughput',
  'event streams',
  'data consistency',
  'bi-directional sync',
  'conflict resolution',
  'Salesforce',
  'NetSuite',
  'Snowflake'
];

const expertProfile = {
  name: "Michael Brown",
  title: "Senior Software Engineer",
  currentCompany: "TechCorp",
  yearsOfExperience: 8,
  employmentHistory: [
    {
      id: "1",
      company: "TechCorp",
      position: "Senior Software Engineer",
      duration: "2020 - Present",
      description: "Leading development of cloud-native applications and microservices architecture with focus on real-time data synchronization and high-throughput event processing. Implemented bi-directional sync solutions for enterprise systems integration.",
      keywords: ['real-time', 'data synchronization', 'high-throughput', 'event streams', 'bi-directional sync', 'enterprise systems']
    },
    {
      id: "2",
      company: "InnovateSoft",
      position: "Software Engineer",
      duration: "2017 - 2020",
      description: "Full-stack development focusing on scalable web applications and data consistency across distributed systems. Worked with Salesforce and NetSuite integrations.",
      keywords: ['data consistency', 'Salesforce', 'NetSuite', 'distributed systems']
    },
    {
      id: "3",
      company: "Digital Solutions",
      position: "Junior Developer",
      duration: "2015 - 2017",
      description: "Frontend development and UI/UX implementation with experience in SaaS platforms and basic data synchronization patterns.",
      keywords: ['SaaS', 'data synchronization']
    }
  ]
};

const projectHighlights = [
  {
    title: "Real-time Data Sync",
    description: "Handle high-throughput event streams with minimal latency"
  },
  {
    title: "Enterprise Integration",
    description: "Seamless integration with Salesforce, NetSuite, Snowflake, and more"
  },
  {
    title: "Data Consistency",
    description: "Ensure data integrity across all connected systems"
  },
  {
    title: "Bi-directional Sync",
    description: "Support two-way data synchronization with conflict resolution"
  }
];

export function CoverScreen({ questionnaire, onAccept, onDecline, isPreviewMode = false, questions }: CoverScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const theme = useTheme();

  const screeningQuestions = questions || questionnaire.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Add ref for chat scroll and card height
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // Sync chat panel height to card height
  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [showChat, messages, questionnaire, answers]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AtlasSync Screening",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.3-8b-instruct:free",
          "messages": [
            {
              "role": "system",
              "content": "You are an AI assistant helping Advisors understand the AtlasSync project details and why they are a good fit and screening process. AtlasSync is a real-time data synchronization platform that integrates with enterprise systems like Salesforce, NetSuite, and Snowflake. Focus on providing clear, helpful information about the project and the screening process. this is content about the advisor that is being screened: Michael Brown, Your extensive experience in data synchronization and enterprise integration makes you an ideal candidate for this role. Your background in developing scalable solutions and handling complex data workflows aligns perfectly with our project requirements."
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              "role": "user",
              "content": newMessage
            }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const getMatchingKeywords = (jobKeywords: string[]) => {
    return jobKeywords.filter(keyword => 
      projectKeywords.some(projectKeyword => 
        projectKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(projectKeyword.toLowerCase())
      )
    );
  };

  const handleSubmit = () => {
    setShowThankYou(true);
  };

  if (showThankYou) {
    return <ThankYouPage onNewScreener={onDecline} />;
  }

  // Only show the answering UI if not in preview/cover mode
  if (!showThankYou && hasAnswered) {
    const question = screeningQuestions[currentQuestionIndex];
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 700, maxWidth: '100%', p: 4, textAlign: 'left' }}>
          <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
            {currentQuestionIndex + 1}
            <span style={{ color: '#888', marginLeft: 8, fontWeight: 400, fontSize: 18 }}>{`→`}</span>
          </Typography>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 500 }}>{question.title}</Typography>
          {question.description && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
              {question.description}
            </Typography>
          )}
          <Box sx={{ mb: 4 }}>
            <QuestionInput
              question={question}
              value={answers[question.id]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            >
              Back
            </Button>
            {currentQuestionIndex < screeningQuestions.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, screeningQuestions.length - 1))}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`${currentQuestionIndex + 1} of ${screeningQuestions.length}`}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      minHeight: '100vh',
      width: '100vw',
      bgcolor: theme.palette.mode === 'dark' ? '#18191c' : '#f5f6fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1300,
      overflowY: 'auto',
      pt: 6,
      pb: 6,
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 1200, justifyContent: 'center', alignItems: 'flex-start', height: '100%' }}>
        {/* Main Card */}
        <Paper ref={cardRef} sx={{ p: 4, maxWidth: 800, width: showChat ? 700 : 800, mx: 'auto', flexShrink: 0, transition: 'width 0.2s', display: 'flex', flexDirection: 'column', minHeight: 520, height: '100%' }}>
          <Typography variant="h4" gutterBottom>
            {questionnaire.title}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <b>Project Overview</b>
              </Typography>
              <Typography variant="body1" paragraph>
                {questionnaire.description}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
               <b> Why you are a good fit, {expertProfile.name}</b>
              </Typography>
              <Typography variant="body1" paragraph>
                Your extensive experience in data synchronization and enterprise integration makes you an ideal candidate for this role. 
                Your background in developing scalable solutions and handling complex data workflows aligns perfectly with our project requirements.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <b>Key Highlights</b>
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" paragraph>
                  Real-time data synchronization across multiple systems
                </Typography>
                <Typography component="li" paragraph>
                  Advanced conflict resolution algorithms
                </Typography>
                <Typography component="li" paragraph>
                  Enterprise-grade security and compliance
                </Typography>
                <Typography component="li" paragraph>
                  Scalable architecture for high-performance data processing
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box>
              {questionnaire.coverScreen.aiChatEnabled && !showChat && !isPreviewMode && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setShowChat(true)}
                  sx={{ textTransform: 'none' }}
                >
                  Have questions about this project? Ask our AI assistant
                </Button>
              )}
            </Box>
          </Box>
          {/* Accept/Decline Buttons always at the bottom of the main card */}
          {!isPreviewMode && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={onDecline}>
                Decline
              </Button>
              <Button variant="contained" onClick={() => setHasAnswered(true)}>
                Start Screening
              </Button>
            </Box>
          )}
          {isPreviewMode && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                sx={{ minWidth: 200 }}
              >
                SUBMIT ANSWERS
              </Button>
            </Box>
          )}
        </Paper>
        {/* Chat Section (right) */}
        {questionnaire.coverScreen.aiChatEnabled && showChat && !isPreviewMode && (
          <Box sx={{
            ml: '12px',
            width: 380,
            maxWidth: '90vw',
            minHeight: cardHeight || 520,
            maxHeight: cardHeight || 520,
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-start',
            border: '1px solid #e0e0e0',
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? '#23242a' : '#f8f9fb',
            boxShadow: 4,
            overflow: 'hidden',
            height: cardHeight || 520,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2, borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper', zIndex: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                GP AI Project Assistant
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => setShowChat(false)}
                sx={{ textTransform: 'none' }}
              >
                Hide Chat
              </Button>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, maxHeight: (cardHeight ? cardHeight - 120 : 400), overflowY: 'auto', px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'transparent' }}>
              {messages.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
                  Ask a question about AtlasSync or the screening process.
                </Typography>
              )}
              {messages.map((message, idx) => (
                <Box key={message.id} sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  bgcolor: message.sender === 'user' ? 'primary.main' : (theme.palette.mode === 'dark' ? '#2a2d34' : '#fff'),
                  color: message.sender === 'user' ? '#fff' : 'text.primary',
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 1,
                  mb: 0.5,
                  fontSize: 15,
                  whiteSpace: 'pre-line',
                }}>
                  {message.text}
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.6, fontSize: 11, textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>
            <Box sx={{ p: 3, pt: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'background.paper', zIndex: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask a question about AtlasSync or the screening process..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
                  InputProps={{ style: { fontSize: 16 } }}
                />
                <IconButton color="primary" onClick={handleSendMessage} sx={{ alignSelf: 'flex-end' }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
} 