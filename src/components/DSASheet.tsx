'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink, Search, CheckCircle2, Circle, Filter,
  Hash, Layers, GitBranch, Binary, TreeDeciduous, Network,
  Boxes, BarChart3, Puzzle, Repeat, BookOpen, Flame, Target,
  ChevronDown, ChevronUp, ArrowUpRight, Zap, Trophy
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// DSA Problem Data — Curated LeetCode Problems with Direct URLs
// ═══════════════════════════════════════════════════════════

export interface DSAProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  leetcodeUrl: string;
  leetcodeNumber: number;
  pattern?: string;
}

const DSA_PROBLEMS: DSAProblem[] = [
  // ───── Arrays & Hashing ─────
  { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', leetcodeNumber: 1, pattern: 'Hash Map' },
  { id: 2, title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/', leetcodeNumber: 217, pattern: 'Hash Set' },
  { id: 3, title: 'Valid Anagram', difficulty: 'Easy', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/', leetcodeNumber: 242, pattern: 'Hash Map' },
  { id: 4, title: 'Group Anagrams', difficulty: 'Medium', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/', leetcodeNumber: 49, pattern: 'Hash Map' },
  { id: 5, title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', leetcodeNumber: 347, pattern: 'Bucket Sort' },
  { id: 6, title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', leetcodeNumber: 238, pattern: 'Prefix/Suffix' },
  { id: 7, title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Arrays & Hashing', leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/', leetcodeNumber: 128, pattern: 'Hash Set' },

  // ───── Two Pointers ─────
  { id: 8, title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/', leetcodeNumber: 125, pattern: 'Two Pointers' },
  { id: 9, title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', topic: 'Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', leetcodeNumber: 167, pattern: 'Two Pointers' },
  { id: 10, title: '3Sum', difficulty: 'Medium', topic: 'Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/3sum/', leetcodeNumber: 15, pattern: 'Two Pointers' },
  { id: 11, title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', leetcodeNumber: 11, pattern: 'Two Pointers' },
  { id: 12, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/', leetcodeNumber: 42, pattern: 'Two Pointers' },

  // ───── Sliding Window ─────
  { id: 13, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Sliding Window', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', leetcodeNumber: 121, pattern: 'Sliding Window' },
  { id: 14, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', leetcodeNumber: 3, pattern: 'Sliding Window' },
  { id: 15, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topic: 'Sliding Window', leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', leetcodeNumber: 424, pattern: 'Sliding Window' },
  { id: 16, title: 'Permutation in String', difficulty: 'Medium', topic: 'Sliding Window', leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/', leetcodeNumber: 567, pattern: 'Sliding Window' },
  { id: 17, title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Sliding Window', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/', leetcodeNumber: 76, pattern: 'Sliding Window' },

  // ───── Stack ─────
  { id: 18, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/', leetcodeNumber: 20, pattern: 'Stack' },
  { id: 19, title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', leetcodeUrl: 'https://leetcode.com/problems/min-stack/', leetcodeNumber: 155, pattern: 'Stack Design' },
  { id: 20, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', topic: 'Stack', leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', leetcodeNumber: 150, pattern: 'Stack' },
  { id: 21, title: 'Daily Temperatures', difficulty: 'Medium', topic: 'Stack', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', leetcodeNumber: 739, pattern: 'Monotonic Stack' },
  { id: 22, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Stack', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', leetcodeNumber: 84, pattern: 'Monotonic Stack' },

  // ───── Binary Search ─────
  { id: 23, title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', leetcodeUrl: 'https://leetcode.com/problems/binary-search/', leetcodeNumber: 704, pattern: 'Binary Search' },
  { id: 24, title: 'Search a 2D Matrix', difficulty: 'Medium', topic: 'Binary Search', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', leetcodeNumber: 74, pattern: 'Binary Search' },
  { id: 25, title: 'Koko Eating Bananas', difficulty: 'Medium', topic: 'Binary Search', leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/', leetcodeNumber: 875, pattern: 'Binary Search on Answer' },
  { id: 26, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', leetcodeNumber: 153, pattern: 'Binary Search' },
  { id: 27, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', leetcodeNumber: 33, pattern: 'Binary Search' },
  { id: 28, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', leetcodeNumber: 4, pattern: 'Binary Search' },

  // ───── Linked List ─────
  { id: 29, title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', leetcodeNumber: 206, pattern: 'Iterative/Recursive' },
  { id: 30, title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', leetcodeNumber: 21, pattern: 'Two Pointers' },
  { id: 31, title: 'Linked List Cycle', difficulty: 'Easy', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', leetcodeNumber: 141, pattern: 'Floyd Cycle' },
  { id: 32, title: 'Reorder List', difficulty: 'Medium', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/', leetcodeNumber: 143, pattern: 'Fast & Slow' },
  { id: 33, title: 'Remove Nth Node From End of List', difficulty: 'Medium', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', leetcodeNumber: 19, pattern: 'Two Pointers' },
  { id: 34, title: 'Copy List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/', leetcodeNumber: 138, pattern: 'Hash Map' },
  { id: 35, title: 'LRU Cache', difficulty: 'Medium', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/lru-cache/', leetcodeNumber: 146, pattern: 'DLL + Hash Map' },
  { id: 36, title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Linked List', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', leetcodeNumber: 23, pattern: 'Heap / Divide & Conquer' },

  // ───── Trees ─────
  { id: 37, title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', leetcodeNumber: 226, pattern: 'DFS' },
  { id: 38, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', leetcodeNumber: 104, pattern: 'DFS' },
  { id: 39, title: 'Same Tree', difficulty: 'Easy', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', leetcodeNumber: 100, pattern: 'DFS' },
  { id: 40, title: 'Subtree of Another Tree', difficulty: 'Easy', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/', leetcodeNumber: 572, pattern: 'DFS' },
  { id: 41, title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', leetcodeNumber: 235, pattern: 'BST Property' },
  { id: 42, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', leetcodeNumber: 102, pattern: 'BFS' },
  { id: 43, title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', leetcodeNumber: 98, pattern: 'DFS + Range' },
  { id: 44, title: 'Kth Smallest Element in a BST', difficulty: 'Medium', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', leetcodeNumber: 230, pattern: 'Inorder Traversal' },
  { id: 45, title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', leetcodeNumber: 105, pattern: 'Divide & Conquer' },
  { id: 46, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', leetcodeNumber: 124, pattern: 'DFS' },
  { id: 47, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Trees', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', leetcodeNumber: 297, pattern: 'BFS/DFS' },

  // ───── Heap / Priority Queue ─────
  { id: 48, title: 'Kth Largest Element in a Stream', difficulty: 'Easy', topic: 'Heap / Priority Queue', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', leetcodeNumber: 703, pattern: 'Min Heap' },
  { id: 49, title: 'Last Stone Weight', difficulty: 'Easy', topic: 'Heap / Priority Queue', leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/', leetcodeNumber: 1046, pattern: 'Max Heap' },
  { id: 50, title: 'K Closest Points to Origin', difficulty: 'Medium', topic: 'Heap / Priority Queue', leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/', leetcodeNumber: 973, pattern: 'Min Heap' },
  { id: 51, title: 'Task Scheduler', difficulty: 'Medium', topic: 'Heap / Priority Queue', leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/', leetcodeNumber: 621, pattern: 'Max Heap + Queue' },
  { id: 52, title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heap / Priority Queue', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/', leetcodeNumber: 295, pattern: 'Two Heaps' },

  // ───── Backtracking ─────
  { id: 53, title: 'Subsets', difficulty: 'Medium', topic: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/subsets/', leetcodeNumber: 78, pattern: 'Backtracking' },
  { id: 54, title: 'Combination Sum', difficulty: 'Medium', topic: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', leetcodeNumber: 39, pattern: 'Backtracking' },
  { id: 55, title: 'Permutations', difficulty: 'Medium', topic: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/permutations/', leetcodeNumber: 46, pattern: 'Backtracking' },
  { id: 56, title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/word-search/', leetcodeNumber: 79, pattern: 'DFS Backtracking' },
  { id: 57, title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/', leetcodeNumber: 131, pattern: 'Backtracking' },
  { id: 58, title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', leetcodeNumber: 51, pattern: 'Backtracking' },

  // ───── Graphs ─────
  { id: 59, title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', leetcodeNumber: 200, pattern: 'DFS/BFS' },
  { id: 60, title: 'Clone Graph', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', leetcodeNumber: 133, pattern: 'DFS + Hash Map' },
  { id: 61, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', leetcodeNumber: 417, pattern: 'Multi-source BFS' },
  { id: 62, title: 'Course Schedule', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', leetcodeNumber: 207, pattern: 'Topological Sort' },
  { id: 63, title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', leetcodeNumber: 210, pattern: 'Topological Sort' },
  { id: 64, title: 'Graph Valid Tree', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/', leetcodeNumber: 261, pattern: 'Union Find / DFS' },
  { id: 65, title: 'Number of Connected Components', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', leetcodeNumber: 323, pattern: 'Union Find' },
  { id: 66, title: 'Rotting Oranges', difficulty: 'Medium', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/', leetcodeNumber: 994, pattern: 'BFS' },
  { id: 67, title: 'Word Ladder', difficulty: 'Hard', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/', leetcodeNumber: 127, pattern: 'BFS' },
  { id: 68, title: 'Alien Dictionary', difficulty: 'Hard', topic: 'Graphs', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/', leetcodeNumber: 269, pattern: 'Topological Sort' },

  // ───── Dynamic Programming ─────
  { id: 69, title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', leetcodeNumber: 70, pattern: 'Fibonacci' },
  { id: 70, title: 'House Robber', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', leetcodeNumber: 198, pattern: '1D DP' },
  { id: 71, title: 'House Robber II', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/', leetcodeNumber: 213, pattern: '1D DP (Circular)' },
  { id: 72, title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', leetcodeNumber: 5, pattern: 'Expand Around Center' },
  { id: 73, title: 'Palindromic Substrings', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/', leetcodeNumber: 647, pattern: 'Expand Around Center' },
  { id: 74, title: 'Decode Ways', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/', leetcodeNumber: 91, pattern: '1D DP' },
  { id: 75, title: 'Coin Change', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', leetcodeNumber: 322, pattern: 'Unbounded Knapsack' },
  { id: 76, title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/', leetcodeNumber: 152, pattern: 'Kadane Variant' },
  { id: 77, title: 'Word Break', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/word-break/', leetcodeNumber: 139, pattern: '1D DP' },
  { id: 78, title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', leetcodeNumber: 300, pattern: 'Binary Search + DP' },
  { id: 79, title: 'Unique Paths', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', leetcodeNumber: 62, pattern: '2D DP' },
  { id: 80, title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', leetcodeNumber: 1143, pattern: '2D DP' },
  { id: 81, title: 'Edit Distance', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/', leetcodeNumber: 72, pattern: '2D DP' },
  { id: 82, title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', leetcodeNumber: 53, pattern: "Kadane's Algorithm" },
  { id: 83, title: 'Partition Equal Subset Sum', difficulty: 'Medium', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', leetcodeNumber: 416, pattern: '0/1 Knapsack' },
  { id: 84, title: 'Regular Expression Matching', difficulty: 'Hard', topic: 'Dynamic Programming', leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/', leetcodeNumber: 10, pattern: '2D DP' },

  // ───── Greedy ─────
  { id: 85, title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Greedy', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', leetcodeNumber: 53, pattern: "Kadane's" },
  { id: 86, title: 'Jump Game', difficulty: 'Medium', topic: 'Greedy', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', leetcodeNumber: 55, pattern: 'Greedy' },
  { id: 87, title: 'Jump Game II', difficulty: 'Medium', topic: 'Greedy', leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/', leetcodeNumber: 45, pattern: 'Greedy BFS' },
  { id: 88, title: 'Gas Station', difficulty: 'Medium', topic: 'Greedy', leetcodeUrl: 'https://leetcode.com/problems/gas-station/', leetcodeNumber: 134, pattern: 'Greedy' },
  { id: 89, title: 'Hand of Straights', difficulty: 'Medium', topic: 'Greedy', leetcodeUrl: 'https://leetcode.com/problems/hand-of-straights/', leetcodeNumber: 846, pattern: 'Greedy + Map' },

  // ───── Intervals ─────
  { id: 90, title: 'Meeting Rooms', difficulty: 'Easy', topic: 'Intervals', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/', leetcodeNumber: 252, pattern: 'Sort' },
  { id: 91, title: 'Insert Interval', difficulty: 'Medium', topic: 'Intervals', leetcodeUrl: 'https://leetcode.com/problems/insert-interval/', leetcodeNumber: 57, pattern: 'Intervals' },
  { id: 92, title: 'Merge Intervals', difficulty: 'Medium', topic: 'Intervals', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', leetcodeNumber: 56, pattern: 'Sort + Merge' },
  { id: 93, title: 'Non-overlapping Intervals', difficulty: 'Medium', topic: 'Intervals', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', leetcodeNumber: 435, pattern: 'Greedy' },
  { id: 94, title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Intervals', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/', leetcodeNumber: 253, pattern: 'Min Heap' },

  // ───── Bit Manipulation ─────
  { id: 95, title: 'Single Number', difficulty: 'Easy', topic: 'Bit Manipulation', leetcodeUrl: 'https://leetcode.com/problems/single-number/', leetcodeNumber: 136, pattern: 'XOR' },
  { id: 96, title: 'Number of 1 Bits', difficulty: 'Easy', topic: 'Bit Manipulation', leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/', leetcodeNumber: 191, pattern: 'Bit Count' },
  { id: 97, title: 'Counting Bits', difficulty: 'Easy', topic: 'Bit Manipulation', leetcodeUrl: 'https://leetcode.com/problems/counting-bits/', leetcodeNumber: 338, pattern: 'DP + Bit' },
  { id: 98, title: 'Reverse Bits', difficulty: 'Easy', topic: 'Bit Manipulation', leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/', leetcodeNumber: 190, pattern: 'Bit Manipulation' },
  { id: 99, title: 'Missing Number', difficulty: 'Easy', topic: 'Bit Manipulation', leetcodeUrl: 'https://leetcode.com/problems/missing-number/', leetcodeNumber: 268, pattern: 'XOR / Math' },
  { id: 100, title: 'Sum of Two Integers', difficulty: 'Medium', topic: 'Bit Manipulation', leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/', leetcodeNumber: 371, pattern: 'Bit Manipulation' },

  // ───── Tries ─────
  { id: 101, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', topic: 'Tries', leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/', leetcodeNumber: 208, pattern: 'Trie' },
  { id: 102, title: 'Design Add and Search Words', difficulty: 'Medium', topic: 'Tries', leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', leetcodeNumber: 211, pattern: 'Trie + DFS' },
  { id: 103, title: 'Word Search II', difficulty: 'Hard', topic: 'Tries', leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/', leetcodeNumber: 212, pattern: 'Trie + Backtracking' },

  // ───── Math & Geometry ─────
  { id: 104, title: 'Rotate Image', difficulty: 'Medium', topic: 'Math & Geometry', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/', leetcodeNumber: 48, pattern: 'Matrix Transpose' },
  { id: 105, title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Math & Geometry', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/', leetcodeNumber: 54, pattern: 'Boundary Walk' },
  { id: 106, title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Math & Geometry', leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/', leetcodeNumber: 73, pattern: 'In-place Mark' },
  { id: 107, title: 'Happy Number', difficulty: 'Easy', topic: 'Math & Geometry', leetcodeUrl: 'https://leetcode.com/problems/happy-number/', leetcodeNumber: 202, pattern: 'Floyd Cycle' },
  { id: 108, title: 'Plus One', difficulty: 'Easy', topic: 'Math & Geometry', leetcodeUrl: 'https://leetcode.com/problems/plus-one/', leetcodeNumber: 66, pattern: 'Math' },
];

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  'Arrays & Hashing': <Hash className="w-4 h-4" />,
  'Two Pointers': <Repeat className="w-4 h-4" />,
  'Sliding Window': <Layers className="w-4 h-4" />,
  'Stack': <Boxes className="w-4 h-4" />,
  'Binary Search': <Binary className="w-4 h-4" />,
  'Linked List': <GitBranch className="w-4 h-4" />,
  'Trees': <TreeDeciduous className="w-4 h-4" />,
  'Heap / Priority Queue': <BarChart3 className="w-4 h-4" />,
  'Backtracking': <Puzzle className="w-4 h-4" />,
  'Graphs': <Network className="w-4 h-4" />,
  'Dynamic Programming': <Target className="w-4 h-4" />,
  'Greedy': <Flame className="w-4 h-4" />,
  'Intervals': <BookOpen className="w-4 h-4" />,
  'Bit Manipulation': <Zap className="w-4 h-4" />,
  'Tries': <GitBranch className="w-4 h-4" />,
  'Math & Geometry': <Hash className="w-4 h-4" />,
};

const TOPIC_ORDER = [
  'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack',
  'Binary Search', 'Linked List', 'Trees', 'Heap / Priority Queue',
  'Backtracking', 'Graphs', 'Dynamic Programming', 'Greedy',
  'Intervals', 'Bit Manipulation', 'Tries', 'Math & Geometry',
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500/20' },
  Medium: { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500/20' },
  Hard: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
};

// ═══════════════════════════════════════════════════════════
// DSA Sheet Component
// ═══════════════════════════════════════════════════════════

export const DSASheet: React.FC = () => {
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());

  // Load solved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mockly-dsa-solved');
      if (saved) {
        setSolvedIds(new Set(JSON.parse(saved)));
      }
    } catch { /* ignore */ }
  }, []);

  // Save solved state to localStorage
  const toggleSolved = (problemId: number) => {
    setSolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      localStorage.setItem('mockly-dsa-solved', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleTopicCollapse = (topic: string) => {
    setCollapsedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  // Filter problems
  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.pattern && p.pattern.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.leetcodeNumber.toString().includes(searchQuery);
      const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
      const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      return matchesSearch && matchesTopic && matchesDifficulty;
    });
  }, [searchQuery, selectedTopic, selectedDifficulty]);

  // Group by topic
  const groupedProblems = useMemo(() => {
    const groups: Record<string, DSAProblem[]> = {};
    for (const problem of filteredProblems) {
      if (!groups[problem.topic]) {
        groups[problem.topic] = [];
      }
      groups[problem.topic].push(problem);
    }
    return groups;
  }, [filteredProblems]);

  // Stats
  const totalProblems = DSA_PROBLEMS.length;
  const solvedCount = solvedIds.size;
  const easyCount = DSA_PROBLEMS.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = DSA_PROBLEMS.filter(p => p.difficulty === 'Medium').length;
  const hardCount = DSA_PROBLEMS.filter(p => p.difficulty === 'Hard').length;
  const easySolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Easy' && solvedIds.has(p.id)).length;
  const mediumSolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Medium' && solvedIds.has(p.id)).length;
  const hardSolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Hard' && solvedIds.has(p.id)).length;
  const progressPct = Math.round((solvedCount / totalProblems) * 100);

  const topics = TOPIC_ORDER.filter(t => DSA_PROBLEMS.some(p => p.topic === t));

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ───── Stats Banner ───── */}
      <div className="card-cream p-6 border border-white shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Overall Progress */}
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(27,30,22,0.08)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="#1B1E16" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPct / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-black text-lg text-charcoal">{progressPct}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">Overall Progress</span>
              </div>
              <h3 className="font-display font-black text-xl text-charcoal">
                {solvedCount} / {totalProblems} Solved
              </h3>
              <p className="text-xs font-bold text-charcoal/60">Keep grinding! Every problem counts 💪</p>
            </div>
          </div>

          {/* Right: Difficulty Breakdown */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {[
              { label: 'Easy', solved: easySolved, total: easyCount, color: 'bg-emerald-500', track: 'bg-emerald-500/15' },
              { label: 'Medium', solved: mediumSolved, total: mediumCount, color: 'bg-amber-500', track: 'bg-amber-500/15' },
              { label: 'Hard', solved: hardSolved, total: hardCount, color: 'bg-red-500', track: 'bg-red-500/15' },
            ].map(d => (
              <div key={d.label} className="flex-1 p-3 rounded-2xl bg-white border border-charcoal/5 text-center space-y-1.5">
                <span className="text-[10px] font-black text-charcoal/50 uppercase">{d.label}</span>
                <div className="font-display font-black text-base text-charcoal">{d.solved}/{d.total}</div>
                <div className={`w-full h-1.5 rounded-full ${d.track} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${d.color} transition-all duration-500`}
                    style={{ width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Filters Bar ───── */}
      <div className="soft-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Topic Select */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-charcoal/40 shrink-0" />
          <button
            onClick={() => setSelectedTopic('All')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
              selectedTopic === 'All'
                ? 'bg-charcoal text-cream shadow-sm'
                : 'bg-white text-charcoal/60 border border-charcoal/10 hover:bg-cream'
            }`}
          >
            All Topics
          </button>
          {topics.map(topic => {
            const count = DSA_PROBLEMS.filter(p => p.topic === topic).length;
            const topicSolved = DSA_PROBLEMS.filter(p => p.topic === topic && solvedIds.has(p.id)).length;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedTopic === topic
                    ? 'bg-charcoal text-cream shadow-sm'
                    : 'bg-white text-charcoal/60 border border-charcoal/10 hover:bg-cream'
                }`}
              >
                {TOPIC_ICONS[topic]}
                <span>{topic}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  selectedTopic === topic ? 'bg-white/20' : 'bg-charcoal/5'
                }`}>{topicSolved}/{count}</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty + Search */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-1 p-1 bg-white border border-charcoal/10 rounded-full text-[10px] font-black">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
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

          <div className="relative w-full md:w-56">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-charcoal/40" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, #number..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-charcoal/10 rounded-full text-xs font-bold text-charcoal focus:outline-none focus:border-charcoal placeholder:text-charcoal/40"
            />
          </div>
        </div>
      </div>

      {/* ───── Problems List (Grouped by Topic) ───── */}
      <div className="space-y-4">
        {TOPIC_ORDER
          .filter(topic => groupedProblems[topic])
          .map(topic => {
            const problems = groupedProblems[topic];
            const topicSolvedCount = problems.filter(p => solvedIds.has(p.id)).length;
            const isCollapsed = collapsedTopics.has(topic);

            return (
              <div key={topic} className="soft-card overflow-hidden">
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopicCollapse(topic)}
                  className="w-full p-5 flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-charcoal text-cream flex items-center justify-center">
                      {TOPIC_ICONS[topic]}
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-black text-sm text-charcoal">{topic}</h3>
                      <span className="text-[10px] font-bold text-charcoal/50">
                        {topicSolvedCount}/{problems.length} solved
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mini progress bar */}
                    <div className="hidden sm:block w-24 h-1.5 rounded-full bg-charcoal/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-charcoal transition-all duration-500"
                        style={{ width: `${(topicSolvedCount / problems.length) * 100}%` }}
                      />
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-charcoal/40" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-charcoal/40" />
                    )}
                  </div>
                </button>

                {/* Problems Table */}
                {!isCollapsed && (
                  <div className="border-t border-charcoal/5">
                    {problems.map((problem, idx) => {
                      const isSolved = solvedIds.has(problem.id);
                      const diffStyle = DIFFICULTY_COLORS[problem.difficulty];

                      return (
                        <div
                          key={problem.id}
                          className={`flex items-center justify-between px-5 py-3.5 border-b border-charcoal/[0.04] last:border-b-0 transition-all hover:bg-cream/80 group ${
                            isSolved ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Solve Toggle */}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSolved(problem.id); }}
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                                isSolved
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-charcoal/25 bg-white hover:border-charcoal/50'
                              }`}
                              title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                            >
                              {isSolved && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>

                            {/* Problem Number */}
                            <span className="text-[10px] font-black text-charcoal/40 w-8 shrink-0 tabular-nums">
                              #{problem.leetcodeNumber}
                            </span>

                            {/* Problem Title — Clickable Link to LeetCode */}
                            <a
                              href={problem.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs font-bold truncate transition-colors ${
                                isSolved
                                  ? 'text-charcoal/50 line-through decoration-charcoal/20'
                                  : 'text-charcoal hover:text-coral'
                              }`}
                              title={`Open "${problem.title}" on LeetCode`}
                            >
                              {problem.title}
                            </a>

                            {/* Pattern Tag */}
                            {problem.pattern && (
                              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-charcoal/[0.04] text-[9px] font-bold text-charcoal/45 whitespace-nowrap">
                                {problem.pattern}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {/* Difficulty Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${diffStyle.bg} ${diffStyle.text}`}>
                              {problem.difficulty}
                            </span>

                            {/* LeetCode External Link */}
                            <a
                              href={problem.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-lg bg-white border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:text-coral hover:border-coral/30 transition-all opacity-0 group-hover:opacity-100"
                              title="Open on LeetCode"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        {/* Empty state */}
        {Object.keys(groupedProblems).length === 0 && (
          <div className="soft-card p-12 text-center space-y-3">
            <Search className="w-10 h-10 text-charcoal/30 mx-auto" />
            <h4 className="font-display font-bold text-sm text-charcoal">No problems found</h4>
            <p className="text-xs text-charcoal/50 font-medium">Try changing the filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
