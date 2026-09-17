'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Database, Cpu, Network, Layers, 
  CheckCircle2, Sparkles, 
  Brain, GitBranch, Target, Building2, Server, Search, 
  AlertCircle, FileText, Check, X, XCircle, RotateCcw, 
  ArrowRight, ArrowLeft, Lightbulb, RefreshCw, Trophy
} from 'lucide-react';
import { MCQPracticeQuestion, MCQAICoaching } from '@/types';
import { explainMCQWithAI, generateMCQsForTopic } from '@/lib/gemini';
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
    questions: [
      {
        id: 'dsa-1',
        q: 'What is the primary architectural difference between a Stack and a Queue, and how do their access patterns dictate their system use cases?',
        options: [
          'Stacks are FIFO (First-In-First-Out) used in asynchronous message queues; Queues are LIFO (Last-In-First-Out) used in memory call stacks.',
          'Stacks are LIFO (Last-In-First-Out) used for call stack management and recursion; Queues are FIFO (First-In-First-Out) used for breadth-first search and task buffers.',
          'Stacks guarantee O(1) random index access; Queues only allow sequential O(n) access.',
          'Stacks require contiguous heap memory; Queues can only ever be implemented using doubly linked lists.'
        ],
        correctAnswer: 1,
        explanation: 'A Stack strictly enforces LIFO (Last-In-First-Out), making it the natural model for recursion call frames, undo history, and syntax parsing. A Queue strictly enforces FIFO (First-In-First-Out), ordering items by arrival time, which is essential for BFS graph traversal, printer buffers, and job queues.',
        difficulty: 'Easy'
      },
      {
        id: 'dsa-2',
        q: 'What is the expected vs worst-case lookup time complexity in a self-balancing Binary Search Tree (AVL/Red-Black) compared to a Hash Table using chaining?',
        options: [
          'Balanced BST: O(1) expected and O(n) worst; Hash Table: O(log n) expected and O(log n) worst.',
          'Balanced BST: O(log n) expected and O(log n) worst; Hash Table: O(1) expected and O(n) worst when hash collisions degrade buckets.',
          'Balanced BST: O(log n) expected and O(n) worst; Hash Table: O(1) expected and O(1) guaranteed worst-case.',
          'Both data structures guarantee O(1) average and O(log n) worst-case lookup times.'
        ],
        correctAnswer: 1,
        explanation: 'A self-balancing BST enforces a height bound of O(log n), guaranteeing O(log n) lookup in both average and worst cases. A Hash Table offers O(1) average lookup via hash indexing, but in the pathological worst case where all keys hash to the same bucket (collision chain), search degrades to O(n) (or O(log k) in Java 8 treeified buckets).',
        difficulty: 'Medium'
      },
      {
        id: 'dsa-3',
        q: 'Which two fundamental mathematical properties must a problem satisfy for Dynamic Programming (DP) to yield a correct and optimal polynomial-time solution?',
        options: [
          'Greedy choice property and polynomial bounded input size.',
          'Optimal substructure and non-overlapping independent subproblems.',
          'Optimal substructure and overlapping subproblems.',
          'Markov memoryless state transitions and linear separability.'
        ],
        correctAnswer: 2,
        explanation: 'Dynamic Programming requires: 1. Optimal Substructure (an optimal global solution is composed of optimal solutions to its subproblems), and 2. Overlapping Subproblems (the recursive formulation encounters identical subproblems repeatedly, allowing caching via memoization or tabulation to prevent exponential re-computation).',
        difficulty: 'Hard'
      },
      {
        id: 'dsa-4',
        q: 'Why does standard Dijkstra\'s shortest path algorithm fail or produce incorrect results on directed graphs with negative edge weights?',
        options: [
          'Dijkstra uses a FIFO queue which deadlocks when encountering negative integers.',
          'It greedily assumes that once a vertex\'s minimum distance is popped from the priority queue, no shorter path to it can ever be found later via subsequent edges.',
          'Priority queues in standard libraries reject negative floating-point numbers.',
          'Negative weights turn the graph into an undirected bipartite graph where paths cannot be evaluated.'
        ],
        correctAnswer: 1,
        explanation: 'Dijkstra\'s algorithm relies on a greedy invariant: once a node is popped from the min-priority queue, its shortest path distance is permanently finalized because any alternate path through unvisited nodes must accumulate only non-negative additions. When negative edges exist, a longer positive path could later decrease in total cost via a negative edge, violating this invariant. Bellman-Ford or SPFA should be used instead.',
        difficulty: 'Medium'
      },
      {
        id: 'dsa-5',
        q: 'Which technique correctly detects the presence of a cycle in a Directed Graph in O(V + E) time?',
        options: [
          'Direct Disjoint Set Union (Union-Find) without edge orientation tracking.',
          'Depth-First Search (DFS) tracking nodes in the active recursion call stack (3-color state: White, Gray, Black).',
          'Dijkstra\'s algorithm by checking if the shortest path distance exceeds the vertex count.',
          'Single-source BFS without in-degree calculation.'
        ],
        correctAnswer: 1,
        explanation: 'In a directed graph, a cycle exists if and only if a back-edge points to an ancestor node currently in the active DFS recursion stack. The standard 3-color model marks nodes as White (unvisited), Gray (currently exploring in active call stack), and Black (fully explored). Encountering a Gray node indicates a directed cycle. Kahn\'s algorithm with in-degrees is another standard O(V+E) approach.',
        difficulty: 'Medium'
      }
    ]
  },
  'Object-Oriented Programming': {
    icon: <Layers className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      {
        id: 'oop-1',
        q: 'Which of the following pairs an OOP pillar with its foundational software engineering purpose?',
        options: [
          'Encapsulation: Bundling data and methods while restricting direct access to internal state via defined access modifiers.',
          'Inheritance: Hiding internal implementation logic behind simple abstract contracts.',
          'Abstraction: Enabling multiple derived classes to share global static variables.',
          'Polymorphism: Converting relational database tables into serialized JSON models.'
        ],
        correctAnswer: 0,
        explanation: 'Encapsulation bundles data (attributes) and the code (methods) that manipulates it while shielding internal representation from unintended external interference. Abstraction hides complexity behind interfaces. Inheritance enables hierarchical code reuse. Polymorphism allows disparate objects to respond to the same interface message.',
        difficulty: 'Easy'
      },
      {
        id: 'oop-2',
        q: 'In modern strongly-typed languages (like Java, C#, or TypeScript), what is the core structural difference between an Abstract Class and an Interface?',
        options: [
          'Abstract classes cannot contain concrete methods, while interfaces must contain complete implementations.',
          'A class can implement multiple interfaces but typically only inherit from a single abstract class; abstract classes can also maintain stateful instance fields.',
          'Interfaces can be instantiated directly with the "new" keyword, whereas abstract classes cannot.',
          'Interfaces are dynamically resolved at runtime, while abstract classes are compiled into static C routines.'
        ],
        correctAnswer: 1,
        explanation: 'Classes can implement multiple interfaces (contract-based composition) while single inheritance applies to classes (preventing the diamond problem). Abstract classes can hold non-static instance fields (state), constructors, and partial implementations, whereas interfaces traditionally define abstract capability contracts.',
        difficulty: 'Medium'
      },
      {
        id: 'oop-3',
        q: 'The Liskov Substitution Principle (LSP) in the SOLID design principles states that:',
        options: [
          'High-level modules should never depend upon low-level modules; both should depend on abstractions.',
          'A class should have one, and only one, reason to change.',
          'Subtypes must be substitutable for their base types without altering the correctness or desired properties of the program.',
          'Classes should be open for direct modification and closed for extension.'
        ],
        correctAnswer: 2,
        explanation: 'The Liskov Substitution Principle (LSP) demands that objects of a superclass should be replaceable with objects of a subclass without breaking application behavior or violating pre/post-conditions. A classic violation is a Square class inheriting from Rectangle, where mutating width changes height and violates rectangular assumptions.',
        difficulty: 'Hard'
      },
      {
        id: 'oop-4',
        q: 'How does runtime polymorphism (dynamic method dispatch) work under the hood in compiled object-oriented runtimes (such as C++ or the JVM)?',
        options: [
          'The compiler inlines every subclass implementation into a single monolithic switch statement.',
          'Each object instance contains a pointer to a Virtual Method Table (vtable) containing function pointers resolved at execution time.',
          'The runtime uses reflection to re-parse the source code on every method invocation.',
          'Methods are executed on background threads that send IPC messages to the operating system.'
        ],
        correctAnswer: 1,
        explanation: 'Dynamic dispatch utilizes a Virtual Method Table (vtable). Classes with virtual/overridden methods have a vtable holding pointers to their concrete implementations. Each object instance stores a hidden vptr pointing to its class vtable, allowing the runtime to dereference the exact derived method at O(1) overhead.',
        difficulty: 'Medium'
      }
    ]
  },
  'Database Management (DBMS)': {
    icon: <Database className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      {
        id: 'dbms-1',
        q: 'A relational database relation is in Third Normal Form (3NF) if and only if it is in 2NF and:',
        options: [
          'All columns contain only alphanumeric string values.',
          'There are no transitive functional dependencies of non-prime attributes on the primary key.',
          'Every attribute in the table is a candidate primary key.',
          'It has no foreign key relationships with any other table in the schema.'
        ],
        correctAnswer: 1,
        explanation: '3NF builds on 2NF (which removes partial dependencies on composite keys) by eliminating transitive dependencies (X -> Y and Y -> Z where Z is a non-prime attribute). Every non-prime attribute must depend on "the key, the whole key, and nothing but the key".',
        difficulty: 'Medium'
      },
      {
        id: 'dbms-2',
        q: 'Which ACID property guarantees that once a database transaction commits, its modifications are permanently recorded even in the event of an abrupt power outage or system crash?',
        options: [
          'Atomicity',
          'Consistency',
          'Isolation',
          'Durability'
        ],
        correctAnswer: 3,
        explanation: 'Durability ensures that committed transaction state survives crashes or server reboots. Modern relational databases achieve this through Write-Ahead Logging (WAL): transaction logs are flushed to persistent disk before the commit acknowledgement is returned to the client.',
        difficulty: 'Easy'
      },
      {
        id: 'dbms-3',
        q: 'According to Brewer\'s CAP Theorem, when an unavoidable network partition (P) occurs between distributed nodes, what fundamental trade-off must the system make?',
        options: [
          'Choose between Encryption (E) and Throughput (T).',
          'Choose between Consistency (C) and Availability (A).',
          'Choose between Read Throughput (R) and Write Latency (W).',
          'Choose between ACID transactions and Multi-Tenancy.'
        ],
        correctAnswer: 1,
        explanation: 'When network partitions occur, distributed databases must choose between Consistency (returning errors or blocking writes to prevent stale or divergent data across partitions) or Availability (accepting reads and writes on all available nodes, allowing temporary data divergence/stale reads).',
        difficulty: 'Medium'
      },
      {
        id: 'dbms-4',
        q: 'Why do relational database engines (like MySQL InnoDB and PostgreSQL) default to B+ Tree indexes over Hash indexes for primary keys and general columns?',
        options: [
          'Hash indexes consume O(n^2) disk space whereas B+ Trees require zero disk storage.',
          'B+ Trees efficiently support range queries (e.g. BETWEEN, <, >, ORDER BY) because all leaf nodes are sequentially linked in sorted order.',
          'Hash indexes cannot handle numeric data types.',
          'B+ Trees guarantee O(1) point lookups for all arbitrary string queries.'
        ],
        correctAnswer: 1,
        explanation: 'Hash indexes offer O(1) equality lookups (WHERE id = 5) but are incapable of evaluating range scans (WHERE age BETWEEN 20 AND 30) or ordered traversals (ORDER BY). In a B+ Tree, internal nodes store indexing guides while leaf nodes contain all keys and data pointers in sorted, doubly linked order, enabling O(log N + K) range scans.',
        difficulty: 'Hard'
      }
    ]
  },
  'Operating Systems (OS)': {
    icon: <Cpu className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      {
        id: 'os-1',
        q: 'What is the primary difference in memory space and context switching overhead between an OS Process and a Thread?',
        options: [
          'Processes share memory space and have zero switching overhead; Threads have isolated memory and require MMU remapping.',
          'Processes have independent address spaces requiring page table and MMU cache (TLB) flushes during context switches; Threads within a process share the same virtual address space, making thread switches significantly faster.',
          'Threads can only run on single-core CPUs; Processes require multi-core CPUs.',
          'Processes are managed strictly in user space, while all Threads are kernel routines.'
        ],
        correctAnswer: 1,
        explanation: 'Processes have independent virtual memory address spaces. Switching between processes requires updating page directory base registers and invalidating/flushing the Translation Lookaside Buffer (TLB). Threads in the same process share virtual memory, file descriptors, and heap, so thread context switching only saves registers and stack pointers without TLB invalidation.',
        difficulty: 'Easy'
      },
      {
        id: 'os-2',
        q: 'Which of the following is NOT one of the four mandatory Coffman conditions required for a Deadlock to occur?',
        options: [
          'Mutual Exclusion: Resources cannot be shared simultaneously.',
          'Hold and Wait: Processes holding allocated resources can request additional ones.',
          'Preemption: The operating system forcefully confiscates resources from waiting processes at any time.',
          'Circular Wait: A closed chain of processes exists where each holds a resource needed by the next.'
        ],
        correctAnswer: 2,
        explanation: 'The four Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources CANNOT be forcibly confiscated from a process), and 4. Circular Wait. If preemption were allowed, deadlocks could be preemptively resolved by revoking resources.',
        difficulty: 'Medium'
      },
      {
        id: 'os-3',
        q: 'In virtual memory systems, what is a Page Fault, and what happens when the requested page is not in physical RAM?',
        options: [
          'A hardware memory bus short-circuit that forces an immediate CPU kernel panic.',
          'A trap triggered by the Memory Management Unit (MMU) when a referenced virtual page is not marked present in RAM, causing the OS to swap it in from secondary disk storage.',
          'A compiler syntax error generated when dereferencing null pointers in C++.',
          'A network timeout when reading remote distributed memory cache.'
        ],
        correctAnswer: 1,
        explanation: 'When the CPU looks up a virtual address whose page table entry has the "present bit" set to 0, the MMU issues a page fault interrupt. The OS interrupt handler suspends the thread, locates the page in swap space on disk, loads it into an available physical RAM frame, updates the page table entry, and restarts the faulting instruction.',
        difficulty: 'Hard'
      }
    ]
  },
  'Computer Networks (CN)': {
    icon: <Network className="w-5 h-5" />,
    categoryType: 'cs_fundamental',
    questions: [
      {
        id: 'cn-1',
        q: 'What is the exact sequence of packets exchanged to establish a reliable connection in the TCP 3-Way Handshake?',
        options: [
          'ACK -> SYN -> SYN-ACK',
          'SYN -> SYN-ACK -> ACK',
          'FIN -> ACK -> FIN-ACK',
          'PING -> PONG -> CONNECT'
        ],
        correctAnswer: 1,
        explanation: 'The TCP handshake sequence is: 1. Client sends SYN (Synchronize sequence number) to server; 2. Server responds with SYN-ACK (acknowledging client sequence number and sending its own sequence number); 3. Client replies with ACK (acknowledging server sequence number). The connection is now established.',
        difficulty: 'Easy'
      },
      {
        id: 'cn-2',
        q: 'How does HTTP/2 solve the Head-of-Line (HoL) blocking problem present at the application layer in HTTP/1.1?',
        options: [
          'By running exclusively over UDP instead of TCP.',
          'By using binary framing to multiplex multiple concurrent bidirectional request/response streams over a single TCP connection.',
          'By disabling HTTP cookies and headers entirely.',
          'By requiring each client to establish 100 parallel TCP sockets to every server.'
        ],
        correctAnswer: 1,
        explanation: 'HTTP/1.1 suffered from application-layer Head-of-Line blocking because requests on a single connection had to be serialized sequentially. HTTP/2 introduced binary framing, allowing multiple logical request/response streams to be interleaved and multiplexed simultaneously over a single persistent TCP connection.',
        difficulty: 'Medium'
      },
      {
        id: 'cn-3',
        q: 'What architectural innovation does HTTP/3 introduce by replacing TCP with the QUIC protocol over UDP?',
        options: [
          'It eliminates transport-layer Head-of-Line blocking (a single lost packet only delays its specific stream rather than all streams) and enables zero-RTT connection resumption.',
          'It replaces TLS encryption with plain unencrypted text for lower latency.',
          'It eliminates DNS lookup by hardcoding IP addresses into browser binaries.',
          'It limits all web requests to a maximum payload of 64 bytes.'
        ],
        correctAnswer: 0,
        explanation: 'While HTTP/2 multiplexed streams over TCP, a single lost TCP packet stalled ALL streams in the connection until retransmitted (TCP-level HoL blocking). QUIC operates over UDP and manages individual stream retransmissions independently. It also merges transport and cryptographic handshakes for 0-RTT/1-RTT connection setup.',
        difficulty: 'Hard'
      }
    ]
  },
  'Google Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: [
      {
        id: 'goog-1',
        q: 'Google Scale: In designing a distributed crawler indexing billions of pages daily, how do systems prevent overwhelming individual webmasters while avoiding duplicate crawls?',
        options: [
          'By using synchronous HTTP GET loops on a single large compute instance with no local state.',
          'By employing Per-Host Politeness Queues with configurable domain rate limits, coupled with Bloom Filters and SimHash fingerprinting for URL and content deduplication.',
          'By issuing ICMP ping bursts to every domain prior to web page downloading.',
          'By spawning an isolated headless browser for each hyperlink without checking history.'
        ],
        correctAnswer: 1,
        explanation: 'At Google scale, the URL frontier organizes fetch queues into per-host politeness queues ensuring safe delays between requests to the same host. URL deduplication uses scalable distributed Bloom Filters, while near-duplicate content is identified using SimHash or MinHash locality-sensitive hashing.',
        difficulty: 'Hard'
      },
      {
        id: 'goog-2',
        q: 'Search Rank: In Google\'s foundational PageRank algorithm, why is the Damping Factor (typically d = 0.85) mathematically necessary for convergence?',
        options: [
          'It stops spider-traps (cyclic link loops) and sink nodes (dead-ends) from absorbing all rank, ensuring the Markov chain converges to a unique stationary distribution.',
          'It compresses the graph adjacency matrix into 16-bit integers for disk serialization.',
          'It calculates ad pricing bidding thresholds based on click probability.',
          'It filters out non-indexed PDF files from the link matrix.'
        ],
        correctAnswer: 0,
        explanation: 'Without the damping factor d, dead ends (nodes with no outgoing links) act as rank sinks, and isolated cycles act as spider traps that trap all probability mass. The (1-d)/N uniform probability of jumping to a random page ensures the transition matrix is stochastic, irreducible, and aperiodic, guaranteeing convergence via the Perron-Frobenius theorem.',
        difficulty: 'Hard'
      },
      {
        id: 'goog-3',
        q: 'Systems: What occurs during the Shuffle and Sort phase of the Google MapReduce computing paradigm?',
        options: [
          'Mappers delete their input files to free up local disk space.',
          'Intermediate key-value pairs produced by mappers are partitioned, transferred over the network, and sorted by key so each reducer receives all values for a given key.',
          'Data is automatically transformed into relational SQL schemas.',
          'Failed compute nodes are permanently disconnected from the data center power grid.'
        ],
        correctAnswer: 1,
        explanation: 'The Shuffle and Sort phase acts as the communication pipeline between Map and Reduce: it routes intermediate outputs from all mapper machines across the cluster (partitioned by hash(key) mod R), sorts them by key, and streams values grouped by key into the appropriate Reducer task.',
        difficulty: 'Medium'
      },
      {
        id: 'goog-4',
        q: 'Storage: In Google Bigtable and modern LSM-Tree storage engines (like RocksDB), how are writes and reads handled to sustain massive write throughput?',
        options: [
          'Writes overwrite existing disk records directly in place via B-Tree page splits.',
          'Writes are sequentially appended to a Write-Ahead Log (WAL) and stored in an in-memory MemTable; background threads periodically flush sorted MemTables to immutable SSTables on disk.',
          'Data is kept strictly in RAM without any disk persistence.',
          'Every write triggers a cluster-wide distributed lock that halts reads.'
        ],
        correctAnswer: 1,
        explanation: 'Log-Structured Merge-Trees (LSM) convert random disk writes into high-speed sequential writes. Incoming writes are appended to a commit log for durability and inserted into a sorted in-memory MemTable (skip list). When full, the MemTable is flushed to disk as an immutable SSTable. Reads consult MemTable, Bloom filters, and SSTables.',
        difficulty: 'Hard'
      }
    ]
  },
  'Amazon Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: [
      {
        id: 'amzn-1',
        q: 'STAR Leadership: Under Amazon\'s hallmark "Customer Obsession" principle, which product design methodology is standard across engineering and leadership teams?',
        options: [
          'Build features first and solicit customer feedback only after production deployment.',
          'Working Backwards: Drafting an internal Press Release and FAQ (PR/FAQ) from the customer perspective before writing any engineering code.',
          'Copying top competitor interfaces and matching their UI designs pixel-for-pixel.',
          'Maximizing sprint code commit count regardless of error budgets or user tickets.'
        ],
        correctAnswer: 1,
        explanation: 'Amazon\'s "Working Backwards" process requires engineering and product teams to write a customer-centric Press Release announcing the finished solution and an exhaustive internal/external FAQ (PR/FAQ) confronting customer pain points and technical risks before engineering investment begins.',
        difficulty: 'Easy'
      },
      {
        id: 'amzn-2',
        q: 'Scale: During massive shopping traffic events (like Prime Day), how does Amazon DynamoDB balance read availability and latency?',
        options: [
          'By enforcing heavy two-phase commit (2PC) locks across all global replicas on every read.',
          'By providing Eventually Consistent reads by default (halving RCU cost and latency) while supporting Strongly Consistent reads and ACID transactions when requested.',
          'By storing all shopping cart changes only in the user\'s local browser cookie.',
          'By rejecting all write requests once database CPU crosses 50%.'
        ],
        correctAnswer: 1,
        explanation: 'DynamoDB partitions data across multi-AZ storage nodes using consistent hashing and Paxos consensus. By default, reads are Eventually Consistent (costing 0.5 Read Capacity Units and querying any replica), optimizing for maximum availability and single-digit millisecond latency. Strongly Consistent reads (1 RCU) query the leader replica.',
        difficulty: 'Hard'
      },
      {
        id: 'amzn-3',
        q: 'Operations: Why must microservice consumers processing orders from AWS SQS (Simple Queue Service) standard queues be strictly idempotent?',
        options: [
          'Standard SQS guarantees at-least-once delivery, meaning network retries or visibility timeouts can cause duplicate message delivery.',
          'Standard SQS only allows each message to be read exactly once in its entire lifetime.',
          'SQS automatically cancels credit card payments if duplicate messages are detected.',
          'Messages in SQS are deleted automatically as soon as they are placed on the queue.'
        ],
        correctAnswer: 0,
        explanation: 'Standard SQS queues guarantee "at-least-once" delivery to preserve high throughput and fault tolerance. In network timeouts or consumer crashes, duplicate message deliveries occur. Consumers must use idempotency keys (e.g. unique Order ID in a database unique constraint) so re-processing does not duplicate charges or inventory reservations.',
        difficulty: 'Medium'
      },
      {
        id: 'amzn-4',
        q: 'Architecture: In high-concurrency flash sales, how can systems prevent stock overselling without bottlenecking database row-level pessimistic locks?',
        options: [
          'By running an unindexed SQL update with no transaction boundaries.',
          'By using Optimistic Concurrency Control (version numbers / conditional writes) and pre-allocating inventory buckets in an in-memory cache (Redis) with atomic DECR operations.',
          'By taking down the website and processing purchases manually via email.',
          'By allowing negative inventory counts and dealing with customer returns later.'
        ],
        correctAnswer: 1,
        explanation: 'Pessimistic DB row locks cause connection pool exhaustion during flash sales. High-performance architectures decouple validation via in-memory Redis atomic Lua scripts (DECR stock >= 1) or conditional updates in DynamoDB (attribute_exists & stock > 0) with versioning, queuing verified orders for asynchronous database persistence.',
        difficulty: 'Hard'
      }
    ]
  },
  'Meta Prep': {
    icon: <Building2 className="w-5 h-5" />,
    categoryType: 'company_prep',
    questions: [
      {
        id: 'meta-1',
        q: 'Frontend: What critical performance limitation of React\'s legacy Stack Reconciler did the React Fiber rewrite resolve?',
        options: [
          'It allowed React apps to run without any JavaScript engine.',
          'It replaced synchronous, un-interruptible recursive tree traversals with an incremental work loop that yields control back to the browser to maintain 60 FPS responsiveness.',
          'It automatically converted all CSS files into WebAssembly binaries.',
          'It replaced all DOM elements with Canvas drawing calls.'
        ],
        correctAnswer: 1,
        explanation: 'The legacy Stack Reconciler executed rendering synchronously and recursively until the entire component tree was traversed. On heavy updates, this monopolized the browser main thread and caused dropped frames (jank). Fiber restructured the tree into a linked list of fiber nodes, enabling cooperative multitasking: yielding work, prioritizing user inputs, and pausing work.',
        difficulty: 'Hard'
      },
      {
        id: 'meta-2',
        q: 'Infrastructure: In Meta\'s real-time notification service serving 2+ billion active accounts, how are push updates delivered to client devices efficiently?',
        options: [
          'All mobile clients continuously poll SQL databases every 200 milliseconds.',
          'Stateless edge connection gateways maintain persistent lightweight MQTT/WebSocket connections, wired to a distributed real-time Pub/Sub message broker.',
          'Direct peer-to-peer WebRTC mesh links between all friends on the platform.',
          'Sending automated voice calls to mobile numbers for each notification.'
        ],
        correctAnswer: 1,
        explanation: 'At Meta scale, persistent connections (MQTT or WebSocket) are held by dedicated edge gateway machines. When a notification event occurs, backend services publish to an internal distributed event pipeline which routes the message directly to the specific gateway holding the user\'s live connection socket.',
        difficulty: 'Hard'
      },
      {
        id: 'meta-3',
        q: 'Distributed Cache: In Meta\'s large-scale Memcached infrastructure, what problem does the "Lease" mechanism solve?',
        options: [
          'It automates server hardware leasing from cloud vendors.',
          'It mitigates "Cache Stampedes" (thundering herds on cache misses) and prevents stale sets caused by out-of-order writes.',
          'It encrypts cached data with public/private keys on every GET request.',
          'It restricts cache access to users with verified badges.'
        ],
        correctAnswer: 1,
        explanation: 'When a cache miss occurs, Memcached grants the client a 64-bit lease token. Only that client is permitted to query the database and write the value back, preventing thousands of concurrent queries from stampeding the DB simultaneously (thundering herd). If an invalidation occurs before the write-back, the lease is invalidated, preventing stale overwrites.',
        difficulty: 'Hard'
      },
      {
        id: 'meta-4',
        q: 'Data Fetching: In GraphQL architectures, what is the N+1 problem and how does Facebook/Meta\'s DataLoader pattern resolve it?',
        options: [
          'It is a math bug in the GraphQL AST parser that duplicates fields.',
          'Individual resolvers fire separate SQL queries for each child record (1 query for parents + N queries for children); DataLoader batches queries into a single "WHERE id IN (...)" call using event-loop tick scheduling and memoization caching.',
          'N+1 refers to creating N additional GraphQL servers for each user login.',
          'It forces clients to download the entire database schema before every query.'
        ],
        correctAnswer: 1,
        explanation: 'When querying a list of posts and their authors, naive resolvers fetch the post list (1 query) and then resolve authors individually (N queries). DataLoader solves this by collecting IDs requested within a single JavaScript event loop tick and dispatching one single batched query (e.g. SELECT * FROM users WHERE id IN (...)), while caching per-request results.',
        difficulty: 'Medium'
      }
    ]
  },
  'Machine Learning & AI': {
    icon: <Brain className="w-5 h-5" />,
    categoryType: 'role_domain',
    questions: [
      {
        id: 'ml-1',
        q: 'Ensemble Learning: What is the fundamental bias-variance trade-off difference between Bagging (e.g. Random Forests) and Boosting (e.g. XGBoost)?',
        options: [
          'Bagging reduces variance by averaging independent high-variance learners trained in parallel; Boosting reduces bias by training weak learners sequentially on residual errors.',
          'Bagging only reduces bias, while Boosting only reduces variance.',
          'Bagging can only be used for classification; Boosting is exclusively for regression.',
          'Bagging trains models sequentially; Boosting trains models in parallel.'
        ],
        correctAnswer: 0,
        explanation: 'Bagging (Bootstrap Aggregation) trains deep, unpruned decision trees (high variance, low bias) in parallel on bootstrap sample subsets; averaging their predictions reduces variance without increasing bias. Boosting trains shallow trees (high bias, low variance) sequentially, where each successive model focuses on errors/residuals from the previous one, reducing bias.',
        difficulty: 'Medium'
      },
      {
        id: 'ml-2',
        q: 'Deep Learning: Why does the Vanishing Gradient problem occur during backpropagation in deep networks using Sigmoid/Tanh activations, and how do ResNets solve it?',
        options: [
          'Loss functions output negative numbers that crash matrix multiplication.',
          'Repeated chain-rule multiplication of derivatives less than 1 causes early layer gradients to decay exponentially toward zero; ResNets add identity skip connections [F(x) + x] that allow gradients to flow back unaltered.',
          'Learning rates drop to zero automatically after epoch 1 in deep models.',
          'Weights in dense layers overflow 64-bit floating point precision.'
        ],
        correctAnswer: 1,
        explanation: 'Sigmoid derivatives peak at 0.25 (tanh at 1.0). Backpropagation multiplies these layer derivatives through the chain rule. Over dozens of layers, product chains shrink exponentially, starving early layers of updates. ResNet introduces identity shortcut connections: Output = F(x) + x. The derivative contains a "+ 1" term, ensuring gradient signals propagate directly backward.',
        difficulty: 'Hard'
      },
      {
        id: 'ml-3',
        q: 'Evaluation: In highly imbalanced classification problems (e.g. credit card fraud where positive fraud cases represent only 0.05% of data), why is standard Accuracy a flawed metric?',
        options: [
          'Accuracy requires calculating square roots which cannot run on GPU tensor cores.',
          'A trivial model predicting "No Fraud" for every sample achieves 99.95% accuracy while failing to detect any fraud; metrics like PR-AUC, F1-Score, and Precision/Recall must be used.',
          'Accuracy is mathematically undefined for binary classification.',
          'Accuracy only works when datasets contain fewer than 1,000 examples.'
        ],
        correctAnswer: 1,
        explanation: 'When 99.95% of records are negative, a dumb model predicting negative 100% of the time scores 99.95% accuracy but is completely useless. Precision-Recall AUC, F1-Score (harmonic mean of Precision and Recall), and confusion matrices properly reflect the model\'s efficacy at identifying rare positive instances.',
        difficulty: 'Easy'
      },
      {
        id: 'ml-4',
        q: 'Transformers: In standard Multi-Head Self-Attention (as in original BERT/GPT architectures), what is the computational and memory complexity with respect to input sequence length N?',
        options: [
          'O(N) linear complexity in both time and memory.',
          'O(N^2) quadratic complexity because every token computes attention weights against every other token in the sequence.',
          'O(log N) logarithmic complexity via binary search index trees.',
          'O(N!) factorial complexity due to token permutations.'
        ],
        correctAnswer: 1,
        explanation: 'The self-attention calculation Q * K^T produces an N x N attention matrix for sequence length N. Calculating, storing, and applying Softmax over this matrix requires O(N^2) time and memory, which is why handling very long contexts (e.g. 100k+ tokens) motivates architectures like FlashAttention, Sparse Attention, or linear attention alternatives.',
        difficulty: 'Hard'
      }
    ]
  },
  'DevOps & SRE': {
    icon: <Server className="w-5 h-5" />,
    categoryType: 'role_domain',
    questions: [
      {
        id: 'devops-1',
        q: 'Resilience: What are the three states of the Circuit Breaker pattern, and what prompts the transition from "Open" to "Half-Open"?',
        options: [
          'Pending, Active, Completed; triggered by a manual DevOps deploy command.',
          'Closed (normal operations), Open (failing fast), and Half-Open (trial probe); transitioned from Open to Half-Open after a configured cooldown sleep window elapses.',
          'Read-Only, Write-Only, Full-Access; triggered when system disk usage exceeds 90%.',
          'Alpha, Beta, Production; triggered when integration unit tests pass.'
        ],
        correctAnswer: 1,
        explanation: 'In "Closed", traffic executes normally. If failures exceed an error rate threshold, the circuit trips to "Open", immediately rejecting requests with fallbacks to avoid overloading downstream services. After a cooldown delay, it switches to "Half-Open", allowing a small probe of requests through. If those succeed, it resets to "Closed"; if they fail, it reopens.',
        difficulty: 'Medium'
      },
      {
        id: 'devops-2',
        q: 'Kubernetes: How does the Kubernetes Horizontal Pod Autoscaler (HPA) controller compute the target replica count?',
        options: [
          'It randomly doubles pod replicas whenever network latency increases.',
          'Using the formula: desiredReplicas = ceil[ currentReplicas * ( currentMetricValue / targetMetricValue ) ] based on metrics collected from the metrics-server or Prometheus.',
          'By rebooting the worker node if pod CPU usage drops below 20%.',
          'By reading manual replica counts written in commit messages.'
        ],
        correctAnswer: 1,
        explanation: 'The HPA loop periodically queries the metrics API and calculates desiredReplicas = ceil[ currentReplicas * (currentMetricValue / targetMetricValue) ]. It also enforces configured min/max boundaries and stabilization delay windows to avoid rapid scaling oscillations (flapping).',
        difficulty: 'Medium'
      },
      {
        id: 'devops-3',
        q: 'Zero-Downtime Deployment: What is the architectural difference between Blue-Green deployments and Canary deployments?',
        options: [
          'Blue-Green runs on mobile devices; Canary runs only in desktop web browsers.',
          'Blue-Green maintains two identical environments and swaps 100% of traffic instantly at the router; Canary routes a small percentage (e.g. 5%) of live traffic to the new version first to monitor health before broader rollout.',
          'Canary requires shutting down the cluster database; Blue-Green does not use a database.',
          'Blue-Green is an AWS exclusive feature; Canary is restricted to Linux Docker.'
        ],
        correctAnswer: 1,
        explanation: 'Blue-Green maintains two parallel production environments; traffic is instantly switched from Blue (old) to Green (new) via load balancer. Canary releases deploy the new version alongside existing pods, directing a small fraction of real production traffic (e.g. 2%-10%) while tracking error rates and telemetry before progressively expanding to 100%.',
        difficulty: 'Hard'
      },
      {
        id: 'devops-4',
        q: 'Site Reliability Engineering (SRE): How are SLA, SLO, and SLI related, and what is an Error Budget?',
        options: [
          'They are financial metrics used by the accounting department to calculate cloud tax deductions.',
          'SLI is the measured metric (e.g. latency), SLO is the internal target (e.g. 99.9% under 200ms), SLA is the legal customer commitment with penalties, and the Error Budget is the remaining permitted unreliability (100% - SLO) usable for feature velocity.',
          'SLA is measured in bits, SLO in bytes, and SLI in gigabytes.',
          'Error Budget is the maximum dollar amount an engineering team can spend on AWS in a month.'
        ],
        correctAnswer: 1,
        explanation: 'SLI (Service Level Indicator) measures actual system performance (e.g. percentage of successful requests). SLO (Service Level Objective) is the internal reliability target agreed upon with product teams (e.g. 99.9%). SLA (Service Level Agreement) is the external contractual commitment with business consequences. The Error Budget is 1 - SLO (e.g. 0.1% downtime); if exhausted, feature deploys pause in favor of stability.',
        difficulty: 'Easy'
      }
    ]
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
                    onClick={() => {
                      setSelectedTopic(topic);
                      setSelectedQuestionIndex(0);
                      setSelectedOption(null);
                      setIsSubmitted(false);
                      setAiCoaching(null);
                    }}
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
