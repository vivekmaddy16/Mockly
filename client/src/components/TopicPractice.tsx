'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code2, Database, Cpu, Network, Layers, 
  ChevronDown, ChevronUp, CheckCircle2, Send, Sparkles, 
  Brain, GitBranch, Target, Building2, Server, Terminal, Search, AlertCircle, FileText
} from 'lucide-react';
import { QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';
import { RoadmapView } from '@/components/RoadmapView';
import { DSASheet } from '@/components/DSASheet';
import { useAuth } from '@/context/AuthContext';
import { AuthBlocker } from './AuthBlocker';

interface PracticeQuestionItem {
  q: string;
  expected: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface TopicData {
  icon: React.ReactNode;
  categoryType: 'cs_fundamental' | 'company_prep' | 'role_domain';
  questions: PracticeQuestionItem[];
}

const topicBank: Record<string, TopicData> = {
  'Data Structures & Algorithms': {
    icon: <Code2 className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      { q: 'Explain the difference between a stack and a queue. Provide real-world examples for each.', expected: ['LIFO vs FIFO', 'Stack: undo, recursion call stack', 'Queue: task scheduling, printer queue'], difficulty: 'Easy' },
      { q: 'What is the time complexity of searching in a balanced Binary Search Tree vs. a Hash Table?', expected: ['BST: O(log n)', 'Hash Table: O(1) average', 'Hash collision can be O(n)'], difficulty: 'Medium' },
      { q: 'Describe how dynamic programming works and when to apply it.', expected: ['Overlapping subproblems', 'Optimal substructure', 'Memoization / tabulation'], difficulty: 'Hard' },
      { q: 'Explain Dijkstra\'s algorithm and its limitations.', expected: ['Greedy shortest path', 'Non-negative weights only', 'Time: O(V²) or O(E log V) with priority queue'], difficulty: 'Medium' },
    ],
  },
  'Object-Oriented Programming': {
    icon: <Layers className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      { q: 'What are the four pillars of OOP? Explain each with an example.', expected: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'], difficulty: 'Easy' },
      { q: 'What is the difference between an abstract class and an interface?', expected: ['Abstract class: partial implementation', 'Interface: contract only', 'Multiple inheritance via interface'], difficulty: 'Medium' },
      { q: 'Explain the SOLID principles in software design.', expected: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'], difficulty: 'Hard' },
    ],
  },
  'Database Management (DBMS)': {
    icon: <Database className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      { q: 'What is database normalization? Explain 1NF, 2NF, 3NF with examples.', expected: ['Remove repeating groups (1NF)', 'Remove partial dependencies (2NF)', 'Remove transitive dependencies (3NF)'], difficulty: 'Medium' },
      { q: 'Explain ACID properties in database transactions.', expected: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], difficulty: 'Easy' },
      { q: 'What is the difference between SQL and NoSQL databases? When to use each?', expected: ['Schema vs schemaless', 'Scalability differences', 'Use cases: transactions vs big data'], difficulty: 'Medium' },
    ],
  },
  'Google Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: [
      { q: 'Google Scale: How would you design a distributed crawler that indexes billions of web pages daily, handling deduplication and rate limiting?', expected: ['Distributed hash table for deduplication', 'Robots.txt parsing cache', 'Politeness rate limiter queues', 'DNS cache layers'], difficulty: 'Hard' },
      { q: 'Search Rank: Explain how PageRank operates mathematically and how modern search engines handle link spam.', expected: ['Probability transition matrix', 'Damping factor (usually 0.85)', 'Graph convergence iteration', 'TrustRank / anti-spam nodes'], difficulty: 'Hard' },
      { q: 'Systems: How does Google MapReduce divide computational tasks across clusters?', expected: ['Split input files into chunks', 'Map phase creates key-value pairs', 'Shuffle/sort phase aggregates by key', 'Reduce phase aggregates final results'], difficulty: 'Medium' },
    ],
  },
  'Amazon Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: [
      { q: 'STAR Leadership: Describe a time you demonstrated the "Customer Obsession" principle. How did you work backwards from the customer to design a feature?', expected: ['Work backwards strategy', 'Identifying customer pain points', 'Quantifiable impact metrics (e.g. latency/retention)', 'Trade-off decisions'], difficulty: 'Easy' },
      { q: 'Scale: Design a shopping cart service that maintains high availability during massive traffic spikes (like Prime Day).', expected: ['DynamoDB masterless replication', 'Conflict-free Replicated Data Types (CRDTs)', 'Optimistic locking vs local storage sync', 'Session cache load balancing'], difficulty: 'Hard' },
      { q: 'Operations: How would you architect a secure fulfillment monitoring system utilizing real-time IoT events?', expected: ['Kinesis Streams ingestion', 'AWS Lambda processing', 'SNS alert triggers', 'S3 cold data archival'], difficulty: 'Medium' },
    ],
  },
  'Meta Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: [
      { q: 'Frontend: Explain React Fiber architecture and how the reconciliation engine splits work.', expected: ['Reconciliation vs rendering', 'Work loop yielding (requestIdleCallback)', 'Fiber node structure tree link', 'Priority lanes scheduler'], difficulty: 'Hard' },
      { q: 'Product Design: Architect a real-time notification service for 2 billion active users.', expected: ['Push connection managers (WebSocket/SSE)', 'Redis Pub/Sub message dispatching', 'Graph database user relationships', 'Delivery retries and queuing'], difficulty: 'Hard' },
      { q: 'Infrastructure: Explain how Meta manages distributed cache consistency with Memcached.', expected: ['Look-aside cache model', 'Lease-based cache stampede prevention', 'Regional pool replication', 'Invalidation messages stream'], difficulty: 'Hard' },
    ],
  },
  'Machine Learning & AI': {
    icon: <Brain className="w-5 h-5" />,
    categoryType: 'role_domain',
    questions: [
      { q: 'Model: Explain the difference between bagging and boosting, citing Random Forests and XGBoost.', expected: ['Parallel vs sequential ensemble', 'Reduce variance (bagging) vs bias (boosting)', 'Bootstrap samples (bagging)', 'Gradient descent residuals (boosting)'], difficulty: 'Medium' },
      { q: 'Training: What is the vanishing gradient problem, and how do activation functions like ReLU or architectures like ResNet mitigate it?', expected: ['Chain rule multiplication of small numbers', 'ReLU derivative is 1 for positive inputs', 'ResNet residual connections addition paths', 'Batch normalization'], difficulty: 'Hard' },
      { q: 'Evaluation: How do you evaluate an imbalanced classification model? Compare F1-score, ROC-AUC, and Precision-Recall.', expected: ['Accuracy is misleading', 'Precision vs Recall trade-off', 'F1-score harmonic mean', 'PR-AUC for extreme imbalance'], difficulty: 'Easy' },
    ],
  },
  'DevOps & SRE': {
    icon: <Server className="w-5 h-5" />,
    categoryType: 'role_domain',
    questions: [
      { q: 'Reliability: What is a Circuit Breaker pattern in microservices, and how does it prevent cascading failures?', expected: ['Closed, Open, and Half-Open states', 'Failure rate threshold trigger', 'Fallback responses', 'Timeout settings'], difficulty: 'Medium' },
      { q: 'Scale: Explain how Kubernetes manages horizontal pod autoscaling (HPA) using metrics APIs.', expected: ['Metrics server monitoring CPU/Memory usage', 'Autoscaling algorithm calculation loop', 'Replicas adjustment', 'Cool-down delay intervals'], difficulty: 'Medium' },
      { q: 'CI/CD: Design a zero-downtime deployment pipeline utilizing Blue-Green or Canary strategies.', expected: ['Load balancer weight adjustments', 'Parallel staging environment (Blue-Green)', 'Progressive traffic rollout (Canary)', 'Instant rollback triggers'], difficulty: 'Hard' },
    ],
  }
};

export const TopicPractice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'practice' | 'roadmap' | 'dsa-sheet'>('practice');
  const [selectedCategoryType, setSelectedCategoryType] = useState<'cs_fundamental' | 'company_prep' | 'role_domain'>('cs_fundamental');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<PracticeQuestionItem | null>(null);
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<QuestionEvaluation | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const handleEvaluate = async () => {
    if (!selectedQuestion || !answer.trim()) return;
    setIsEvaluating(true);
    try {
      const qObj = {
        id: `practice-${Date.now()}`,
        type: 'technical' as const,
        category: selectedTopic || 'General',
        questionText: selectedQuestion.q,
        expectedKeyPoints: selectedQuestion.expected,
        difficulty: 'Medium' as const,
      };
      const result = await evaluateAnswer(qObj, answer, selectedTopic || 'Full Stack Developer');
      setEvaluation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

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
          Deep-dive into core Computer Science topics or follow a structured step-by-step interview roadmap path.
        </p>
      </div>

      {/* Tab Selector Pills */}
      <div className="flex justify-center w-full px-2">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-lumen-cream border-2 border-vast-ink">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'practice'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <Target className="w-4 h-4" /> Practice Questions
          </button>

          <button
            onClick={() => setActiveTab('dsa-sheet')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'dsa-sheet'
                ? 'bg-vast-ink text-lumen-cream font-semibold'
                : 'text-vast-ink hover:bg-lumen-stone/50'
            }`}
          >
            <FileText className="w-4 h-4" /> DSA Sheet
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
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
          {/* Bento Search and Category Filter Toolbar */}
          <div className="card-cream p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Buttons */}
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
                    setSelectedQuestion(null);
                    setEvaluation(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border-2 border-vast-ink ${
                    selectedCategoryType === cat.id
                      ? 'bg-vast-ink text-lumen-cream font-semibold'
                      : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Live Search Box */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-vast-ink/50" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search practice topics..."
                className="input-wispr pl-10 py-2 text-xs"
              />
            </div>
          </div>

          {/* Topic Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(topicBank)
              .filter(([topic, data]) => {
                const matchesType = data.categoryType === selectedCategoryType;
                const matchesSearch = topic.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesType && matchesSearch;
              })
              .map(([topic, data]) => {
                const isSelected = selectedTopic === topic;

                return (
                  <div
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setSelectedQuestion(null);
                      setEvaluation(null);
                      setAnswer('');
                    }}
                    className={`p-5 rounded-3xl border-2 border-vast-ink cursor-pointer transition-all ${
                      isSelected ? 'bg-vast-ink text-lumen-cream' : 'bg-lumen-cream text-vast-ink hover:bg-lumen-stone/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                        isSelected ? 'bg-lavender-whisper text-vast-ink' : 'bg-forest-ink text-lumen-cream'
                      }`}>
                        {data.icon}
                      </div>
                      <div>
                        <h3 className="font-garamond font-normal text-lg">{topic}</h3>
                        <span className={`text-xs font-normal ${isSelected ? 'text-lumen-stone' : 'text-fog'}`}>{data.questions.length} Core Questions</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Questions Bank List */}
          {selectedTopic && (
            <div className="soft-card p-7 sm:p-9 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
                <h3 className="font-display font-black text-lg text-charcoal flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-coral" /> Questions: {selectedTopic}
                </h3>

                {/* Difficulty Filters */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-charcoal/10 rounded-full text-[10px] font-black">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                    <button
                      key={diff}
                      onClick={() => {
                        setSelectedDifficulty(diff);
                        setSelectedQuestion(null);
                        setEvaluation(null);
                      }}
                      className={`px-3 py-1 rounded-full cursor-pointer transition ${
                        selectedDifficulty === diff 
                          ? 'bg-charcoal text-cream shadow-sm' 
                          : 'text-charcoal/60 hover:text-charcoal'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List (Filtered by selected difficulty) */}
              <div className="space-y-3">
                {topicBank[selectedTopic].questions
                  .filter(q => selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
                  .map((qObj, idx) => {
                    const isSel = selectedQuestion?.q === qObj.q;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedQuestion(qObj);
                          setEvaluation(null);
                          setAnswer('');
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSel
                            ? 'bg-charcoal text-cream border-charcoal shadow-lg'
                            : 'bg-white text-charcoal border-charcoal/10 hover:bg-cream'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                              qObj.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-800' :
                              qObj.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-900' : 'bg-coral/10 text-coral'
                            }`}>
                              {qObj.difficulty}
                            </span>
                            <span className="text-xs font-bold truncate">{qObj.q}</span>
                          </div>
                          <span className={`text-[10px] font-black shrink-0 ${isSel ? 'text-coral' : 'text-charcoal'}`}>
                            Practice →
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Selected Question Practice Box */}
              {selectedQuestion && (
                <div className="p-6 rounded-3xl bg-white border border-charcoal/10 space-y-4 pt-6 mt-6 shadow-inner">
                  <h4 className="font-display font-black text-base text-charcoal leading-relaxed">{selectedQuestion.q}</h4>

                  {!evaluation ? (
                    <div className="space-y-4">
                      <textarea
                        rows={5}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full px-4 py-3 bg-cream border border-charcoal/10 rounded-2xl text-charcoal text-sm font-medium focus:outline-none focus:border-charcoal"
                      />
                      <button
                        onClick={handleEvaluate}
                        disabled={isEvaluating || !answer.trim()}
                        className="btn-dual-pill disabled:opacity-50"
                      >
                        <div className="icon-badge">
                          <Send className="w-4 h-4 text-charcoal" />
                        </div>
                        <span className="btn-label">{isEvaluating ? 'Evaluating...' : 'Evaluate Answer'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-charcoal text-cream shadow-md">
                        <div className="font-display font-black text-2xl text-coral">{evaluation.score}%</div>
                        <span className="text-xs font-bold text-cream/80">Evaluation generated</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold font-mono">
                        <div className="p-4 bg-cream rounded-2xl border border-charcoal/5">
                          <span className="text-[10px] text-emerald-800 uppercase flex items-center gap-1.5 mb-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Strengths</span>
                          <ul className="space-y-1 text-charcoal/70">
                            {evaluation.positiveHighlights.slice(0, 3).map((pt, i) => <li key={i}>• {pt}</li>)}
                          </ul>
                        </div>
                        <div className="p-4 bg-cream rounded-2xl border border-charcoal/5">
                          <span className="text-[10px] text-coral uppercase flex items-center gap-1.5 mb-1.5"><AlertCircle className="w-3.5 h-3.5" /> Improvements</span>
                          <ul className="space-y-1 text-charcoal/70">
                            {evaluation.areasToImprove.slice(0, 3).map((pt, i) => <li key={i}>• {pt}</li>)}
                          </ul>
                        </div>
                      </div>

                      <p className="text-xs text-charcoal/80 font-medium leading-relaxed bg-cream p-4 rounded-2xl border border-charcoal/10 whitespace-pre-line">
                        <strong>Model Answer Guide:</strong>\n{evaluation.modelAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
