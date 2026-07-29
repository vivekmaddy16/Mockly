'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, CheckCircle2, Circle, Clock, BookOpen, Layers, 
  Sparkles, ExternalLink, ChevronRight, Check, X, ShieldAlert, Award
} from 'lucide-react';
import { CSCategory } from '@/types';
import { roadmapApi } from '@/lib/apiClient';

interface StepProgress {
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

interface RoadmapStepItem {
  id: number;
  category: CSCategory;
  title: string;
  description: string;
  displayOrder: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedHours: number;
  prerequisites: number[];
  resources: Array<{ title: string; url: string; type: string }>;
  keyConcepts: string[];
  progress?: StepProgress;
}

const DEFAULT_ROADMAP: Record<CSCategory, Omit<RoadmapStepItem, 'id'>[]> = {
  DSA: [
    { category: 'DSA', title: 'Arrays, Hash Tables & Two Pointers', description: 'Master O(1) hash lookups, sliding window, and two pointer patterns.', displayOrder: 1, difficulty: 'Easy', estimatedHours: 4, prerequisites: [], resources: [{ title: 'NeetCode 150 Arrays', url: 'https://neetcode.io', type: 'practice' }], keyConcepts: ['Hash Map', 'Two Pointers', 'Sliding Window'] },
    { category: 'DSA', title: 'Linked Lists & Floyd Cycle Detection', description: 'Fast & slow pointers algorithm, reversal, and memory optimization.', displayOrder: 2, difficulty: 'Easy', estimatedHours: 3, prerequisites: [1], resources: [{ title: 'LeetCode 141', url: 'https://leetcode.com', type: 'practice' }], keyConcepts: ['Floyd Algorithm', 'Pointers'] },
    { category: 'DSA', title: 'Trees, Graphs, BFS & DFS Traversals', description: 'Binary Search Trees, Graph adjacency lists, Topological Sort & Dijkstra.', displayOrder: 3, difficulty: 'Hard', estimatedHours: 8, prerequisites: [1, 2], resources: [{ title: 'Graph Theory Foundations', url: 'https://geeksforgeeks.org', type: 'article' }], keyConcepts: ['BFS', 'DFS', 'Dijkstra', 'Graph'] },
  ],
  OOPs: [
    { category: 'OOPs', title: '4 Pillars: Encapsulation, Polymorphism, Abstraction, Inheritance', description: 'Core object-oriented paradigm concepts, method overriding vs overloading.', displayOrder: 1, difficulty: 'Easy', estimatedHours: 3, prerequisites: [], resources: [], keyConcepts: ['Polymorphism', 'Encapsulation'] },
    { category: 'OOPs', title: 'SOLID Principles & Design Patterns', description: 'Single Responsibility, Open-Closed, Dependency Inversion, Factory & Singleton patterns.', displayOrder: 2, difficulty: 'Medium', estimatedHours: 5, prerequisites: [1], resources: [], keyConcepts: ['SOLID', 'Factory Pattern', 'Singleton'] },
  ],
  DBMS: [
    { category: 'DBMS', title: 'Relational Model, SQL Joins & Aggregations', description: 'INNER, LEFT, RIGHT, FULL OUTER joins, GROUP BY, and subqueries.', displayOrder: 1, difficulty: 'Easy', estimatedHours: 4, prerequisites: [], resources: [], keyConcepts: ['SQL Joins', 'GROUP BY'] },
    { category: 'DBMS', title: 'ACID Properties, Isolation Levels & B-Tree Indexing', description: 'Atomicity, Consistency, Isolation, Durability, Dirty Reads, and B-Tree indexing performance.', displayOrder: 2, difficulty: 'Hard', estimatedHours: 6, prerequisites: [1], resources: [], keyConcepts: ['ACID', 'B-Tree', 'Dirty Read'] },
  ],
  OS: [
    { category: 'OS', title: 'Processes vs Threads & Context Switching', description: 'CPU Scheduling, Thread address space sharing, TLB cache invalidation.', displayOrder: 1, difficulty: 'Medium', estimatedHours: 4, prerequisites: [], resources: [], keyConcepts: ['Thread', 'Context Switch', 'TLB'] },
    { category: 'OS', title: 'Deadlocks, Coffman Conditions & Banker Algorithm', description: 'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait prevention.', displayOrder: 2, difficulty: 'Medium', estimatedHours: 5, prerequisites: [1], resources: [], keyConcepts: ['Deadlock', 'Coffman'] },
  ],
  CN: [
    { category: 'CN', title: 'OSI Model, TCP 3-Way Handshake vs UDP', description: 'Layer 1-7 responsibilities, SYN/SYN-ACK/ACK, TCP congestion control.', displayOrder: 1, difficulty: 'Easy', estimatedHours: 4, prerequisites: [], resources: [], keyConcepts: ['TCP Handshake', 'UDP', 'OSI'] },
    { category: 'CN', title: 'HTTP/HTTPS, TLS Handshake & DNS Lifecycle', description: 'Complete network flow of typing a URL into the browser.', displayOrder: 2, difficulty: 'Medium', estimatedHours: 5, prerequisites: [1], resources: [], keyConcepts: ['DNS', 'TLS', 'HTTPS'] },
  ],
  'System Design': [
    { category: 'System Design', title: 'Load Balancers, API Gateways & Caching (Redis)', description: 'Horizontal scaling, Round Robin, Least Connections, Redis eviction policies.', displayOrder: 1, difficulty: 'Medium', estimatedHours: 6, prerequisites: [], resources: [], keyConcepts: ['Load Balancing', 'Redis', 'Caching'] },
    { category: 'System Design', title: 'Database Sharding, Replication & CAP Theorem', description: 'Master-slave replication, Partitioning keys, Consistency vs Availability.', displayOrder: 2, difficulty: 'Hard', estimatedHours: 8, prerequisites: [1], resources: [], keyConcepts: ['Sharding', 'CAP Theorem', 'Replication'] },
  ],
};

export const RoadmapView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CSCategory>('DSA');
  const [selectedStep, setSelectedStep] = useState<RoadmapStepItem | null>(null);
  const [completedStepIds, setCompletedStepIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setIsLoading(true);
      try {
        const data = await roadmapApi.getRoadmap(activeCategory);
        if (data?.steps && data.steps.length > 0) {
          const completed = data.steps
            .filter((s: any) => s.progress?.isCompleted)
            .map((s: any) => s.id);
          setCompletedStepIds(completed);
        }
      } catch {
        /* Fallback */
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [activeCategory]);

  const toggleStepCompletion = async (stepId: number) => {
    const isAlreadyDone = completedStepIds.includes(stepId);

    // Optimistic toggle
    if (isAlreadyDone) {
      setCompletedStepIds(prev => prev.filter(id => id !== stepId));
    } else {
      setCompletedStepIds(prev => [...prev, stepId]);
    }

    try {
      await roadmapApi.completeStep(stepId);
    } catch {
      /* Revert if API fails */
    }
  };

  const categories: CSCategory[] = ['DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'System Design'];

  const currentCategorySteps: RoadmapStepItem[] = DEFAULT_ROADMAP[activeCategory].map((step, idx) => ({
    ...step,
    id: idx + 1,
    progress: { isCompleted: completedStepIds.includes(idx + 1) },
  }));

  const completedCount = currentCategorySteps.filter(s => completedStepIds.includes(s.id)).length;
  const progressPercentage = Math.round((completedCount / (currentCategorySteps.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelectedStep(null); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            {cat}
          </button>
        ))}
      </div>

      {/* Progress Bar Header */}
      <div className="card-gradient-yellow rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-extrabold uppercase text-brand-300 tracking-wider">Roadmap Progress</span>
          <h3 className="text-xl font-black text-white">{activeCategory} Learning Path</h3>
          <p className="text-xs text-neutral-400">
            {completedCount} of {currentCategorySteps.length} Milestones Completed
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-48 h-3 rounded-full bg-neutral-950 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-sm font-black text-white">{progressPercentage}%</span>
        </div>
      </div>

      {/* Interactive Roadmap Node Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step Nodes List */}
        <div className="lg:col-span-2 space-y-4">
          {currentCategorySteps.map((step, idx) => {
            const isDone = completedStepIds.includes(step.id);
            const isSelected = selectedStep?.id === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`card-dark rounded-2xl p-5 border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-500/60 bg-neutral-900/90 shadow-xl shadow-brand-500/10'
                    : 'border-white/10 hover:border-neutral-700 bg-neutral-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Completion Checkbox */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStepCompletion(step.id); }}
                      className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-dark-bg font-bold shadow-md shadow-emerald-500/30'
                          : 'border-neutral-700 bg-neutral-950 hover:border-brand-400'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-400 border border-neutral-800">
                          Step {idx + 1}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          step.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : step.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {step.difficulty}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-white">{step.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-neutral-500 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" /> {step.estimatedHours}h
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Drawer Details */}
        <div className="card-dark rounded-3xl p-6 border border-white/10 shadow-2xl h-fit space-y-5">
          {selectedStep ? (
            <>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <span className="text-[10px] font-extrabold uppercase text-brand-400 tracking-wider">Milestone Details</span>
                <button
                  onClick={() => toggleStepCompletion(selectedStep.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    completedStepIds.includes(selectedStep.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-brand-500/20 text-brand-300 border-brand-500/40 hover:bg-brand-500/30'
                  }`}
                >
                  {completedStepIds.includes(selectedStep.id) ? 'Completed ✓' : 'Mark Complete'}
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white">{selectedStep.title}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedStep.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider block">Key Concepts</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStep.keyConcepts.map((concept, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {selectedStep.resources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider block">Recommended Resources</span>
                  <div className="space-y-2">
                    {selectedStep.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-brand-500/40 text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-between transition"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-400">Select a Milestone</h4>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Click any step on the left to view recommended resources, key concept breakdowns, and estimated hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
