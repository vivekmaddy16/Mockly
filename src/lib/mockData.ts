import { PracticeQuestion, InterviewSession } from '@/types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // DSA
  {
    id: 'dsa-1',
    category: 'DSA',
    title: 'Two Sum & Hash Maps',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target` in O(n) time complexity. Explain your choice of data structure.',
    initialCodeSnippet: `function twoSum(nums: number[], target: number): number[] {\
  // Write your solution here\
}`,
    hints: [
      'Consider using a Hash Map to store previously visited numbers and their index.',
      'The complement for any number x is target - x.'
    ],
    sampleSolution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    keyConcepts: ['Hash Table', 'Array Lookup', 'Time/Space Complexity Tradeoff']
  },
  {
    id: 'dsa-2',
    category: 'DSA',
    title: 'Detect Cycle in a Linked List (Floyd\'s Algorithm)',
    difficulty: 'Medium',
    description: 'Explain Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare). How do two pointers moving at different speeds detect a cycle without using extra memory?',
    hints: [
      'Think about two runners on a circular track. The faster runner will eventually lap the slower runner.',
      'What happens when slow advances by 1 step and fast advances by 2 steps?'
    ],
    sampleSolution: `Use two pointers (slow and fast). Advance slow by 1 step and fast by 2 steps. If fast or fast.next becomes null, there is no cycle. If slow === fast at any point, a cycle exists. Time Complexity: O(n), Space Complexity: O(1).`,
    keyConcepts: ['Two Pointers', 'Linked List', 'Memory Optimization']
  },
  {
    id: 'dsa-3',
    category: 'DSA',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters using the Sliding Window pattern.',
    initialCodeSnippet: `function lengthOfLongestSubstring(s: string): number {\
  // Your implementation\
}`,
    hints: [
      'Use a sliding window with left and right pointers.',
      'Keep track of characters in the current window using a Set or Map.'
    ],
    sampleSolution: `function lengthOfLongestSubstring(s: string): number {
  let left = 0, maxLen = 0;
  const set = new Set<string>();
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    keyConcepts: ['Sliding Window', 'Set', 'String Processing']
  },

  // OOPs
  {
    id: 'oops-1',
    category: 'OOPs',
    title: 'Four Pillars of OOP & Real-World Use Cases',
    difficulty: 'Easy',
    description: 'Explain Encapsulation, Abstraction, Inheritance, and Polymorphism. Provide a clear code or real-world example illustrating Polymorphism (Compile-time vs Run-time).',
    hints: [
      'Encapsulation = bundling data & methods, hiding internal state.',
      'Polymorphism = Method Overloading (compile-time) vs Method Overriding (run-time).'
    ],
    sampleSolution: `1. Encapsulation: Restricting direct access to data members via private fields and getters/setters.
2. Abstraction: Hiding implementation details and showing only essential features (e.g., interface Shape { draw(): void }).
3. Inheritance: Reusing parent class properties in child classes.
4. Polymorphism: Ability to take many forms. Method Overriding allows subclass to provide specific implementation of parent method at runtime.`,
    keyConcepts: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism']
  },
  {
    id: 'oops-2',
    category: 'OOPs',
    title: 'Abstract Classes vs Interfaces',
    difficulty: 'Medium',
    description: 'When would you design a software component using an Abstract Class instead of an Interface? Highlight key differences in multiple inheritance and default implementations.',
    hints: [
      'Interfaces define contracts ("can-do"); Abstract classes define base identity ("is-a").',
      'Abstract classes can hold state (member variables) and constructor logic.'
    ],
    sampleSolution: `Abstract classes allow sharing code/state between closely related classes and defining constructors or non-public methods. Interfaces specify behaviors without managing state, allowing a class to implement multiple interfaces.`,
    keyConcepts: ['Abstract Class', 'Interface', 'Design Patterns']
  },

  // DBMS
  {
    id: 'dbms-1',
    category: 'DBMS',
    title: 'ACID Properties & Database Isolation Levels',
    difficulty: 'Medium',
    description: 'What do Atomicity, Consistency, Isolation, and Durability mean in relational databases? Explain Dirty Read, Non-Repeatable Read, and Phantom Read.',
    hints: [
      'Atomicity = All or Nothing.',
      'Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.'
    ],
    sampleSolution: `ACID ensures transaction reliability:
- Atomicity: Complete execute or full rollback.
- Consistency: Data satisfies constraints before and after transaction.
- Isolation: Concurrent transactions don't interfere.
- Durability: Committed updates survive system crashes.

Concurreny Phenomena:
- Dirty Read: Reading uncommitted data from another transaction.
- Non-repeatable Read: Re-reading same row gives different value due to intermediate update.
- Phantom Read: Re-running query yields additional rows due to intermediate insert.`,
    keyConcepts: ['ACID', 'Transactions', 'Isolation Levels', 'Concurrency']
  },
  {
    id: 'dbms-2',
    category: 'DBMS',
    title: 'B-Tree Indexing & Database Query Optimization',
    difficulty: 'Hard',
    description: 'How does a B-Tree index speed up database searches? Why might adding too many indexes negatively impact WRITE performance (INSERT/UPDATE/DELETE)?',
    hints: [
      'B-Trees allow O(log N) search, insertion, and range queries.',
      'Every write operation requires rebalancing index trees.'
    ],
    sampleSolution: `B-Trees maintain sorted data in balanced node hierarchies, reducing disk I/O from O(N) full table scan to O(log N) B-Tree traversal. However, index structures must be updated every time a table row is inserted, updated, or deleted, leading to increased disk writes, write latency, and index fragmentation.`,
    keyConcepts: ['Indexing', 'B-Tree', 'Query Optimization', 'Disk I/O']
  },

  // OS
  {
    id: 'os-1',
    category: 'OS',
    title: 'Process vs Thread & Context Switching',
    difficulty: 'Easy',
    description: 'Differentiate between a Process and a Thread. What overhead is involved in a Process Context Switch versus a Thread Context Switch?',
    hints: [
      'Threads share address space, heap, and file descriptors.',
      'Process switch invalidates TLB (Translation Lookaside Buffer).'
    ],
    sampleSolution: `A process is an independent executing program with its own address space, memory, and resources. A thread is a lightweight execution unit inside a process. Thread context switching is faster because threads share address space and memory mappings (no TLB cache flushing needed). Process context switching involves saving CPU registers, switching page tables, and invalidating memory caches (TLB).`,
    keyConcepts: ['Process', 'Thread', 'Context Switch', 'TLB Cache']
  },
  {
    id: 'os-2',
    category: 'OS',
    title: 'Deadlock Conditions & Prevention (Banker\'s Algorithm)',
    difficulty: 'Medium',
    description: 'What are Coffman\'s 4 necessary conditions for a Deadlock? Briefly explain how to break one of these conditions.',
    hints: [
      'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
      'Prevent circular wait by establishing strict global resource ordering.'
    ],
    sampleSolution: `Deadlock requires 4 simultaneous conditions:
1. Mutual Exclusion: Resource held exclusively.
2. Hold and Wait: Process holding resource requests another.
3. No Preemption: Resources cannot be forcibly taken.
4. Circular Wait: P0 waits for P1, P1 waits for P2... Pn waits for P0.

Prevention: Enforce global total ordering on resource allocation to prevent Circular Wait.`,
    keyConcepts: ['Deadlock', 'Coffman Conditions', 'Concurrency']
  },

  // CN
  {
    id: 'cn-1',
    category: 'CN',
    title: 'TCP vs UDP & The 3-Way Handshake',
    difficulty: 'Easy',
    description: 'Explain TCP 3-Way Handshake (SYN, SYN-ACK, ACK). When would you choose UDP over TCP for modern network services?',
    hints: [
      'SYN -> SYN+ACK -> ACK establishes reliable connection.',
      'UDP is connectionless, low latency (e.g., video streaming, gaming, DNS).'
    ],
    sampleSolution: `TCP handshake: Client sends SYN, Server replies SYN-ACK, Client sends ACK. TCP guarantees ordered, reliable packet delivery with congestion control. UDP drops handshake and error correction overhead for minimal latency, making it ideal for live video/audio streaming, online multiplayer games, and DNS queries where speed outweighs occasional packet loss.`,
    keyConcepts: ['TCP', 'UDP', 'Handshake', 'Protocols']
  },
  {
    id: 'cn-2',
    category: 'CN',
    title: 'What Happens When You Type a URL in Browser?',
    difficulty: 'Medium',
    description: 'Walk step-by-step through what happens network-wise when a user types `https://google.com` and presses Enter.',
    hints: [
      'DNS lookup -> TCP Handshake -> TLS/SSL Handshake -> HTTP Request -> Render DOM.'
    ],
    sampleSolution: `1. DNS Resolution: Browser checks cache -> OS cache -> Router -> ISP Resolver -> Root/TLD DNS to get IP.
2. TCP Handshake: 3-way SYN/SYN-ACK/ACK connection to IP port 443.
3. TLS Handshake: Certificate validation, key exchange, encryption setup.
4. HTTP Request: GET / sent with headers.
5. Server Response: 200 OK returning HTML document.
6. Rendering: Browser parses HTML, constructs DOM/CSSOM, executes JavaScript.`,
    keyConcepts: ['DNS', 'TLS/HTTPS', 'HTTP Lifecycle', 'Browser Engines']
  }
];

export const DEMO_INITIAL_SESSION: InterviewSession = {
  id: 'demo-session-1',
  createdAt: new Date().toISOString(),
  targetRole: 'Full Stack Web Developer',
  experienceLevel: 'Mid-Level (2-4 yrs)',
  extractedSkills: ['React', 'Next.js', 'Node.js', 'REST APIs', 'PostgreSQL', 'System Design'],
  questions: [
    {
      id: 'q1',
      type: 'technical',
      category: 'System Architecture',
      questionText: 'How would you architect a scalable real-time notification system in Next.js/Node.js handling over 100,000 active concurrent connections?',
      expectedKeyPoints: [
        'WebSockets or Server-Sent Events (SSE)',
        'Redis Pub/Sub or Kafka for message distribution across cluster nodes',
        'Horizontal scaling of WebSocket servers',
        'Database persistent store for offline notifications'
      ],
      difficulty: 'Medium'
    },
    {
      id: 'q2',
      type: 'technical',
      category: 'Web Performance',
      questionText: 'Explain Server-Side Rendering (SSR) vs Server Components (RSC) in Next.js App Router. What are the key performance trade-offs?',
      expectedKeyPoints: [
        'RSC stays on server and sends zero JavaScript to client bundle',
        'SSR runs on server and hydrates component on client',
        'RSC reduces bundle size and enables direct DB/backend access',
        'Interactivity (state, hooks) requires Client Components ("use client")'
      ],
      difficulty: 'Medium'
    },
    {
      id: 'q3',
      type: 'behavioral',
      category: 'Behavioral & Leadership',
      questionText: 'Describe a situation where a critical production bug occurred right before a high-priority deadline. How did you diagnose, resolve, and communicate with stakeholders?',
      expectedKeyPoints: [
        'STAR method structure (Situation, Task, Action, Result)',
        'Triage, rollback/hotfix strategy, root cause analysis',
        'Clear, proactive transparent communication with team and leadership',
        'Post-mortem prevention measures'
      ],
      difficulty: 'Medium'
    }
  ],
  evaluations: {},
  currentQuestionIndex: 0,
  status: 'in_progress'
};
