'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code2, Database, Cpu, Network, Layers, 
  ChevronDown, ChevronUp, CheckCircle2, Send, Sparkles, 
  AlertTriangle, Brain
} from 'lucide-react';
import { QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';

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
    color: 'text-cyan-400',
    cardClass: 'card-gradient-teal',
    iconClass: 'icon-box-teal',
    questions: [
      { q: 'Explain the OSI model layers and their functions.', expected: ['Physical, Data Link, Network, Transport, Session, Presentation, Application', 'Each layer role'] },
      { q: 'What is the difference between TCP and UDP?', expected: ['Connection-oriented vs connectionless', 'Reliability vs speed', 'Use cases: HTTP vs streaming'] },
      { q: 'How does DNS resolution work? Walk through a request.', expected: ['Browser cache → OS cache → Recursive resolver', 'Root → TLD → Authoritative', 'A record / CNAME'] },
    ],
  },
};

export const TopicPractice: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeQIdx, setActiveQIdx] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<QuestionEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleTopicClick = (name: string) => {
    setActiveTopic(activeTopic === name ? null : name);
    setActiveQIdx(null); setEvaluation(null); setUserAnswer('');
  };

  const handleSelectQ = (idx: number) => {
    setActiveQIdx(activeQIdx === idx ? null : idx);
    setEvaluation(null); setUserAnswer('');
  };

  const handleSubmit = async () => {
    if (!activeTopic || activeQIdx === null || !userAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const tq = topicBank[activeTopic].questions[activeQIdx];
      const result = await evaluateAnswer(
        { id: `tp_${Date.now()}`, type: 'cs_fundamental', questionText: tq.q, category: 'Technical', difficulty: 'Medium', expectedKeyPoints: tq.expected },
        userAnswer, 'CS Fundamentals'
      );
      setEvaluation(result);
    } catch (e) { console.error(e); }
    finally { setIsEvaluating(false); }
  };

  return (
    <div className="page-glow relative">
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 text-xs font-semibold">
            <Brain className="w-4 h-4 text-purple-400" /> CS Fundamentals Practice Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Topic-wise <span className="text-gradient-gold">Practice</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Master core Computer Science fundamentals with AI-graded practice questions across 5 essential topics.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="space-y-4">
          {Object.entries(topicBank).map(([name, topic]) => {
            const isOpen = activeTopic === name;
            return (
              <div key={name} className="overflow-hidden rounded-2xl border border-transparent transition-all">
                <button onClick={() => handleTopicClick(name)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 transition rounded-2xl ${
                    isOpen ? `${topic.cardClass}` : 'card-dark hover:border-neutral-700'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`icon-box ${topic.iconClass}`}>{topic.icon}</div>
                    <div>
                      <h3 className="text-base font-bold text-white">{name}</h3>
                      <p className="text-xs text-neutral-500">{topic.questions.length} questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 space-y-3 bg-dark-card rounded-b-2xl border-t border-neutral-800/60">
                        {topic.questions.map((tq, idx) => (
                          <div key={idx}>
                            <button onClick={() => handleSelectQ(idx)}
                              className={`w-full text-left p-4 rounded-xl border transition ${
                                activeQIdx === idx ? 'bg-brand-500/10 border-brand-500/20 text-brand-200' : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                              }`}>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium">{tq.q}</span>
                                <span className="px-2 py-0.5 rounded-lg bg-neutral-900 text-neutral-500 text-[10px] font-bold shrink-0">
                                  Q{idx+1}
                                </span>
                              </div>
                            </button>

                            <AnimatePresence>
                              {activeQIdx === idx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 p-5 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-4">
                                    <textarea rows={5} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                                      placeholder="Type your answer here..."
                                      className="w-full px-4 py-3 bg-[#141414] border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-brand-500/40 transition placeholder:text-neutral-600 resize-none font-mono"
                                    />
                                    <button onClick={handleSubmit} disabled={isEvaluating || !userAnswer.trim()}
                                      className="btn-yellow text-xs px-5 py-2.5 inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                                      {isEvaluating ? <><div className="w-3.5 h-3.5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin" /> Evaluating</>
                                      : <><Send className="w-3.5 h-3.5" /> Submit</>}
                                    </button>

                                    {evaluation && (
                                      <div className="space-y-3 animate-fade-in text-xs">
                                        <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
                                          <span className={`px-3 py-1.5 rounded-xl border font-bold ${
                                            evaluation.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : evaluation.score >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                          }`}>{evaluation.score}%</span>
                                          <span className="text-neutral-400">{evaluation.feedback}</span>
                                        </div>

                                        {/* Strengths & Improvements */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                            <span className="font-bold text-emerald-400 text-[10px] uppercase tracking-widest block mb-1.5">
                                              <CheckCircle2 className="w-3 h-3 inline mr-1" />Strengths
                                            </span>
                                            <ul className="space-y-1 text-neutral-400">
                                              {evaluation.positiveHighlights.map((pt, i) => (
                                                <li key={i} className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">•</span>{pt}</li>
                                              ))}
                                            </ul>
                                          </div>
                                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                            <span className="font-bold text-amber-400 text-[10px] uppercase tracking-widest block mb-1.5">
                                              <AlertTriangle className="w-3 h-3 inline mr-1" />Improve
                                            </span>
                                            <ul className="space-y-1 text-neutral-400">
                                              {evaluation.areasToImprove.map((pt, i) => (
                                                <li key={i} className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">•</span>{pt}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                                          <span className="font-bold text-brand-400 text-[10px] uppercase tracking-widest block mb-1"><Sparkles className="w-3 h-3 inline mr-1" />Model Answer</span>
                                          <p className="text-neutral-400 font-mono whitespace-pre-line">{evaluation.modelAnswer}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
