'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code2, Database, Cpu, Network, Layers, 
  ChevronDown, ChevronUp, CheckCircle2, Send, Sparkles, 
  Brain, GitBranch, Target
} from 'lucide-react';
import { QuestionEvaluation } from '@/types';
import { evaluateAnswer } from '@/lib/gemini';
import { RoadmapView } from '@/components/RoadmapView';

const topicBank: Record<string, { icon: React.ReactNode; questions: { q: string; expected: string[] }[] }> = {
  'Data Structures & Algorithms': {
    icon: <Code2 className="w-5 h-5" />,
    questions: [
      { q: 'Explain the difference between a stack and a queue. Provide real-world examples for each.', expected: ['LIFO vs FIFO', 'Stack: undo, recursion call stack', 'Queue: task scheduling, printer queue'] },
      { q: 'What is the time complexity of searching in a balanced Binary Search Tree vs. a Hash Table?', expected: ['BST: O(log n)', 'Hash Table: O(1) average', 'Hash collision can be O(n)'] },
      { q: 'Describe how dynamic programming works and when to apply it.', expected: ['Overlapping subproblems', 'Optimal substructure', 'Memoization / tabulation'] },
      { q: 'Explain Dijkstra\'s algorithm and its limitations.', expected: ['Greedy shortest path', 'Non-negative weights only', 'Time: O(V²) or O(E log V) with priority queue'] },
    ],
  },
  'Object-Oriented Programming': {
    icon: <Layers className="w-5 h-5" />,
    questions: [
      { q: 'What are the four pillars of OOP? Explain each with an example.', expected: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'] },
      { q: 'What is the difference between an abstract class and an interface?', expected: ['Abstract class: partial implementation', 'Interface: contract only', 'Multiple inheritance via interface'] },
      { q: 'Explain the SOLID principles in software design.', expected: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'] },
    ],
  },
  'Database Management (DBMS)': {
    icon: <Database className="w-5 h-5" />,
    questions: [
      { q: 'What is database normalization? Explain 1NF, 2NF, 3NF with examples.', expected: ['Remove repeating groups (1NF)', 'Remove partial dependencies (2NF)', 'Remove transitive dependencies (3NF)'] },
      { q: 'Explain ACID properties in database transactions.', expected: ['Atomicity', 'Consistency', 'Isolation', 'Durability'] },
      { q: 'What is the difference between SQL and NoSQL databases? When to use each?', expected: ['Schema vs schemaless', 'Scalability differences', 'Use cases: transactions vs big data'] },
    ],
  },
  'Operating Systems': {
    icon: <Cpu className="w-5 h-5" />,
    questions: [
      { q: 'What is the difference between a process and a thread?', expected: ['Process: independent, own memory', 'Thread: lightweight, shared memory', 'Context switch cost'] },
      { q: 'Explain deadlock and its four necessary conditions.', expected: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular wait'] },
      { q: 'What is virtual memory and how does paging work?', expected: ['Logical vs physical address', 'Page table', 'Page faults and swapping'] },
    ],
  },
  'Computer Networks': {
    icon: <Network className="w-5 h-5" />,
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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal text-xs font-extrabold shadow-sm">
          <Brain className="w-4 h-4 text-coral" /> CS Fundamentals & Prep Hub
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
          Topic Practice & CS Roadmap
        </h1>
        <p className="text-sm font-bold text-charcoal/60 max-w-xl mx-auto">
          Deep-dive into core Computer Science topics or follow a structured step-by-step interview roadmap path.
        </p>
      </div>

      {/* Castrio Tab Selector Pills */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white border border-charcoal/10 shadow-md">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'practice'
                ? 'bg-charcoal text-cream shadow-md'
                : 'text-charcoal/70 hover:text-charcoal'
            }`}
          >
            <Target className="w-4 h-4" /> Practice Questions
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-charcoal text-cream shadow-md'
                : 'text-charcoal/70 hover:text-charcoal'
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
                  className={`card-cream p-6 border cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-charcoal bg-white shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-charcoal text-cream flex items-center justify-center font-bold shrink-0">
                      {data.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm text-charcoal">{topic}</h3>
                      <span className="text-[10px] text-charcoal/60 font-bold">{data.questions.length} Core Questions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Questions Bank List */}
          {selectedTopic && (
            <div className="card-cream p-7 sm:p-9 space-y-6 border border-white shadow-2xl animate-fade-in">
              <h3 className="font-display font-black text-lg text-charcoal flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-coral" /> Questions: {selectedTopic}
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
                          ? 'bg-charcoal text-cream border-charcoal shadow-lg'
                          : 'bg-white text-charcoal border-charcoal/10 hover:bg-cream'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold">Q{idx + 1}. {qObj.q}</span>
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
                <div className="p-6 rounded-3xl bg-white border border-charcoal/10 space-y-4 pt-6 mt-6">
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
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-charcoal text-cream">
                        <div className="font-display font-black text-2xl text-coral">{evaluation.score}%</div>
                        <span className="text-xs font-bold text-cream/80">Evaluation generated</span>
                      </div>
                      <p className="text-xs text-charcoal/80 font-medium leading-relaxed bg-cream p-4 rounded-2xl border border-charcoal/10 whitespace-pre-line">
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
  );
};
