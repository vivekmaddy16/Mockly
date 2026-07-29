'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code2, Database, Cpu, Network, Layers, 
  ChevronDown, ChevronUp, CheckCircle2, Send, Sparkles, 
  AlertTriangle, Brain, GitBranch, Target
} from 'lucide-react';
import { QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';
import { RoadmapView } from '@/components/RoadmapView';

const topicBank: Record<string, { icon: React.ReactNode; color: string; cardClass: string; iconClass: string; questions: { q: string; expected: string[] }[] }> = {
  'Data Structures & Algorithms': {
    icon: <Code2 className="w-5 h-5" />,
    color: 'text-blue-400',
    cardClass: 'card-gradient-blue',
    iconClass: 'icon-box-blue',
    questions: [
      { q: 'Explain the difference between a stack and a queue. Provide real-world examples for each.', expected: ['LIFO vs FIFO', 'Stack: undo, recursion call stack', 'Queue: task scheduling, printer queue'] },
      { q: 'What is the time complexity of searching in a balanced Binary Search Tree vs. a Hash Table?', expected: ['BST: O(log n)', 'Hash Table: O(1) average', 'Hash collision can be O(n)'] },
      { q: 'Describe how dynamic programming works and when to apply it.', expected: ['Overlapping subproblems', 'Optimal substructure', 'Memoization / tabulation'] },
      { q: 'Explain Dijkstra\'s algorithm and its limitations.', expected: ['Greedy shortest path', 'Non-negative weights only', 'Time: O(V²) or O(E log V) with priority queue'] },
    ],
  },
  'Object-Oriented Programming': {
    icon: <Layers className="w-5 h-5" />,
    color: 'text-purple-400',
    cardClass: 'card-gradient-purple',
    iconClass: 'icon-box-purple',
    questions: [
      { q: 'What are the four pillars of OOP? Explain each with an example.', expected: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'] },
      { q: 'What is the difference between an abstract class and an interface?', expected: ['Abstract class: partial implementation', 'Interface: contract only', 'Multiple inheritance via interface'] },
      { q: 'Explain the SOLID principles in software design.', expected: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'] },
    ],
  },
  'Database Management (DBMS)': {
    icon: <Database className="w-5 h-5" />,
    color: 'text-emerald-400',
    cardClass: 'card-gradient-green',
    iconClass: 'icon-box-green',
    questions: [
      { q: 'What is database normalization? Explain 1NF, 2NF, 3NF with examples.', expected: ['Remove repeating groups (1NF)', 'Remove partial dependencies (2NF)', 'Remove transitive dependencies (3NF)'] },
      { q: 'Explain ACID properties in database transactions.', expected: ['Atomicity', 'Consistency', 'Isolation', 'Durability'] },
      { q: 'What is the difference between SQL and NoSQL databases? When to use each?', expected: ['Schema vs schemaless', 'Scalability differences', 'Use cases: transactions vs big data'] },
    ],
  },
  'Operating Systems': {
    icon: <Cpu className="w-5 h-5" />,
    color: 'text-amber-400',
    cardClass: 'card-gradient-yellow',
    iconClass: 'icon-box-yellow',
    questions: [
      { q: 'What is the difference between a process and a thread?', expected: ['Process: independent, own memory', 'Thread: lightweight, shared memory', 'Context switch cost'] },
      { q: 'Explain deadlock and its four necessary conditions.', expected: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular wait'] },
      { q: 'What is virtual memory and how does paging work?', expected: ['Logical vs physical address', 'Page table', 'Page faults and swapping'] },
    ],
  },
  'Computer Networks': {
    icon: <Network className="w-5 h-5" />,
    color: 'text-rose-400',
    cardClass: 'card-gradient-red',
    iconClass: 'icon-box-red',
    questions: [
      { q: 'Walk step-by-step through what happens when you type a URL into a browser.', expected: ['DNS resolution', 'TCP 3-way handshake', 'TLS handshake', 'HTTP GET request', 'DOM rendering'] },
      { q: 'Compare TCP and UDP. Provide ideal use cases for each.', expected: ['TCP: reliable, ordered, connection-oriented', 'UDP: fast, connectionless, video/gaming', 'Flow & congestion control'] },
      { q: 'What is the OSI model? Briefly state the purpose of each layer.', expected: ['7 layers: Physical to Application', 'PDU at each layer', 'Encapsulation / Decapsulation'] },
    ],
  },
};

export const TopicPractice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'practice' | 'roadmap'>('practice');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<{ q: string; expected: string[] } | null>(null);
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<QuestionEvaluation | null>(null);

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

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-300 text-xs font-extrabold uppercase tracking-wide">
            <Brain className="w-4 h-4 text-brand-400" /> CS Fundamentals & Prep Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Targeted <span className="text-gradient-gold">Topic Practice & Roadmap</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Deep-dive into core Computer Science topics or follow a structured step-by-step interview roadmap path.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'practice'
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" /> Practice Questions
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'roadmap'
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" /> CS Roadmap Tree
            </button>
          </div>
        </div>

        {/* Render Tab Content */}
        {activeTab === 'roadmap' ? (
          <RoadmapView />
        ) : (
          <div className="space-y-6">
            {/* Topic Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(topicBank).map(([topic, data]) => {
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
                    className={`${data.cardClass} rounded-3xl p-5 border border-white/10 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-brand-400 scale-[1.02] shadow-2xl' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={data.iconClass}>{data.icon}</div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white">{topic}</h3>
                        <span className="text-[10px] text-neutral-400 font-bold">{data.questions.length} Core Questions</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Questions Bank List */}
            {selectedTopic && (
              <div className="card-dark rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl animate-fade-in">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-400" /> Questions: {selectedTopic}
                </h3>

                <div className="space-y-3">
                  {topicBank[selectedTopic].questions.map((qObj, idx) => {
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
                            ? 'bg-neutral-900 border-brand-500/50 shadow-lg shadow-brand-500/10'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-bold text-neutral-200">Q{idx + 1}. {qObj.q}</span>
                          <span className="text-[10px] font-extrabold text-brand-400 shrink-0">Practice →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Question Practice Box */}
                {selectedQuestion && (
                  <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 pt-6 mt-6">
                    <h4 className="text-sm font-extrabold text-white leading-relaxed">{selectedQuestion.q}</h4>

                    {!evaluation ? (
                      <div className="space-y-4">
                        <textarea
                          rows={5}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your response here..."
                          className="w-full px-4 py-3 bg-black/60 border border-neutral-800 rounded-2xl text-neutral-100 text-sm focus:outline-none focus:border-brand-500/50 font-mono"
                        />
                        <button
                          onClick={handleEvaluate}
                          disabled={isEvaluating || !answer.trim()}
                          className="btn-yellow text-xs px-6 py-3 font-bold inline-flex items-center gap-2 disabled:opacity-50"
                        >
                          {isEvaluating ? 'Evaluating...' : <><Send className="w-4 h-4" /> Evaluate Response</>}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                          <div className="text-2xl font-black text-brand-300">{evaluation.score}%</div>
                          <span className="text-xs text-neutral-300 font-bold">Feedback generated</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-mono whitespace-pre-line bg-black/40 p-4 rounded-xl border border-neutral-800">
                          {evaluation.modelAnswer}
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
    </div>
  );
};
