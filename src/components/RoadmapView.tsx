'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, CheckCircle2, Circle, Clock, BookOpen, Layers, 
  ExternalLink, ChevronRight, Check, X, Award
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
      
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-charcoal/10 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelectedStep(null); }}
            className={`px-4 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-charcoal text-cream shadow-md'
                : 'bg-white text-charcoal/70 border border-charcoal/10 hover:bg-cream'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            {cat}
          </button>
        ))}
      </div>

      {/* Progress Header */}
      <div className="card-mint-gradient p-6 border border-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">Milestone Progress</span>
          <h3 className="font-display font-black text-xl text-charcoal">{activeCategory} Learning Path</h3>
          <p className="text-xs font-bold text-charcoal/70">
            {completedCount} of {currentCategorySteps.length} Milestones Completed
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-48 h-3 rounded-full bg-white overflow-hidden border border-charcoal/10">
            <div
              className="h-full bg-charcoal rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="font-display font-black text-base text-charcoal">{progressPercentage}%</span>
        </div>
      </div>

      {/* Milestone List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {currentCategorySteps.map((step, idx) => {
            const isDone = completedStepIds.includes(step.id);
            const isSelected = selectedStep?.id === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`card-cream p-5 border cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-charcoal bg-white shadow-xl'
                    : 'hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStepCompletion(step.id); }}
                      className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-charcoal border-charcoal text-cream font-bold'
                          : 'border-charcoal/30 bg-white hover:border-charcoal'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-charcoal text-cream">
                          Step {idx + 1}
                        </span>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-charcoal border border-charcoal/10">
                          {step.difficulty}
                        </span>
                      </div>
                      <h4 className="font-display font-black text-base text-charcoal">{step.title}</h4>
                      <p className="text-xs text-charcoal/70 font-medium line-clamp-2 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-charcoal/60 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {step.estimatedHours}h
                    </span>
                    <ChevronRight className="w-4 h-4 text-charcoal/40" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Details */}
        <div className="card-cream p-6 border border-white shadow-2xl h-fit space-y-5">
          {selectedStep ? (
            <>
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">Milestone Details</span>
                <button
                  onClick={() => toggleStepCompletion(selectedStep.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    completedStepIds.includes(selectedStep.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-charcoal text-cream hover:opacity-90'
                  }`}
                >
                  {completedStepIds.includes(selectedStep.id) ? 'Completed ✓' : 'Mark Complete'}
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-lg text-charcoal">{selectedStep.title}</h3>
                <p className="text-xs font-medium text-charcoal/80 leading-relaxed">{selectedStep.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-black text-charcoal/60 uppercase tracking-wider block">Key Concepts</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStep.keyConcepts.map((concept, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white border border-charcoal/10 text-charcoal text-xs font-bold">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {selectedStep.resources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-charcoal/10">
                  <span className="text-xs font-black text-charcoal/60 uppercase tracking-wider block">Recommended Resources</span>
                  <div className="space-y-2">
                    {selectedStep.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-2xl bg-white border border-charcoal/10 hover:border-charcoal text-xs font-bold text-charcoal flex items-center justify-between transition"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-charcoal/60" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-10 h-10 text-charcoal/40 mx-auto" />
              <h4 className="font-display font-bold text-sm text-charcoal">Select a Milestone</h4>
              <p className="text-xs text-charcoal/60 max-w-xs mx-auto font-medium">
                Click any step on the left to view recommended resources and concepts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
