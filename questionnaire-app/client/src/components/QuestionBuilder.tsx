import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Slider,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Tabs,
  Tab,
  Chip,
  Tooltip,
} from '@mui/material';
import { DragIndicator, Delete, Add, AddCircle, Send, Brightness4, Brightness7, Edit, Save, ContentCopy, ShortText, CheckBox, RadioButtonChecked, Star, FormatListNumbered, LibraryBooks, AutoAwesome, TableChart, ArrowDropDown, MoreVert } from '@mui/icons-material';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { Question, QuestionType, Option, RankingCriteria, MatrixConfig } from '../types/question';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { CoverScreen } from './CoverScreen';
import { ThankYouPage } from './ThankYouPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QuestionInput } from './QuestionInput';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`screener-tabpanel-${index}`}
      aria-labelledby={`screener-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ANGLES = [
  { label: 'Business', key: 0 },
  { label: 'Customer', key: 1 },
  { label: 'Decision Maker', key: 2 },
];

// Template definitions
const QUESTION_TEMPLATES = [
  {
    label: 'Healthcare',
    questions: [
      { id: uuidv4(), type: 'text', title: 'Describe your healthcare experience', required: true },
      { id: uuidv4(), type: 'single-choice', title: 'Are you currently insured?', required: true, options: [ { id: uuidv4(), text: 'Yes' }, { id: uuidv4(), text: 'No' } ] },
      { id: uuidv4(), type: 'multiple-choice', title: 'Which of the following services have you used?', required: false, options: [ { id: uuidv4(), text: 'Telemedicine' }, { id: uuidv4(), text: 'In-person visits' }, { id: uuidv4(), text: 'Lab tests' } ] },
      { id: uuidv4(), type: 'rating', title: 'Rate your satisfaction with your provider', required: false, ratingScale: 5 },
      { id: uuidv4(), type: 'ranking', title: 'Rank the importance of these factors', required: false, rankingCriteria: [ { id: uuidv4(), text: 'Cost', weight: 3 }, { id: uuidv4(), text: 'Quality', weight: 4 }, { id: uuidv4(), text: 'Accessibility', weight: 5 } ] },
      { id: uuidv4(), type: 'matrix', title: 'Rate the following services', required: false, matrixConfig: { rows: [ { id: uuidv4(), label: 'Telemedicine' }, { id: uuidv4(), label: 'In-person' } ], columns: [ { id: uuidv4(), label: 'Excellent' }, { id: uuidv4(), label: 'Good' }, { id: uuidv4(), label: 'Poor' } ] } },
    ]
  },
  {
    label: 'Customers',
    questions: [
      { id: uuidv4(), type: 'text', title: 'What is your main reason for using our product?', required: true },
      { id: uuidv4(), type: 'rating', title: 'How likely are you to recommend us?', required: true, ratingScale: 5 },
      { id: uuidv4(), type: 'multiple-choice', title: 'Which features do you use?', required: false, options: [ { id: uuidv4(), text: 'Feature A' }, { id: uuidv4(), text: 'Feature B' }, { id: uuidv4(), text: 'Feature C' } ] },
    ]
  },
  {
    label: 'Education',
    questions: [
      { id: uuidv4(), type: 'text', title: 'What is your highest level of education?', required: true },
      { id: uuidv4(), type: 'single-choice', title: 'Are you currently enrolled in school?', required: true, options: [ { id: uuidv4(), text: 'Yes' }, { id: uuidv4(), text: 'No' } ] },
      { id: uuidv4(), type: 'matrix', title: 'Rate your skills', required: false, matrixConfig: { rows: [ { id: uuidv4(), label: 'Math' }, { id: uuidv4(), label: 'Science' } ], columns: [ { id: uuidv4(), label: 'Beginner' }, { id: uuidv4(), label: 'Intermediate' }, { id: uuidv4(), label: 'Advanced' } ] } },
    ]
  },
  {
    label: 'Retail',
    questions: [
      { id: uuidv4(), type: 'text', title: 'What is your favorite store?', required: false },
      { id: uuidv4(), type: 'multiple-choice', title: 'Which of these do you shop at?', required: false, options: [ { id: uuidv4(), text: 'Store A' }, { id: uuidv4(), text: 'Store B' }, { id: uuidv4(), text: 'Store C' } ] },
      { id: uuidv4(), type: 'rating', title: 'How would you rate your last shopping experience?', required: false, ratingScale: 5 },
    ]
  },
  {
    label: 'SaaS',
    questions: [
      { id: uuidv4(), type: 'text', title: 'What SaaS tools do you use?', required: false },
      { id: uuidv4(), type: 'ranking', title: 'Rank these SaaS features', required: false, rankingCriteria: [ { id: uuidv4(), text: 'Integrations', weight: 5 }, { id: uuidv4(), text: 'Pricing', weight: 3 }, { id: uuidv4(), text: 'Support', weight: 4 } ] },
      { id: uuidv4(), type: 'matrix', title: 'Evaluate SaaS vendors', required: false, matrixConfig: { rows: [ { id: uuidv4(), label: 'Vendor A' }, { id: uuidv4(), label: 'Vendor B' } ], columns: [ { id: uuidv4(), label: 'Ease of Use' }, { id: uuidv4(), label: 'Value' }, { id: uuidv4(), label: 'Features' } ] } },
    ]
  },
];

export function QuestionBuilder() {
  const { 
    questionnaire, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    reorderQuestions, 
    updateQuestionnaire 
  } = useQuestionnaire();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showCoverScreen, setShowCoverScreen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [rankingValues, setRankingValues] = useState<Record<string, Record<string, number>>>({});
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<Record<string, string[]>>({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [lastAddedQuestionId, setLastAddedQuestionId] = useState<string | null>(null);

  // Separate question sets for each tab
  const [businessQuestions, setBusinessQuestions] = useState<Question[]>([]);
  const [customerQuestions, setCustomerQuestions] = useState<Question[]>(questionnaire.questions);
  const [decisionQuestions, setDecisionQuestions] = useState<Question[]>([]);

  // Add back anglePublished and handlePublish if missing
  const [anglePublished, setAnglePublished] = useState([false, true, false]); // [Business, Customer, Decision Maker]
  const handlePublish = () => {
    setAnglePublished(prev => prev.map((val, idx) => idx === selectedTab ? true : val));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    const questions = getQuestionsByAngle(newValue);
    if (questions.length > 0) {
      setSelectedQuestionId(questions[0].id);
    } else {
      setSelectedQuestionId(null);
    }
  };

  const getCurrentQuestions = () => {
    switch (selectedTab) {
      case 0:
        return businessQuestions;
      case 1:
        return customerQuestions;
      case 2:
        return decisionQuestions;
      default:
        return [];
    }
  };

  const setCurrentQuestions = (questions: Question[]) => {
    switch (selectedTab) {
      case 0:
        setBusinessQuestions(questions);
        break;
      case 1:
        setCustomerQuestions(questions);
        break;
      case 2:
        setDecisionQuestions(questions);
        break;
    }
  };

  const handleTextAnswerChange = (questionId: string, value: string) => {
    setTextAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSingleChoiceChange = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleChoiceChange = (questionId: string, optionId: string, checked: boolean) => {
    setMultipleChoiceAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionId]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(id => id !== optionId)
        };
      }
    });
  };

  const handleRatingChange = (questionId: string, value: number) => {
    setRatingValues(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleRankingChange = (questionId: string, criteriaId: string, value: number) => {
    setRankingValues(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [criteriaId]: value
      }
    }));
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      title: 'New Question',
      required: false,
    };

    switch (selectedTab) {
      case 0:
        setBusinessQuestions([...businessQuestions, newQuestion]);
        break;
      case 1:
        setCustomerQuestions([...customerQuestions, newQuestion]);
        break;
      case 2:
        setDecisionQuestions([...decisionQuestions, newQuestion]);
        break;
    }
    setSelectedQuestionId(newQuestion.id);
    setEditMode(true);
    setLastAddedQuestionId(newQuestion.id);
    // Always revert to draft when adding a question
    setAnglePublished(prev => prev.map((val, idx) => idx === selectedTab ? false : val));
  };

  const handleAddOption = (questionId: string) => {
    const newOption: Option = {
      id: uuidv4(),
      text: 'New Option',
    };

    const currentQuestions = getCurrentQuestions();
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;

    const updatedQuestion = {
      ...question,
      options: [...(question.options || []), newOption]
    };

    switch (selectedTab) {
      case 0:
        setBusinessQuestions(businessQuestions.map(q => 
          q.id === questionId ? updatedQuestion : q
        ));
        break;
      case 1:
        setCustomerQuestions(customerQuestions.map(q => 
          q.id === questionId ? updatedQuestion : q
        ));
        break;
      case 2:
        setDecisionQuestions(decisionQuestions.map(q => 
          q.id === questionId ? updatedQuestion : q
        ));
        break;
    }
  };

  const handleAddRankingCriteria = (questionId: string) => {
    const newCriteria: RankingCriteria = {
      id: uuidv4(),
      text: 'New Criteria',
      weight: 1,
    };

    const currentQuestions = getCurrentQuestions();
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;

    const updatedQuestion = {
      ...question,
      rankingCriteria: [...(question.rankingCriteria || []), newCriteria]
    };

    switch (selectedTab) {
      case 0:
        setBusinessQuestions(businessQuestions.map(q => 
          q.id === questionId ? updatedQuestion : q
        ));
        break;
      case 1:
        setCustomerQuestions(customerQuestions.map(q => 
          q.id === questionId ? updatedQuestion : q
        ));
        break;
      case 2:
        setDecisionQuestions(decisionQuestions.map(q => 
          q.id === questionId ? updatedQuestion : q
        ));
        break;
    }
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    switch (selectedTab) {
      case 0:
        setBusinessQuestions(updatedQuestions);
        break;
      case 1:
        setCustomerQuestions(updatedQuestions);
        break;
      case 2:
        setDecisionQuestions(updatedQuestions);
        break;
    }
  };

  const handleUpdateOption = (questionId: string, optionId: string, text: string) => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map(q => {
      if (q.id !== questionId) return q;
      if (!q.options) return q;
      return {
        ...q,
        options: q.options.map(opt =>
          opt.id === optionId ? { ...opt, text } : opt
        )
      };
    });
    setCurrentQuestions(updatedQuestions);
  };

  const handleUpdateRankingCriteria = (questionId: string, criteriaId: string, updates: Partial<RankingCriteria>) => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map(q => {
      if (q.id !== questionId || !q.rankingCriteria) return q;
      return {
        ...q,
        rankingCriteria: q.rankingCriteria.map(crit =>
          crit.id === criteriaId ? { ...crit, ...updates } : crit
        )
      };
    });
    setCurrentQuestions(updatedQuestions);
  };

  const handleDeleteRankingCriteria = (questionId: string, criteriaId: string) => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map(q => {
      if (q.id !== questionId || !q.rankingCriteria) return q;
      return {
        ...q,
        rankingCriteria: q.rankingCriteria.filter(crit => crit.id !== criteriaId)
      };
    });
    setCurrentQuestions(updatedQuestions);
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map(q => {
      if (q.id !== questionId || !q.options) return q;
      return {
        ...q,
        options: q.options.filter(opt => opt.id !== optionId)
      };
    });
    setCurrentQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.filter(q => q.id !== questionId);

    switch (selectedTab) {
      case 0:
        setBusinessQuestions(updatedQuestions);
        break;
      case 1:
        setCustomerQuestions(updatedQuestions);
        break;
      case 2:
        setDecisionQuestions(updatedQuestions);
        break;
    }
    // Select the first question if any remain, otherwise null
    if (updatedQuestions.length > 0) {
      setSelectedQuestionId(updatedQuestions[0].id);
    } else {
      setSelectedQuestionId(null);
    }
  };

  const handleReorderQuestions = (sourceIndex: number, destinationIndex: number) => {
    const currentQuestions = getCurrentQuestions();
    const [removed] = currentQuestions.splice(sourceIndex, 1);
    currentQuestions.splice(destinationIndex, 0, removed);
    setCurrentQuestions([...currentQuestions]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    handleReorderQuestions(result.source.index, result.destination.index);
  };

  const handleSend = () => {
    setIsSending(true);
    // Only send questions for the currently selected angle
    const questionsToSend = getQuestionsByAngle(selectedTab);
    // Set the questions in the questionnaire context
    updateQuestionnaire({
      ...questionnaire,
      questions: questionsToSend,
      status: 'published'
    });
    setShowCoverScreen(true);
  };

  // Add state for tracking if we're in answering mode
  const [isAnswering, setIsAnswering] = useState(false);

  // Add handler for starting the questionnaire
  const handleStartQuestionnaire = () => {
    setIsAnswering(true);
    setShowCoverScreen(false);
  };

  // Add handler for declining the questionnaire
  const handleDeclineQuestionnaire = () => {
    setIsAnswering(false);
    setShowCoverScreen(false);
  };

  // Add handler for completing the questionnaire
  const handleCompleteQuestionnaire = () => {
    setIsAnswering(false);
    setShowThankYou(true);
  };

  const handleSubmit = () => {
    setShowThankYou(true);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, getCurrentQuestions().length - 1));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  // Helper to get questions for an angle
  const getQuestionsByAngle = (angleIdx: number) => {
    switch (angleIdx) {
      case 0: return businessQuestions;
      case 1: return customerQuestions;
      case 2: return decisionQuestions;
      default: return [];
    }
  };

  // Helper to get selected question object
  const selectedQuestion = selectedQuestionId
    ? getQuestionsByAngle(selectedTab).find(q => q.id === selectedQuestionId)
    : null;

  // When selectedQuestion changes, reset edit fields
  React.useEffect(() => {
    if (selectedQuestion) {
      setEditTitle(selectedQuestion.title);
      setEditDescription(selectedQuestion.description || '');
      // Only exit edit mode if not the last added question
      if (selectedQuestion.id !== lastAddedQuestionId) {
        setEditMode(false);
      }
    }
  }, [selectedQuestionId]);

  // On initial mount or when questions change, default to first question if none selected
  React.useEffect(() => {
    const questions = getQuestionsByAngle(selectedTab);
    if (!selectedQuestionId && questions.length > 0) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [selectedTab, businessQuestions, customerQuestions, decisionQuestions]);

  // Helper to get icon background color for question type (soft, pastel)
  const getTypeBgColor = (type: QuestionType) => {
    switch (type) {
      case 'text':
        return '#b3c6f7'; // soft blue
      case 'multiple-choice':
        return '#b7e2c6'; // soft green
      case 'single-choice':
        return '#d1b3e6'; // soft purple
      case 'rating':
        return '#ffe9a7'; // soft yellow
      case 'ranking':
        return '#ffd8b3'; // soft orange
      case 'matrix':
        return '#b2e3e6'; // soft teal
      default:
        return '#ececec';
    }
  };

  // Helper to get icon color (darker, similar to bg)
  const getTypeIconColor = (type: QuestionType) => {
    switch (type) {
      case 'text':
        return '#3956a3'; // dark blue
      case 'multiple-choice':
        return '#2e7d4f'; // dark green
      case 'single-choice':
        return '#6d4c90'; // dark purple
      case 'rating':
        return '#bfa000'; // dark gold
      case 'ranking':
        return '#e07c1a'; // dark orange
      case 'matrix':
        return '#1a7a7a'; // dark teal
      default:
        return '#888';
    }
  };

  const getTypeIcon = (type: QuestionType) => {
    const iconProps = { fontSize: 'small' as const, sx: { color: getTypeIconColor(type) } };
    switch (type) {
      case 'text':
        return <ShortText {...iconProps} />;
      case 'multiple-choice':
        return <CheckBox {...iconProps} />;
      case 'single-choice':
        return <RadioButtonChecked {...iconProps} />;
      case 'rating':
        return <Star {...iconProps} />;
      case 'ranking':
        return <FormatListNumbered {...iconProps} />;
      case 'matrix':
        return <TableChart {...iconProps} />;
      default:
        return null;
    }
  };

  // Add template dropdown state
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const handleTemplateChange = (event) => {
    const template = QUESTION_TEMPLATES.find(t => t.label === event.target.value);
    if (!template) return;
    switch (selectedTab) {
      case 0:
        setBusinessQuestions(prev => [...prev, ...template.questions.map(q => ({ ...q, id: uuidv4(), type: q.type as QuestionType }))]);
        break;
      case 1:
        setCustomerQuestions(prev => [...prev, ...template.questions.map(q => ({ ...q, id: uuidv4(), type: q.type as QuestionType }))]);
        break;
      case 2:
        setDecisionQuestions(prev => [...prev, ...template.questions.map(q => ({ ...q, id: uuidv4(), type: q.type as QuestionType }))]);
        break;
    }
    setSelectedTemplate(event.target.value);
  };

  // Add state for template modal
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  // Handler for card click
  const handleUseQuestionSetClick = () => {
    setTemplateModalOpen(true);
  };

  // Add state for selected template in modal
  const [modalSelectedTemplate, setModalSelectedTemplate] = useState('');

  // Handler for selecting a template from dropdown in modal
  const handleModalTemplateChange = (event) => {
    const templateLabel = event.target.value;
    setModalSelectedTemplate(templateLabel);
    const template = QUESTION_TEMPLATES.find(t => t.label === templateLabel);
    if (!template) return;
    switch (selectedTab) {
      case 0:
        setBusinessQuestions(prev => [...prev, ...template.questions.map(q => ({ ...q, id: uuidv4(), type: q.type as QuestionType }))]);
        break;
      case 1:
        setCustomerQuestions(prev => [...prev, ...template.questions.map(q => ({ ...q, id: uuidv4(), type: q.type as QuestionType }))]);
        break;
      case 2:
        setDecisionQuestions(prev => [...prev, ...template.questions.map(q => ({ ...q, id: uuidv4(), type: q.type as QuestionType }))]);
        break;
    }
    setTemplateModalOpen(false);
    setModalSelectedTemplate('');
  };

  // State for AI modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Handler for Create With AI card click
  const handleCreateWithAIClick = () => {
    setAiModalOpen(true);
    setAiPrompt('');
    setGeneratedQuestions([]);
    setShowPreview(false);
  };

  // AI Question Generation
  const generateQuestionsWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AtlasSync Question Generation",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.3-8b-instruct:free",
          "messages": [
            {
              "role": "system",
              "content": `You are an AI assistant that generates screening questions for questionnaires. Generate 4-6 relevant questions based on the user's description. 

Return your response as a JSON array with this exact format:
[
  {
    "type": "text|single-choice|multiple-choice|rating|ranking",
    "title": "Question text here",
    "description": "Optional description",
    "required": true|false,
    "options": [{"text": "Option 1"}, {"text": "Option 2"}],
    "ratingScale": 5,
    "rankingCriteria": [{"text": "Criteria 1", "weight": 3}]
  }
]

Only include options for single-choice/multiple-choice, ratingScale for rating questions, and rankingCriteria for ranking questions. Focus on generating practical, relevant screening questions.`
            },
            {
              "role": "user",
              "content": `Generate screening questions for: ${aiPrompt}`
            }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questionsData = JSON.parse(jsonMatch[0]);
        const questions: Question[] = questionsData.map((q: any) => ({
          id: uuidv4(),
          type: q.type as QuestionType,
          title: q.title,
          description: q.description || '',
          required: q.required || false,
          options: q.options?.map((opt: any) => ({ id: uuidv4(), text: opt.text })),
          ratingScale: q.ratingScale || 5,
          rankingCriteria: q.rankingCriteria?.map((crit: any) => ({ 
            id: uuidv4(), 
            text: crit.text, 
            weight: crit.weight || 3 
          }))
        }));
        
        setGeneratedQuestions(questions);
        setShowPreview(true);
      } else {
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle adding selected questions to the current angle
  const handleAddGeneratedQuestions = () => {
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = [...currentQuestions, ...generatedQuestions];
    
    switch (selectedTab) {
      case 0:
        setBusinessQuestions(updatedQuestions);
        break;
      case 1:
        setCustomerQuestions(updatedQuestions);
        break;
      case 2:
        setDecisionQuestions(updatedQuestions);
        break;
    }
    
    // Revert to draft when adding questions
    setAnglePublished(prev => prev.map((val, idx) => idx === selectedTab ? false : val));
    
    // Close modal and reset state
    setAiModalOpen(false);
    setShowPreview(false);
    setGeneratedQuestions([]);
    setAiPrompt('');
  };

  // Handle deleting a generated question
  const handleDeleteGeneratedQuestion = (questionId: string) => {
    setGeneratedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  // Handle editing a generated question
  const handleEditGeneratedQuestion = (questionId: string, updates: Partial<Question>) => {
    setGeneratedQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, ...updates } : q)
    );
  };

  // Handle updating matrix configuration properly
  const handleMatrixConfigUpdate = (questionId: string, updates: Partial<MatrixConfig>) => {
    // Update generatedQuestions (for AI modal)
    setGeneratedQuestions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          const currentConfig = q.matrixConfig || { rows: [], columns: [] };
          return {
            ...q,
            matrixConfig: {
              rows: updates.rows || currentConfig.rows,
              columns: updates.columns || currentConfig.columns
            }
          };
        }
        return q;
      })
    );
    
    // Update main question state (for edit mode)
    const currentQuestions = getCurrentQuestions();
    const updatedQuestions = currentQuestions.map(q => {
      if (q.id === questionId) {
        const currentConfig = q.matrixConfig || { rows: [], columns: [] };
        return {
          ...q,
          matrixConfig: {
            rows: updates.rows || currentConfig.rows,
            columns: updates.columns || currentConfig.columns
          }
        };
      }
      return q;
    });
    setCurrentQuestions(updatedQuestions);
  };

  // Add state for kebab menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuQuestionId, setMenuQuestionId] = useState<string | null>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, questionId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuQuestionId(questionId);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuQuestionId(null);
  };

  // Sidebar rendering with angle tabs at the top
  const renderSidebar = () => (
    <Box sx={{ width: '40vw', minWidth: 320, maxWidth: 600, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', height: '100vh', p: 0, m: 0, display: 'flex', flexDirection: 'column', color: darkMode ? '#fff' : 'inherit', flexShrink: 0 }}>
      {/* Angle tabs at the top */}
      <Tabs
        orientation="horizontal"
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 48 }}
      >
        {ANGLES.map((angle) => (
          <Tab key={angle.key} label={angle.label} sx={{ fontWeight: 700 }} />
        ))}
      </Tabs>
      {/* Toolbar below angle tabs, above question list */}
      {getQuestionsByAngle(selectedTab).length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Tooltip title="Add a new question" arrow>
              <IconButton color="primary" onClick={handleAddQuestion} size="small" sx={{ border: '1.5px solid #1976d2', borderRadius: 2, mr: 1 }}>
                <AddCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add questions from a template" arrow disableHoverListener enterTouchDelay={0}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  displayEmpty
                  sx={{ bgcolor: darkMode ? '#23242a' : '#fff', borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Select Template…</MenuItem>
                  {QUESTION_TEMPLATES.map(t => (
                    <MenuItem key={t.label} value={t.label}>{t.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: anglePublished[selectedTab] ? '#e6f4ea' : '#fffbe6', color: anglePublished[selectedTab] ? '#388e3c' : '#bfa000', fontWeight: 600, fontSize: 13, border: '1px solid', borderColor: anglePublished[selectedTab] ? '#b2dfdb' : '#ffe082' }}>
              {anglePublished[selectedTab] ? 'Published' : 'Draft'}
            </Box>
            <Button variant="contained" color={anglePublished[selectedTab] ? 'success' : 'primary'} onClick={handlePublish} size="small" disabled={anglePublished[selectedTab]} sx={{ fontWeight: 600, ml: 1 }}>
              {anglePublished[selectedTab] ? 'Published' : 'Publish'}
            </Button>
          </Box>
        </Box>
      )}
      {/* Questions preview for selected angle */}
      <Box sx={{ flex: 1, overflowY: 'auto', pt: 2, display: 'flex', flexDirection: 'column' }}>
        {getQuestionsByAngle(selectedTab).length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.7, textAlign: 'center', fontSize: 22, color: darkMode ? '#b0b0b0' : 'text.secondary' }}>
              No questions yet for this angle.
            </Typography>
          </Box>
        ) : (
          <List dense>
            {getQuestionsByAngle(selectedTab).map((q, i) => (
              <ListItem
                key={q.id}
                button
                selected={selectedQuestionId === q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                sx={{
                  pl: 2, pr: 2, py: 1.5, width: '100%', maxWidth: '100%', height: 68,
                  transition: 'background 0.2s',
                  bgcolor: selectedQuestionId === q.id
                    ? (darkMode ? 'rgba(255,255,255,0.08)' : '#f5f7fa')
                    : 'transparent',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
                  },
                }}
              >
                {/* Question number badge */}
                <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, bgcolor: '#f0f0f0', borderRadius: '50%', fontWeight: 400, fontSize: 14, color: '#888', border: '1px solid #e0e0e0', flexShrink: 0 }}>
                  {i + 1}
                </Box>
                {/* Type icon with tooltip */}
                <Tooltip title={getTypeDisplayName(q.type)} arrow placement="top">
                  <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, bgcolor: getTypeBgColor(q.type), borderRadius: '50%', flexShrink: 0 }}>
                    {getTypeIcon(q.type)}
                  </Box>
                </Tooltip>
                <ListItemText
                  primary={<span style={{ fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', color: darkMode ? '#fff' : '#222' }}>{q.title}</span>}
                  sx={{ m: 0, p: 0 }}
                />
                <ListItemSecondaryAction sx={{ right: 8 }}>
                  <IconButton edge="end" onClick={e => { e.stopPropagation(); handleMenuOpen(e, q.id); }}>
                    <MoreVert />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  // Main content rendering
  const renderMainContent = () => {
    const questions = getQuestionsByAngle(selectedTab);
    return (
      <Box sx={{ flex: 1, minHeight: '100vh', p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Persistent header bar for title and actions */}
        <Box sx={{ mb: 3, mt: 4, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4">AtlasSync {ANGLES[selectedTab].label} Screening</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {!isPreviewMode && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Send />}
                onClick={handleSend}
                disabled={getCurrentQuestions().length === 0 || !anglePublished[selectedTab]}
                sx={{ minWidth: 180, fontSize: 18 }}
              >
                SEND
              </Button>
            )}
          </Box>
        </Box>
        {questions.length === 0 ? (
          // Show creation options in the center if no questions
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '60vw',
            maxWidth: '60vw',
            height: '100%',
            margin: '0 auto'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Create from Scratch */}
              <Paper
                elevation={0}
                onClick={handleAddQuestion}
                sx={{
                  p: 4,
                  width: 320,
                  height: 220,
                  borderRadius: 3,
                  bgcolor: darkMode ? '#23242a' : '#fff',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  '&:hover, &:focus': { boxShadow: 4, borderColor: '#1976d2' },
                  outline: 'none',
                }}
                tabIndex={0}
              >
                <Box sx={{ mb: 2, bgcolor: '#e3edfa', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Add sx={{ color: '#1976d2', fontSize: 32 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>Create from Scratch</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.4 }}>
                  Build from a list of ready-made form elements.
                </Typography>
              </Paper>
              {/* Use a Question Set */}
              <Paper
                elevation={0}
                onClick={handleUseQuestionSetClick}
                sx={{
                  p: 4,
                  width: 320,
                  height: 220,
                  borderRadius: 3,
                  bgcolor: darkMode ? '#23242a' : '#fff',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  '&:hover, &:focus': { boxShadow: 4, borderColor: '#8e24aa' },
                  outline: 'none',
                }}
                tabIndex={0}
              >
                <Box sx={{ mb: 2, bgcolor: '#f3eafd', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LibraryBooks sx={{ color: '#8e24aa', fontSize: 32 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>Use a Question Set</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.4 }}>
                  Choose from a library of pre-made question sets.
                </Typography>
              </Paper>
              {/* Write With AI (Main POC Focus) */}
              <Paper
                elevation={0}
                onClick={handleCreateWithAIClick}
                sx={{
                  p: 4,
                  width: 320,
                  height: 220,
                  borderRadius: 3,
                  bgcolor: darkMode ? '#23242a' : '#fff',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  '&:hover, &:focus': { boxShadow: 4, borderColor: '#512da8' },
                  outline: 'none',
                }}
                tabIndex={0}
              >
                <Box sx={{ mb: 2, bgcolor: '#eae7fa', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AutoAwesome sx={{ color: '#512da8', fontSize: 32 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>Create With AI</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.4 }}>
                  Use AI to help generate questions.
                </Typography>
              </Paper>
            </Box>
          </Box>
        ) : selectedQuestion ? (
          // Show question preview/edit section
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
              width: '80%',
              maxWidth: 900,
              bgcolor: darkMode ? '#23272f' : 'background.default',
              color: darkMode ? '#fff' : 'inherit',
              p: 4,
              borderRadius: 3,
              boxShadow: darkMode ? 4 : 1,
              mx: 'auto',
              border: darkMode ? '1px solid #333' : undefined,
              transition: 'background 0.2s, color 0.2s',
            }}>
              {editMode ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 400,
                  maxHeight: '70vh',
                  position: 'relative',
                }}>
                  <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, paddingTop: 1}}>
                    {/* Question Type first */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="question-type-label" shrink>Question Type</InputLabel>
                      <Select
                        labelId="question-type-label"
                        value={selectedQuestion.type}
                        label="Question Type"
                        onChange={e => handleUpdateQuestion(selectedQuestion.id, { type: e.target.value as QuestionType })}
                        autoFocus
                        notched
                        sx={{ 
                          '& .MuiSelect-select': { 
                            paddingTop: '14px',
                            paddingBottom: '14px'
                          }
                        }}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                        <MenuItem value="single-choice">Single Choice</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="ranking">Ranking</MenuItem>
                        <MenuItem value="matrix">Matrix</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Question Title"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      sx={{ mb: 3 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedQuestion.required}
                          onChange={e => handleUpdateQuestion(selectedQuestion.id, { required: e.target.checked })}
                        />
                      }
                      label="Required"
                      sx={{ mb: 2 }}
                    />
                    {(selectedQuestion.type === 'multiple-choice' || selectedQuestion.type === 'single-choice') && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Options
                        </Typography>
                        <List>
                          {selectedQuestion.options?.map((option) => (
                            <ListItem key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0, py: 1 }}>
                              <TextField
                                fullWidth
                                value={option.text}
                                onChange={e => handleUpdateOption(selectedQuestion.id, option.id, e.target.value)}
                                inputProps={{ 'data-testid': `option-input-${option.id}` }}
                                size="small"
                              />
                              <IconButton 
                                edge="end" 
                                color="error" 
                                size="small"
                                onClick={() => handleDeleteOption(selectedQuestion.id, option.id)}
                                sx={{
                                  ml: 1,
                                  bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                  '&:hover': {
                                    bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                    borderColor: '#f44336',
                                  }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </ListItem>
                          ))}
                        </List>
                        <Button startIcon={<AddCircle />} onClick={() => handleAddOption(selectedQuestion.id)} sx={{ mt: 1 }}>
                          Add Option
                        </Button>
                      </Box>
                    )}
                    {selectedQuestion.type === 'ranking' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Ranking Criteria
                        </Typography>
                        <List>
                          {selectedQuestion.rankingCriteria?.map((criteria) => (
                            <ListItem key={criteria.id} sx={{ display: 'flex', alignItems: 'stretch', gap: 1, pl: 0, flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <TextField
                                  fullWidth
                                  value={criteria.text}
                                  onChange={e => {
                                    const updatedCriteria = selectedQuestion.rankingCriteria?.map(crit => 
                                      crit.id === criteria.id ? { ...crit, text: e.target.value } : crit
                                    );
                                    handleUpdateRankingCriteria(selectedQuestion.id, criteria.id, { text: e.target.value });
                                  }}
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                                <IconButton 
                                  edge="end" 
                                  color="error" 
                                  size="small"
                                  onClick={() => {
                                    const updatedCriteria = selectedQuestion.rankingCriteria?.filter(crit => crit.id !== criteria.id);
                                    handleDeleteRankingCriteria(selectedQuestion.id, criteria.id);
                                  }}
                                  sx={{
                                    ml: 1,
                                    bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                    border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                    '&:hover': {
                                      bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                      borderColor: '#f44336',
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                              <Box sx={{ width: '100%', pl: 1 }}>
                                <Typography variant="caption" display="block">
                                  Weight: {criteria.weight}
                                </Typography>
                                <Slider
                                  value={criteria.weight}
                                  min={1}
                                  max={5}
                                  step={1}
                                  onChange={(_, value) => {
                                    const updatedCriteria = selectedQuestion.rankingCriteria?.map(crit => 
                                      crit.id === criteria.id ? { ...crit, weight: value as number } : crit
                                    );
                                    handleUpdateRankingCriteria(selectedQuestion.id, criteria.id, { weight: value as number });
                                  }}
                                />
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                        <Button 
                          startIcon={<AddCircle />} 
                          onClick={() => {
                            const newCriteria = { id: uuidv4(), text: 'New Criteria', weight: 3 };
                            const updatedCriteria = [...(selectedQuestion.rankingCriteria || []), newCriteria];
                            handleAddRankingCriteria(selectedQuestion.id);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Add Criteria
                        </Button>
                      </Box>
                    )}
                    {selectedQuestion.type === 'rating' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Rating Scale
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
                          <InputLabel>Scale</InputLabel>
                          <Select
                            value={selectedQuestion.ratingScale || 5}
                            label="Scale"
                            onChange={e => handleUpdateQuestion(selectedQuestion.id, { ratingScale: e.target.value as number })}
                          >
                            <MenuItem value={3}>1-3</MenuItem>
                            <MenuItem value={4}>1-4</MenuItem>
                            <MenuItem value={5}>1-5</MenuItem>
                            <MenuItem value={7}>1-7</MenuItem>
                            <MenuItem value={10}>1-10</MenuItem>
                          </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {[...Array(selectedQuestion.ratingScale || 5)].map((_, i) => (
                            <Button
                              key={i}
                              variant="outlined"
                              sx={{ minWidth: 40 }}
                              disabled
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}
                    {selectedQuestion.type === 'matrix' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Matrix Configuration
                        </Typography>
                        
                        {/* Multiple Choice Toggle */}
                        <FormControlLabel
                          control={
                            <Switch
                              checked={selectedQuestion.matrixConfig?.multipleChoice || false}
                              onChange={e => {
                                const currentConfig = selectedQuestion.matrixConfig || { rows: [], columns: [] };
                                handleMatrixConfigUpdate(selectedQuestion.id, { 
                                  ...currentConfig,
                                  multipleChoice: e.target.checked 
                                });
                              }}
                            />
                          }
                          label="Allow multiple selections per row"
                          sx={{ mb: 2 }}
                        />
                        
                        {/* Rows */}
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Rows
                        </Typography>
                        {selectedQuestion.matrixConfig?.rows?.map((row, rowIndex) => (
                          <Box key={row.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TextField
                              fullWidth
                              value={row.label}
                              onChange={e => {
                                const updatedRows = selectedQuestion.matrixConfig?.rows?.map(r => 
                                  r.id === row.id ? { ...r, label: e.target.value } : r
                                );
                                handleMatrixConfigUpdate(selectedQuestion.id, { rows: updatedRows });
                              }}
                              size="small"
                              placeholder={`Row ${rowIndex + 1}`}
                            />
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                const updatedRows = selectedQuestion.matrixConfig?.rows?.filter(r => r.id !== row.id);
                                handleMatrixConfigUpdate(selectedQuestion.id, { rows: updatedRows });
                              }}
                              sx={{
                                ml: 1,
                                bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                '&:hover': {
                                  bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                  borderColor: '#f44336',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button 
                          startIcon={<AddCircle />} 
                          size="small"
                          onClick={() => {
                            const newRow = { id: uuidv4(), label: 'New Row' };
                            const updatedRows = [...(selectedQuestion.matrixConfig?.rows || []), newRow];
                            handleMatrixConfigUpdate(selectedQuestion.id, { rows: updatedRows });
                          }}
                          sx={{ mb: 2 }}
                        >
                          Add Row
                        </Button>
                        
                        {/* Columns */}
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Columns
                        </Typography>
                        {selectedQuestion.matrixConfig?.columns?.map((col, colIndex) => (
                          <Box key={col.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TextField
                              fullWidth
                              value={col.label}
                              onChange={e => {
                                const updatedColumns = selectedQuestion.matrixConfig?.columns?.map(c => 
                                  c.id === col.id ? { ...c, label: e.target.value } : c
                                );
                                handleMatrixConfigUpdate(selectedQuestion.id, { columns: updatedColumns });
                              }}
                              size="small"
                              placeholder={`Column ${colIndex + 1}`}
                            />
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                const updatedColumns = selectedQuestion.matrixConfig?.columns?.filter(c => c.id !== col.id);
                                handleMatrixConfigUpdate(selectedQuestion.id, { columns: updatedColumns });
                              }}
                              sx={{
                                ml: 1,
                                bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                '&:hover': {
                                  bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                  borderColor: '#f44336',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button 
                          startIcon={<AddCircle />} 
                          size="small"
                          onClick={() => {
                            const newColumn = { id: uuidv4(), label: 'New Column' };
                            const updatedColumns = [...(selectedQuestion.matrixConfig?.columns || []), newColumn];
                            handleMatrixConfigUpdate(selectedQuestion.id, { columns: updatedColumns });
                          }}
                        >
                          Add Column
                        </Button>
                        
                        {/* Matrix Preview */}
                        {selectedQuestion.matrixConfig?.rows && selectedQuestion.matrixConfig?.columns && (
                          <Box sx={{ mt: 2, overflowX: 'auto' }}>
                            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                              Preview:
                            </Typography>
                            <table style={{ borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: 120 }}></th>
                                  {selectedQuestion.matrixConfig.columns.map(col => (
                                    <th key={col.id} style={{ padding: 4, border: '1px solid #e0e0e0', background: '#fafafa', fontSize: 12 }}>
                                      {col.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedQuestion.matrixConfig.rows.map(row => (
                                  <tr key={row.id}>
                                    <td style={{ padding: 4, border: '1px solid #e0e0e0', background: '#fafafa', fontSize: 12 }}>
                                      {row.label}
                                    </td>
                                    {selectedQuestion.matrixConfig?.columns?.map(col => (
                                      <td key={col.id} style={{ padding: 4, border: '1px solid #e0e0e0', textAlign: 'center' }}>
                                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #bbb', display: 'inline-block', bgcolor: '#fff' }} />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  {/* Actions - always visible at bottom, not docked */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 3, 
                    pt: 2, 
                    borderTop: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
                    flexShrink: 0 
                  }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={() => {
                        handleUpdateQuestion(selectedQuestion.id, { title: editTitle, description: editDescription });
                        setEditMode(false);
                        setLastAddedQuestionId(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => {
                        handleDeleteQuestion(selectedQuestion.id);
                        setEditMode(false);
                        setSelectedQuestionId(null);
                        setLastAddedQuestionId(null);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => {
                        const newQuestion = { ...selectedQuestion, id: uuidv4(), title: editTitle + ' (Copy)' };
                        setCurrentQuestions([...getCurrentQuestions(), newQuestion]);
                      }}
                    >
                      Duplicate
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => setEditMode(true)}>
                  {/* Edit icon at top right */}
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      zIndex: 2, 
                      bgcolor: darkMode ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
                      border: darkMode ? '1px solid #444' : '1px solid #e0e0e0',
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(50,50,50,0.9)' : 'rgba(240,240,240,0.9)',
                      }
                    }}
                    onClick={e => { e.stopPropagation(); setEditMode(true); }}
                  >
                    <Edit />
                  </IconButton>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: darkMode ? '#fff' : 'inherit',
                      pr: 6, // Increased padding to avoid edit icon overlap
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.2,
                      overflowWrap: 'break-word',
                    }}
                  >
                    {selectedQuestion.title}
                  </Typography>
                  {selectedQuestion.description && (
                    <Typography variant="subtitle1" color={darkMode ? '#b0b0b0' : 'text.secondary'} sx={{ mb: 3, fontStyle: 'italic' }}>
                      {selectedQuestion.description}
                    </Typography>
                  )}
                  <QuestionInput
                    question={selectedQuestion}
                    value={selectedAnswers[selectedQuestion.id]}
                    onChange={(value) => handleAnswerChange(selectedQuestion.id, value)}
                  />
                </Box>
              )}
            </Box>
          </Box>
        ) : null}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {showCoverScreen ? (
          <CoverScreen
            questionnaire={questionnaire}
            onAccept={handleStartQuestionnaire}
            onDecline={handleDeclineQuestionnaire}
            questions={getQuestionsByAngle(selectedTab)}
          />
        ) : showThankYou ? (
          <ThankYouPage onNewScreener={() => {
            setShowThankYou(false);
            setShowCoverScreen(false);
            setIsAnswering(false);
          }} />
        ) : (
          <Box sx={{ flex: 1, display: 'flex' }}>
            {renderSidebar()}
            {renderMainContent()}
          </Box>
        )}
      </Box>
      <Dialog open={templateModalOpen} onClose={() => setTemplateModalOpen(false)}>
        <DialogTitle>Select a Question Set</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, minWidth: 240 }}>
            <InputLabel id="modal-template-select-label">Template</InputLabel>
            <Select
              labelId="modal-template-select-label"
              value={modalSelectedTemplate}
              label="Template"
              onChange={handleModalTemplateChange}
              autoFocus
            >
              {QUESTION_TEMPLATES.map(t => (
                <MenuItem key={t.label} value={t.label}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setTemplateModalOpen(false); setModalSelectedTemplate(''); }}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={aiModalOpen} onClose={() => setAiModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {showPreview ? 'Preview Generated Questions' : 'Generate Questions with AI'}
        </DialogTitle>
        <DialogContent>
          {!showPreview ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.primary', fontWeight: 500 }}>
                Describe what you want to screen for, and AI will generate a set of questions for you.
              </Typography>
              
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Describe your screener"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                sx={{ mb: 4 }}
                autoFocus
                placeholder="Example: Looking for experienced React developers who have worked with TypeScript and state management libraries like Redux or Zustand"
              />
              
              {/* AI Suggestions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(() => {
                  const prompts = {
                    0: [ // Business
                      "Screen for business stakeholders who understand enterprise software procurement and have budget authority for SaaS solutions",
                      "Identify business leaders who have experience with digital transformation initiatives and vendor evaluation processes", 
                      "Find business decision-makers who are familiar with compliance requirements and security standards for enterprise tools"
                    ],
                    1: [ // Customer
                      "Screen for current AtlasSync users who actively use project management features and have experience with team collaboration tools",
                      "Identify potential customers who currently use competing project management platforms and are considering switching solutions",
                      "Find users who manage remote teams and need advanced reporting and analytics capabilities for project tracking"
                    ],
                    2: [ // Decision Maker
                      "Screen for C-level executives and department heads who make technology purchasing decisions for teams of 10+ people",
                      "Identify IT directors and procurement managers who evaluate and approve new software tools for their organizations",
                      "Find senior managers who have budget responsibility and experience implementing new project management systems"
                    ]
                  };
                  
                  return prompts[selectedTab].map((prompt, index) => (
                    <Button
                      key={index}
                      variant="text"
                      onClick={() => setAiPrompt(prompt)}
                      sx={{ 
                        textAlign: 'left', 
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        py: 1.5,
                        px: 2,
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        color: 'text.secondary',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderColor: 'primary.main',
                          color: 'primary.main'
                        },
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2
                      }}
                    >
                      <AutoAwesome sx={{ fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                      <Box sx={{ textAlign: 'left', flex: 1 }}>
                        {prompt}
                      </Box>
                    </Button>
                  ));
                })()}
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Review and edit the generated questions below. You can delete questions you don't want or modify them before adding to your questionnaire.
              </Typography>
              <Box sx={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden', width: '100%', pr: 2 }}>
                {generatedQuestions.map((question, index) => (
                  <Paper key={question.id} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0', position: 'relative', width: 'calc(100% - 16px)', boxSizing: 'border-box', mr: 2 }}>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteGeneratedQuestion(question.id)}
                      sx={{ 
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        zIndex: 10,
                        bgcolor: darkMode ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
                        border: darkMode ? '1px solid #555' : '1px solid #ddd',
                        boxShadow: 2,
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(100,30,30,0.9)' : 'rgba(255,235,235,0.95)',
                          borderColor: '#f44336',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, pr: 2 }}>
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        Question {index + 1}
                      </Typography>
                    </Box>
                    
                    {/* Question Type Dropdown */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Question Type</InputLabel>
                      <Select
                        value={question.type}
                        label="Question Type"
                        onChange={e => handleEditGeneratedQuestion(question.id, { type: e.target.value as QuestionType })}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                        <MenuItem value="single-choice">Single Choice</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="ranking">Ranking</MenuItem>
                        <MenuItem value="matrix">Matrix</MenuItem>
                      </Select>
                    </FormControl>
                    
                    {/* Question Title */}
                    <TextField
                      fullWidth
                      label="Question Title"
                      value={question.title}
                      onChange={e => handleEditGeneratedQuestion(question.id, { title: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    
                    {/* Description */}
                    <TextField
                      fullWidth
                      label="Description (optional)"
                      value={question.description || ''}
                      onChange={e => handleEditGeneratedQuestion(question.id, { description: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    
                    {/* Required Toggle */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={question.required}
                          onChange={e => handleEditGeneratedQuestion(question.id, { required: e.target.checked })}
                        />
                      }
                      label="Required"
                      sx={{ mb: 2 }}
                    />
                    
                    {/* Question Type Specific Options */}
                    {(question.type === 'multiple-choice' || question.type === 'single-choice') && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Options
                        </Typography>
                        <List>
                          {question.options?.map((option) => (
                            <ListItem key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0, py: 1 }}>
                              <TextField
                                fullWidth
                                value={option.text}
                                onChange={e => {
                                  const updatedOptions = question.options?.map(opt => 
                                    opt.id === option.id ? { ...opt, text: e.target.value } : opt
                                  );
                                  handleEditGeneratedQuestion(question.id, { options: updatedOptions });
                                }}
                                size="small"
                              />
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => {
                                  const updatedOptions = question.options?.filter(opt => opt.id !== option.id);
                                  handleEditGeneratedQuestion(question.id, { options: updatedOptions });
                                }}
                                sx={{
                                  ml: 1,
                                  bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                  border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                  '&:hover': {
                                    bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                    borderColor: '#f44336',
                                  }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </ListItem>
                          ))}
                        </List>
                        <Button 
                          startIcon={<AddCircle />} 
                          onClick={() => {
                            const newOption = { id: uuidv4(), text: 'New Option' };
                            const updatedOptions = [...(question.options || []), newOption];
                            handleEditGeneratedQuestion(question.id, { options: updatedOptions });
                          }}
                          sx={{ mt: 1 }}
                        >
                          Add Option
                        </Button>
                      </Box>
                    )}
                    
                    {question.type === 'ranking' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Ranking Criteria
                        </Typography>
                        <List>
                          {question.rankingCriteria?.map((criteria) => (
                            <ListItem key={criteria.id} sx={{ display: 'flex', alignItems: 'stretch', gap: 1, pl: 0, flexDirection: 'column' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <TextField
                                  fullWidth
                                  value={criteria.text}
                                  onChange={e => {
                                    const updatedCriteria = question.rankingCriteria?.map(crit => 
                                      crit.id === criteria.id ? { ...crit, text: e.target.value } : crit
                                    );
                                    handleEditGeneratedQuestion(question.id, { rankingCriteria: updatedCriteria });
                                  }}
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                                <IconButton 
                                  edge="end" 
                                  color="error" 
                                  size="small"
                                  onClick={() => {
                                    const updatedCriteria = question.rankingCriteria?.filter(crit => crit.id !== criteria.id);
                                    handleDeleteRankingCriteria(question.id, criteria.id);
                                  }}
                                  sx={{
                                    ml: 1,
                                    bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                    border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                    '&:hover': {
                                      bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                      borderColor: '#f44336',
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                              <Box sx={{ width: '100%', pl: 1 }}>
                                <Typography variant="caption" display="block">
                                  Weight: {criteria.weight}
                                </Typography>
                                <Slider
                                  value={criteria.weight}
                                  min={1}
                                  max={5}
                                  step={1}
                                  onChange={(_, value) => {
                                    const updatedCriteria = question.rankingCriteria?.map(crit => 
                                      crit.id === criteria.id ? { ...crit, weight: value as number } : crit
                                    );
                                    handleEditGeneratedQuestion(question.id, { rankingCriteria: updatedCriteria });
                                  }}
                                />
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                        <Button 
                          startIcon={<AddCircle />} 
                          onClick={() => {
                            const newCriteria = { id: uuidv4(), text: 'New Criteria', weight: 3 };
                            const updatedCriteria = [...(question.rankingCriteria || []), newCriteria];
                            handleAddRankingCriteria(question.id);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Add Criteria
                        </Button>
                      </Box>
                    )}
                    
                    {question.type === 'rating' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Rating Scale
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
                          <InputLabel>Scale</InputLabel>
                          <Select
                            value={question.ratingScale || 5}
                            label="Scale"
                            onChange={e => handleEditGeneratedQuestion(question.id, { ratingScale: e.target.value as number })}
                          >
                            <MenuItem value={3}>1-3</MenuItem>
                            <MenuItem value={4}>1-4</MenuItem>
                            <MenuItem value={5}>1-5</MenuItem>
                            <MenuItem value={7}>1-7</MenuItem>
                            <MenuItem value={10}>1-10</MenuItem>
                          </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {[...Array(question.ratingScale || 5)].map((_, i) => (
                            <Button
                              key={i}
                              variant="outlined"
                              sx={{ minWidth: 40 }}
                              disabled
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {question.type === 'matrix' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Matrix Configuration
                        </Typography>
                        
                        {/* Multiple Choice Toggle */}
                        <FormControlLabel
                          control={
                            <Switch
                              checked={question.matrixConfig?.multipleChoice || false}
                              onChange={e => {
                                const currentConfig = question.matrixConfig || { rows: [], columns: [] };
                                handleEditGeneratedQuestion(question.id, { 
                                  matrixConfig: {
                                    ...currentConfig,
                                    multipleChoice: e.target.checked 
                                  }
                                });
                              }}
                            />
                          }
                          label="Allow multiple selections per row"
                          sx={{ mb: 2 }}
                        />
                        
                        {/* Rows */}
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Rows
                        </Typography>
                        {question.matrixConfig?.rows?.map((row, rowIndex) => (
                          <Box key={row.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TextField
                              fullWidth
                              value={row.label}
                              onChange={e => {
                                const updatedRows = question.matrixConfig?.rows?.map(r => 
                                  r.id === row.id ? { ...r, label: e.target.value } : r
                                );
                                handleMatrixConfigUpdate(question.id, { rows: updatedRows });
                              }}
                              size="small"
                              placeholder={`Row ${rowIndex + 1}`}
                            />
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                const updatedRows = question.matrixConfig?.rows?.filter(r => r.id !== row.id);
                                handleMatrixConfigUpdate(question.id, { rows: updatedRows });
                              }}
                              sx={{
                                ml: 1,
                                bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                '&:hover': {
                                  bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                  borderColor: '#f44336',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button 
                          startIcon={<AddCircle />} 
                          size="small"
                          onClick={() => {
                            const newRow = { id: uuidv4(), label: 'New Row' };
                            const updatedRows = [...(question.matrixConfig?.rows || []), newRow];
                            handleMatrixConfigUpdate(question.id, { rows: updatedRows });
                          }}
                          sx={{ mb: 2 }}
                        >
                          Add Row
                        </Button>
                        
                        {/* Columns */}
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Columns
                        </Typography>
                        {question.matrixConfig?.columns?.map((col, colIndex) => (
                          <Box key={col.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TextField
                              fullWidth
                              value={col.label}
                              onChange={e => {
                                const updatedColumns = question.matrixConfig?.columns?.map(c => 
                                  c.id === col.id ? { ...c, label: e.target.value } : c
                                );
                                handleMatrixConfigUpdate(question.id, { columns: updatedColumns });
                              }}
                              size="small"
                              placeholder={`Column ${colIndex + 1}`}
                            />
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                const updatedColumns = question.matrixConfig?.columns?.filter(c => c.id !== col.id);
                                handleMatrixConfigUpdate(question.id, { columns: updatedColumns });
                              }}
                              sx={{
                                ml: 1,
                                bgcolor: darkMode ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
                                border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                '&:hover': {
                                  bgcolor: darkMode ? 'rgba(100,30,30,0.8)' : 'rgba(255,235,235,0.8)',
                                  borderColor: '#f44336',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button 
                          startIcon={<AddCircle />} 
                          size="small"
                          onClick={() => {
                            const newColumn = { id: uuidv4(), label: 'New Column' };
                            const updatedColumns = [...(question.matrixConfig?.columns || []), newColumn];
                            handleMatrixConfigUpdate(question.id, { columns: updatedColumns });
                          }}
                        >
                          Add Column
                        </Button>
                        
                        {/* Matrix Preview */}
                        {question.matrixConfig?.rows && question.matrixConfig?.columns && (
                          <Box sx={{ mt: 2, overflowX: 'auto' }}>
                            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                              Preview:
                            </Typography>
                            <table style={{ borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: 120 }}></th>
                                  {question.matrixConfig.columns.map(col => (
                                    <th key={col.id} style={{ padding: 4, border: '1px solid #e0e0e0', background: '#fafafa', fontSize: 12 }}>
                                      {col.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {question.matrixConfig.rows.map(row => (
                                  <tr key={row.id}>
                                    <td style={{ padding: 4, border: '1px solid #e0e0e0', background: '#fafafa', fontSize: 12 }}>
                                      {row.label}
                                    </td>
                                    {question.matrixConfig?.columns?.map(col => (
                                      <td key={col.id} style={{ padding: 4, border: '1px solid #e0e0e0', textAlign: 'center' }}>
                                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #bbb', display: 'inline-block', bgcolor: '#fff' }} />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
              
              {generatedQuestions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No questions to preview. Please generate some questions first.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ mr: 2, mb: 2 }}>
          {!showPreview ? (
            <>
              <Button onClick={() => setAiModalOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                disabled={!aiPrompt.trim() || isGenerating} 
                onClick={generateQuestionsWithAI}
              >
                {isGenerating ? 'Generating...' : 'Generate Questions'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowPreview(false)}>Back to Edit</Button>
              <Button onClick={() => setAiModalOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                disabled={generatedQuestions.length === 0}
                onClick={handleAddGeneratedQuestions}
              >
                Add {generatedQuestions.length} Questions
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {/* Kebab menu for question actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            // Duplicate question
            const questions = getQuestionsByAngle(selectedTab);
            const question = questions.find(q => q.id === menuQuestionId);
            if (question) {
              const newQuestion = { ...question, id: uuidv4(), title: question.title + ' (Copy)' };
              setCurrentQuestions([...questions, newQuestion]);
            }
            handleMenuClose();
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            // Delete question
            handleDeleteQuestion(menuQuestionId!);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
}

// Helper to get question type display name
const getTypeDisplayName = (type: QuestionType) => {
  switch (type) {
    case 'text':
      return 'Text Input';
    case 'multiple-choice':
      return 'Multiple Choice';
    case 'single-choice':
      return 'Single Choice';
    case 'rating':
      return 'Rating Scale';
    case 'ranking':
      return 'Ranking';
    case 'matrix':
      return 'Matrix';
    default:
      return 'Unknown';
  }
};