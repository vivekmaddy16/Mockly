'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Database, Cpu, Network, Layers, 
  CheckCircle2, Sparkles, 
  Brain, GitBranch, Target, Building2, Server, Search, 
  AlertCircle, FileText, Check, X, XCircle, RotateCcw, 
  ArrowRight, ArrowLeft, Lightbulb, RefreshCw, Trophy, Shuffle
} from 'lucide-react';
import { MCQPracticeQuestion, MCQAICoaching } from '@/types';
import { explainMCQWithAI, generateMCQsForTopic } from '@/lib/gemini';
import { allMCQQuestionsByTopic, shuffleQuestions } from '@/data/mcq';
import { RoadmapView } from '@/components/RoadmapView';
import { DSASheet } from '@/components/DSASheet';
import { useAuth } from '@/context/AuthContext';
import { AuthBlocker } from './AuthBlocker';

interface TopicData {
  icon: React.ReactNode;
  categoryType: 'cs_fundamental' | 'company_prep' | 'role_domain';
  questions: MCQPracticeQuestion[];
}

interface QuestionAttempt {
  selectedOption: number;
  isSubmitted: boolean;
  isCorrect: boolean;
}

const initialTopicBank: Record<string, TopicData> = {
  'Data Structures & Algorithms': {
    icon: <Code2 className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Data Structures & Algorithms'] || [])
  },
  'Object-Oriented Programming': {
    icon: <Layers className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Object-Oriented Programming'] || [])
  },
  'Database Management (DBMS)': {
    icon: <Database className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Database Management (DBMS)'] || [])
  },
  'Operating Systems (OS)': {
    icon: <Cpu className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Operating Systems (OS)'] || [])
  },
  'Computer Networks (CN)': {
    icon: <Network className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Computer Networks (CN)'] || [])
  },
  'Google Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Google Prep'] || [])
  },
  'Amazon Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Amazon Prep'] || [])
  },
  'Meta Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Meta Prep'] || [])
  },
  'Machine Learning & AI': {
    icon: <Brain className="w-5 h-5" />,
    categoryType: 'role_domain',
    questions: shuffleQuestions(allMCQQuestionsByTopic['Machine Learning & AI'] || [])
  },
  'DevOps & SRE': {
    icon: <Server className="w-5 h-5" />,
    categoryType: 'role_domain',
    questions: shuffleQuestions(allMCQQuestionsByTopic['DevOps & SRE'] || [])
  }
};

export const TopicPractice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'practice' | 'roadmap' | 'dsa-sheet'>('practice');
  const [selectedCategoryType, setSelectedCategoryType] = useState<'cs_fundamental' | 'company_prep' | 'role_domain'>('cs_fundamental');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Topic and Bank State
  const [topicBank, setTopicBank] = useState<Record<string, TopicData>>(initialTopicBank);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // MCQ Interactive State
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({});
  
  // AI Coaching Deep Dive State
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiCoaching, setAiCoaching] = useState<MCQAICoaching | null>(null);
  const [isLoadingAICoaching, setIsLoadingAICoaching] = useState<boolean>(false);
  
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Active topic questions
  const currentTopicData = selectedTopic ? topicBank[selectedTopic] : null;
  const filteredQuestions = currentTopicData
    ? currentTopicData.questions.filter(q => selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
    : [];

  const currentQuestion: MCQPracticeQuestion | null = 
    filteredQuestions.length > 0 && selectedQuestionIndex < filteredQuestions.length
      ? filteredQuestions[selectedQuestionIndex]
      : (filteredQuestions[0] || null);

  // Randomize the 20 questions freshly each time the topic is selected
  const handleSelectTopic = (topicName: string) => {
    const baseQuestions = allMCQQuestionsByTopic[topicName] || [];
    const randomizedQuestions = shuffleQuestions(baseQuestions);

    setTopicBank(prev => ({
      ...prev,
      [topicName]: {
        ...prev[topicName],
        questions: randomizedQuestions
      }
    }));
    setSelectedTopic(topicName);
    setSelectedQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAiCoaching(null);
  };

  // Re-shuffle current topic questions on demand
  const handleShuffleTopicQuestions = () => {
    if (!selectedTopic) return;
    const baseQuestions = allMCQQuestionsByTopic[selectedTopic] || [];
    const randomizedQuestions = shuffleQuestions(baseQuestions);

    setTopicBank(prev => ({
      ...prev,
      [selectedTopic]: {
        ...prev[selectedTopic],
        questions: randomizedQuestions
      }
    }));
    setSelectedQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAiCoaching(null);
  };

  // Sync selection when switching question
  const handleSelectQuestion = (idx: number, q: MCQPracticeQuestion) => {
    setSelectedQuestionIndex(idx);
    setAiCoaching(null);
    const existingAttempt = attempts[q.id];
    if (existingAttempt) {
      setSelectedOption(existingAttempt.selectedOption);
      setIsSubmitted(existingAttempt.isSubmitted);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  // Option selection
  const handleOptionClick = (optionIdx: number) => {
    if (isSubmitted) return; // Prevent changing after submission until retried
    setSelectedOption(optionIdx);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion || selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsSubmitted(true);
    setAttempts(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOption,
        isSubmitted: true,
        isCorrect
      }
    }));
  };

  // Reset / Retry Current Question
  const handleRetryQuestion = () => {
    if (!currentQuestion) return;
    setIsSubmitted(false);
    setSelectedOption(null);
    setAiCoaching(null);
    setAttempts(prev => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Navigate to Next Question
  const handleNextQuestion = () => {
    if (selectedQuestionIndex < filteredQuestions.length - 1) {
      const nextIdx = selectedQuestionIndex + 1;
      handleSelectQuestion(nextIdx, filteredQuestions[nextIdx]);
    }
  };

  // Navigate to Previous Question
  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      const prevIdx = selectedQuestionIndex - 1;
      handleSelectQuestion(prevIdx, filteredQuestions[prevIdx]);
    }
  };

  // Reset Topic Progress
  const handleResetTopicProgress = () => {
    if (!currentTopicData) return;
    const idsToClear = new Set(currentTopicData.questions.map(q => q.id));
    setAttempts(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (idsToClear.has(k)) delete next[k];
      });
      return next;
    });
    setSelectedOption(null);
    setIsSubmitted(false);
    setAiCoaching(null);
  };

  // AI Deep Dive explanation
  const handleAskAICoaching = async () => {
    if (!currentQuestion || !selectedTopic) return;
    setIsLoadingAICoaching(true);
    try {
      const coaching = await explainMCQWithAI(
        selectedTopic,
        currentQuestion,
        selectedOption ?? undefined
      );
      setAiCoaching(coaching);
    } catch (e) {
      console.error('Failed to get AI coaching:', e);
    } finally {
      setIsLoadingAICoaching(false);
    }
  };

  // AI Generate More MCQs
  const handleGenerateMoreQuestions = async () => {
    if (!selectedTopic || isGeneratingAI) return;
    setIsGeneratingAI(true);
    try {
      const newQuestions = await generateMCQsForTopic(
        selectedTopic,
        selectedDifficulty === 'All' ? 'Medium' : selectedDifficulty,
        2
      );
      if (newQuestions.length > 0) {
        setTopicBank(prev => ({
          ...prev,
          [selectedTopic]: {
            ...prev[selectedTopic],
            questions: [...prev[selectedTopic].questions, ...newQuestions]
          }
        }));
      }
    } catch (e) {
      console.error('Failed to generate dynamic questions:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Compute topic stats
  const topicStats = React.useMemo(() => {
    if (!currentTopicData) return { total: 0, attempted: 0, correct: 0, scorePercent: 0 };
    const total = currentTopicData.questions.length;
    let attempted = 0;
    let correct = 0;
    currentTopicData.questions.forEach(q => {
      const att = attempts[q.id];
      if (att && att.isSubmitted) {
        attempted++;
        if (att.isCorrect) correct++;
      }
    });
    const scorePercent = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    return { total, attempted, correct, scorePercent };
  }, [currentTopicData, attempts]);

  // Authentication Gate
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthBlocker
        title="Topic Practice Hub Locked"
        description="You must be signed in to access the topic practice and roadmap hub. Sign in or register below to start mastering CS fundamentals."
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Header */}
      <div className="card-cream text-center space-y-3">
        <div className="badge-teal mx-auto">
          <Brain className="w-4 h-4 text-lavender-whisper" /> CS Fundamentals & Prep Hub
        </div>
        <h1 className="font-garamond font-normal text-4xl sm:text-6xl text-vast-ink tracking-tight">
          Topic Practice & CS Roadmap
        </h1>
        <p className="text-base text-vast-ink/75 max-w-xl mx-auto font-normal">
          Master core Computer Science fundamentals, FAANG technical screens, and engineering domains with interactive multiple-choice practice.
        </p>
      </div>

      {/* Tab Selector Pills */}
      <div className="flex justify-center w-full px-2">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-lumen-cream border-2 border-vast-ink shadow-sm">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <Target className="w-4 h-4" /> MCQ Practice
          </button>

          <button
            onClick={() => setActiveTab('dsa-sheet')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dsa-sheet'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <FileText className="w-4 h-4" /> DSA Sheet
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <GitBranch className="w-4 h-4" /> CS Roadmap Tree
          </button>
        </div>
      </div>

      {/* Render Tab Content */}
      {activeTab === 'roadmap' ? (
        <RoadmapView />
      ) : activeTab === 'dsa-sheet' ? (
        <DSASheet />
      ) : (
        <div className="space-y-6">
          {/* Category Filter Toolbar & Search */}
          <div className="card-cream p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { id: 'cs_fundamental', label: 'CS Fundamentals' },
                { id: 'company_prep', label: 'Company Spec Prep' },
                { id: 'role_domain', label: 'Specialized Domains' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryType(cat.id as any);
                    setSelectedTopic(null);
                    setSelectedOption(null);
                    setIsSubmitted(false);
                    setAiCoaching(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border-2 border-vast-ink ${
                    selectedCategoryType === cat.id
                      ? 'bg-vast-ink text-lumen-cream font-semibold shadow-sm'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-vast-ink/50" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search practice topics..."
                className="input-wispr pl-10 py-2 text-xs w-full"
              />
            </div>
          </div>

          {/* Topic Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(topicBank)
              .filter(([topic, data]) => {
                const matchesType = data.categoryType === selectedCategoryType;
                const matchesSearch = topic.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesType && matchesSearch;
              })
              .map(([topic, data]) => {
                const isSelected = selectedTopic === topic;
                const completedInTopic = data.questions.filter(q => attempts[q.id]?.isSubmitted).length;

                return (
                  <div
                    key={topic}
                    onClick={() => handleSelectTopic(topic)}
                    className={`p-5 rounded-3xl border-2 border-vast-ink cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                      isSelected 
                        ? 'bg-vast-ink text-lumen-cream shadow-md' 
                        : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                        isSelected ? 'bg-lavender-whisper text-vast-ink' : 'bg-forest-ink text-lumen-cream'
                      }`}>
                        {data.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-garamond font-normal text-lg truncate">{topic}</h3>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className={`text-xs font-normal ${isSelected ? 'text-lumen-stone' : 'text-fog'}`}>
                            {data.questions.length} Questions
                          </span>
                          {completedInTopic > 0 && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-lavender-whisper/20 text-lavender-whisper' : 'bg-forest-ink/10 text-forest-ink'
                            }`}>
                              {completedInTopic}/{data.questions.length} Done
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Questions Bank & MCQ Workspace */}
          {selectedTopic && currentTopicData && (
            <div className="card-cream p-6 sm:p-8 space-y-6 animate-fade-in border-2 border-vast-ink">
              
              {/* Topic Header with Score & Difficulty Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-vast-ink/10 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-forest-ink text-lumen-cream">
                      {currentTopicData.icon}
                    </span>
                    <div>
                      <h3 className="font-garamond font-normal text-2xl text-vast-ink">
                        {selectedTopic}
                      </h3>
                      <p className="text-xs text-vast-ink/70">
                        Interactive Multiple-Choice Technical Screen
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Summary & Difficulty Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Topic Progress Badge */}
                  {topicStats.attempted > 0 && (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-ink/10 text-forest-ink text-xs font-semibold border border-forest-ink/20">
                      <Trophy className="w-3.5 h-3.5 text-forest-ink" />
                      <span>{topicStats.correct}/{topicStats.attempted} Correct ({topicStats.scorePercent}%)</span>
                    </div>
                  )}

                  {/* Difficulty Filters */}
                  <div className="inline-flex items-center gap-1 p-1 bg-lumen-cream border-2 border-vast-ink rounded-full text-xs font-semibold">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                      <button
                        key={diff}
                        onClick={() => {
                          setSelectedDifficulty(diff);
                          setSelectedQuestionIndex(0);
                          setSelectedOption(null);
                          setIsSubmitted(false);
                          setAiCoaching(null);
                        }}
                        className={`px-3 py-1 rounded-full cursor-pointer transition ${
                          selectedDifficulty === diff 
                            ? 'bg-vast-ink text-lumen-cream font-semibold shadow-sm' 
                            : 'text-vast-ink/70 hover:text-vast-ink'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>

                  {/* Random Shuffle Mix Button */}
                  <button
                    onClick={handleShuffleTopicQuestions}
                    className="px-3 py-1.5 rounded-full bg-lumen-cream border-2 border-vast-ink text-vast-ink hover:bg-lumen-stone/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                    title="Randomly shuffle questions in this topic"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-vast-ink" />
                    <span>Shuffle Mix</span>
                  </button>

                  {/* Generate More with AI */}
                  <button
                    onClick={handleGenerateMoreQuestions}
                    disabled={isGeneratingAI}
                    className="px-3.5 py-1.5 rounded-full bg-vast-ink text-lumen-cream hover:bg-vast-ink/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                    title="Generate 2 new MCQs using AI for this topic"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-lavender-whisper ${isGeneratingAI ? 'animate-spin' : ''}`} />
                    {isGeneratingAI ? 'Generating...' : '+ AI MCQs'}
                  </button>

                  {/* Reset Progress Button */}
                  {topicStats.attempted > 0 && (
                    <button
                      onClick={handleResetTopicProgress}
                      className="p-1.5 rounded-full text-vast-ink/60 hover:text-vast-ink hover:bg-lumen-stone/50 transition cursor-pointer"
                      title="Reset topic answers"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Navigator Horizontal Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-vast-ink/70">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Select Question:</span>
                  <span>{filteredQuestions.length} questions available</span>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {filteredQuestions.map((q, idx) => {
                    const isCurrent = currentQuestion?.id === q.id;
                    const attempt = attempts[q.id];

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleSelectQuestion(idx, q)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all border cursor-pointer ${
                          isCurrent
                            ? 'bg-vast-ink text-lumen-cream border-vast-ink shadow-sm'
                            : 'bg-lumen-cream text-vast-ink border-vast-ink/20 hover:border-vast-ink'
                        }`}
                      >
                        <span>Q{idx + 1}</span>
                        {attempt && attempt.isSubmitted && (
                          attempt.isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          )
                        )}
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${
                          q.difficulty === 'Easy' 
                            ? 'bg-emerald-500/15 text-emerald-800' 
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/15 text-amber-900'
                            : 'bg-rose-500/15 text-rose-800'
                        }`}>
                          {q.difficulty}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Question Workspace */}
              {currentQuestion ? (
                <div className="p-6 sm:p-7 rounded-3xl bg-lumen-cream border-2 border-vast-ink space-y-6 shadow-sm">
                  
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-vast-ink/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-vast-ink text-lumen-cream text-xs font-bold">
                        Question {selectedQuestionIndex + 1} of {filteredQuestions.length}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        currentQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-800' :
                        currentQuestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-900' : 'bg-rose-500/20 text-rose-800'
                      }`}>
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {isSubmitted && (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        attempts[currentQuestion.id]?.isCorrect
                          ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-800 border border-rose-500/30'
                      }`}>
                        {attempts[currentQuestion.id]?.isCorrect ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Correct
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question Prompt Text */}
                  <h4 className="font-garamond text-xl sm:text-2xl text-vast-ink font-normal leading-snug">
                    {currentQuestion.q}
                  </h4>

                  {/* Optional Code Snippet */}
                  {currentQuestion.codeSnippet && (
                    <div className="p-4 rounded-2xl bg-vast-ink text-lavender-whisper font-mono text-xs overflow-x-auto border border-vast-ink/30">
                      <pre>{currentQuestion.codeSnippet}</pre>
                    </div>
                  )}

                  {/* 4 Interactive MCQ Option Cards */}
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options.map((optionText, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isSelected = selectedOption === optIdx;
                      const isCorrectAnswer = optIdx === currentQuestion.correctAnswer;
                      
                      let cardStyle = 'border-vast-ink/20 hover:border-vast-ink hover:bg-lumen-stone/20 bg-lumen-cream text-vast-ink';
                      let letterBadgeStyle = 'bg-vast-ink/10 text-vast-ink';

                      if (isSubmitted) {
                        if (isCorrectAnswer) {
                          // Highlight correct answer in green
                          cardStyle = 'border-2 border-emerald-600 bg-emerald-500/10 text-vast-ink shadow-sm';
                          letterBadgeStyle = 'bg-emerald-600 text-white font-bold';
                        } else if (isSelected && !isCorrectAnswer) {
                          // Highlight wrong selected choice in red
                          cardStyle = 'border-2 border-rose-600 bg-rose-500/10 text-vast-ink';
                          letterBadgeStyle = 'bg-rose-600 text-white font-bold';
                        } else {
                          cardStyle = 'border-vast-ink/10 opacity-50 bg-lumen-cream text-vast-ink/70';
                          letterBadgeStyle = 'bg-vast-ink/5 text-vast-ink/40';
                        }
                      } else if (isSelected) {
                        // Selected prior to submit
                        cardStyle = 'border-2 border-vast-ink bg-vast-ink/5 shadow-sm text-vast-ink font-medium';
                        letterBadgeStyle = 'bg-vast-ink text-lumen-cream font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleOptionClick(optIdx)}
                          className={`p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${cardStyle}`}
                        >
                          {/* Option Badge A, B, C, D */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${letterBadgeStyle}`}>
                            {isSubmitted && isCorrectAnswer ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : isSubmitted && isSelected && !isCorrectAnswer ? (
                              <X className="w-4 h-4 text-white" />
                            ) : (
                              letter
                            )}
                          </div>

                          {/* Option Text */}
                          <div className="flex-1 text-sm leading-relaxed pt-0.5">
                            {optionText}
                          </div>

                          {/* Post-submit indicator badges */}
                          {isSubmitted && isCorrectAnswer && (
                            <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                              Correct Answer
                            </span>
                          )}
                          {isSubmitted && isSelected && !isCorrectAnswer && (
                            <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-500/20 px-2 py-0.5 rounded-full shrink-0">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions & Navigation Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-vast-ink/10">
                    <div className="flex items-center gap-2">
                      {!isSubmitted ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null}
                          className="px-6 py-2.5 rounded-full bg-vast-ink text-lumen-cream hover:bg-vast-ink/90 font-semibold text-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleRetryQuestion}
                          className="px-5 py-2.5 rounded-full bg-lumen-cream text-vast-ink border-2 border-vast-ink hover:bg-lumen-stone/50 font-semibold text-xs transition cursor-pointer flex items-center gap-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Retry Question
                        </button>
                      )}
                    </div>

                    {/* Question Navigation */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevQuestion}
                        disabled={selectedQuestionIndex === 0}
                        className="p-2.5 rounded-full border-2 border-vast-ink bg-lumen-cream hover:bg-lumen-stone/50 text-vast-ink transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous Question"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        disabled={selectedQuestionIndex >= filteredQuestions.length - 1}
                        className="px-5 py-2.5 rounded-full border-2 border-vast-ink bg-vast-ink text-lumen-cream hover:bg-vast-ink/90 font-semibold text-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next Question <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Explanation & Conceptual Breakdown Card (Appears after submission) */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4 pt-4"
                      >
                        {/* Status Callout Banner */}
                        <div className={`p-4.5 rounded-2xl border-2 flex items-start gap-3.5 ${
                          attempts[currentQuestion.id]?.isCorrect
                            ? 'bg-emerald-500/10 border-emerald-600/30 text-emerald-950'
                            : 'bg-rose-500/10 border-rose-600/30 text-rose-950'
                        }`}>
                          {attempts[currentQuestion.id]?.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <h5 className="font-bold text-sm">
                              {attempts[currentQuestion.id]?.isCorrect 
                                ? '🎉 Correct! Well done.' 
                                : '💡 Not quite! Take a close look at the concept breakdown below.'}
                            </h5>
                            <p className="text-xs leading-relaxed text-vast-ink/80">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        </div>

                        {/* AI Deep Dive Coach Button & Result */}
                        <div className="p-5 rounded-2xl bg-white border-2 border-vast-ink/15 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-forest-ink" />
                              <span className="font-garamond text-lg font-normal text-vast-ink">
                                AI Interview Coach Breakdown
                              </span>
                            </div>

                            {!aiCoaching && (
                              <button
                                onClick={handleAskAICoaching}
                                disabled={isLoadingAICoaching}
                                className="px-4 py-2 rounded-full bg-forest-ink text-lumen-cream hover:bg-forest-ink/90 text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition"
                              >
                                {isLoadingAICoaching ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing with AI...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-lavender-whisper" /> Ask AI to Explain Deeper
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* AI Coaching Content */}
                          {aiCoaching && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3 pt-2 text-xs text-vast-ink/85 border-t border-vast-ink/10"
                            >
                              <div className="p-3.5 rounded-xl bg-lumen-stone/30 border border-vast-ink/10">
                                <span className="font-bold uppercase text-[10px] text-forest-ink tracking-wider block mb-1">
                                  System & Conceptual Deep Dive
                                </span>
                                <p className="leading-relaxed">{aiCoaching.deepDive}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-xl bg-lavender-whisper/30 border border-vast-ink/10">
                                  <span className="font-bold uppercase text-[10px] text-vast-ink tracking-wider block mb-1">
                                    🎯 FAANG Interview Tips
                                  </span>
                                  <ul className="space-y-1 list-disc list-inside text-vast-ink/80">
                                    {aiCoaching.interviewTips.map((tip, i) => (
                                      <li key={i}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                  <span className="font-bold uppercase text-[10px] text-amber-900 tracking-wider block mb-1">
                                    ⚠️ Common Candidate Trap
                                  </span>
                                  <p className="leading-relaxed text-amber-950">{aiCoaching.commonTrap}</p>
                                </div>
                              </div>

                              {aiCoaching.realWorldAnalogy && (
                                <div className="p-3 rounded-xl bg-forest-ink/5 border border-forest-ink/15 flex items-start gap-2 text-forest-ink">
                                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                                  <p className="text-xs italic">
                                    <strong>Analogy:</strong> {aiCoaching.realWorldAnalogy}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-12 text-center text-vast-ink/60 border-2 border-dashed border-vast-ink/20 rounded-3xl">
                  <p>No questions found matching the selected difficulty level.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
