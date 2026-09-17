import { MCQPracticeQuestion } from '@/types';

export const csFundamentalsQuestions: Record<string, MCQPracticeQuestion[]> = {
  'Data Structures & Algorithms': [
    // 6 Easy
    {
      id: 'dsa-e1',
      q: 'What is the primary architectural difference between a Stack and a Queue, and what are their access patterns?',
      options: [
        'Stacks are FIFO (First-In-First-Out); Queues are LIFO (Last-In-First-Out).',
        'Stacks are LIFO (Last-In-First-Out); Queues are FIFO (First-In-First-Out).',
        'Stacks allow random index access in O(1); Queues require sequential traversal.',
        'Stacks store only primitive values; Queues store object references.'
      ],
      correctAnswer: 1,
      explanation: 'A Stack enforces LIFO (Last-In-First-Out), commonly used in function call stacks and undo operations. A Queue enforces FIFO (First-In-First-Out), commonly used in BFS traversals and task scheduling buffers.',
      difficulty: 'Easy'
    },
    {
      id: 'dsa-e2',
      q: 'What is the worst-case time complexity of searching for an element in an unsorted singly linked list of size n?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswer: 2,
      explanation: 'In a singly linked list, elements are connected via pointers rather than contiguous memory. Searching requires traversing sequentially from head to tail, resulting in O(n) worst-case time complexity.',
      difficulty: 'Easy'
    },
    {
      id: 'dsa-e3',
      q: 'Which data structure gives O(1) average time complexity for both insertion and key lookup?',
      options: ['Hash Table / Hash Map', 'Binary Search Tree', 'Min-Heap', 'Sorted Array'],
      correctAnswer: 0,
      explanation: 'Hash Tables use a hashing function to map keys directly to bucket indices in an underlying array, achieving O(1) average time complexity for lookup, insertion, and deletion.',
      difficulty: 'Easy'
    },
    {
      id: 'dsa-e4',
      q: 'What is the time complexity of pushing an element onto the top of an array-backed stack with amortized doubling capacity?',
      options: ['O(1) amortized', 'O(log n)', 'O(n) guaranteed', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'While resizing the array takes O(n) time, resizing occurs exponentially infrequently (when capacity doubles). Over a sequence of operations, the average work per push is O(1) amortized.',
      difficulty: 'Easy'
    },
    {
      id: 'dsa-e5',
      q: 'Which graph traversal algorithm uses a FIFO Queue to visit nodes layer by layer?',
      options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Topological Sort', 'Kruskal\'s Algorithm'],
      correctAnswer: 0,
      explanation: 'Breadth-First Search (BFS) explores all neighbors at distance d before moving to distance d + 1, which requires a FIFO Queue to maintain level-order exploration.',
      difficulty: 'Easy'
    },
    {
      id: 'dsa-e6',
      q: 'In a complete binary tree with n nodes, what is the maximum height of the tree?',
      options: ['floor(log2(n))', 'n / 2', 'n - 1', 'sqrt(n)'],
      correctAnswer: 0,
      explanation: 'Because every level except possibly the last is completely filled in a complete binary tree, its height is strictly bounded by floor(log2(n)).',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'dsa-m1',
      q: 'What is the expected vs worst-case lookup time complexity in a self-balancing Binary Search Tree (AVL/Red-Black) compared to a Hash Table using chaining?',
      options: [
        'Balanced BST: O(1) expected and O(n) worst; Hash Table: O(log n) expected and O(log n) worst.',
        'Balanced BST: O(log n) expected and O(log n) worst; Hash Table: O(1) expected and O(n) worst due to hash collisions.',
        'Balanced BST: O(log n) expected and O(n) worst; Hash Table: O(1) expected and O(1) guaranteed worst-case.',
        'Both data structures guarantee O(1) average and O(log n) worst-case lookup times.'
      ],
      correctAnswer: 1,
      explanation: 'Self-balancing BSTs maintain an O(log n) height invariant, ensuring O(log n) search in both average and worst cases. Hash Tables provide O(1) average lookup, but degrade to O(n) when all keys hash to a single bucket.',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m2',
      q: 'Why does standard Dijkstra\'s shortest path algorithm fail or produce incorrect results on directed graphs with negative edge weights?',
      options: [
        'Dijkstra uses a FIFO queue which deadlocks on negative numbers.',
        'It greedily finalizes the shortest distance of a node upon extraction from the priority queue, assuming no future edge could reduce it.',
        'Priority queues reject negative values in standard runtimes.',
        'Negative weights turn the graph into an undirected bipartite graph.'
      ],
      correctAnswer: 1,
      explanation: 'Dijkstra assumes that adding edges to an existing shortest path only increases distance. When negative edges exist, a longer prefix path might become shorter later, violating the greedy optimality principle. Bellman-Ford must be used instead.',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m3',
      q: 'Which technique correctly detects the presence of a cycle in a Directed Graph in O(V + E) time?',
      options: [
        'Disjoint Set Union (Union-Find) without edge orientation tracking.',
        'DFS tracking nodes in the active recursion call stack (3-color state: White, Gray, Black).',
        'Dijkstra\'s algorithm checking if path distance exceeds V.',
        'Single-source BFS without in-degree calculation.'
      ],
      correctAnswer: 1,
      explanation: 'In a directed graph, a cycle exists if and only if a back-edge points to an ancestor node currently in the active DFS recursion stack. The 3-color model marks nodes as unvisited (white), active in recursion stack (gray), and finished (black).',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m4',
      q: 'What is the optimal average and worst-case time complexity of QuickSort, and what causes the worst-case behavior?',
      options: [
        'Average: O(n log n), Worst: O(n log n); caused by duplicate values.',
        'Average: O(n log n), Worst: O(n^2); caused by unbalanced partitions (e.g. picking minimum/maximum element as pivot on sorted data).',
        'Average: O(n), Worst: O(n log n); caused by randomized pivot selection.',
        'Average: O(n^2), Worst: O(n^2); caused by recursive call stack overflow.'
      ],
      correctAnswer: 1,
      explanation: 'QuickSort splits arrays around a pivot. When partitions are balanced (n/2, n/2), it achieves O(n log n). When partitions are maximally skewed (e.g. 1 and n-1 each round), recursion depth reaches n, degrading to O(n^2).',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m5',
      q: 'Which data structure is most optimal for implementing a Least Recently Used (LRU) Cache with O(1) get and put operations?',
      options: [
        'Hash Map + Doubly Linked List',
        'Binary Search Tree + Queue',
        'Min-Heap + Array',
        'Single Linked List + Stack'
      ],
      correctAnswer: 0,
      explanation: 'A Hash Map provides O(1) lookup of node pointers, while a Doubly Linked List enables O(1) removal and re-insertion of accessed nodes to the front/tail, satisfying O(1) get and put.',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m6',
      q: 'In the Two-Pointer technique for checking if an array has two numbers that sum to target T, why must the array be sorted first?',
      options: [
        'Because binary search is required to compute pointer indices.',
        'Because sorting guarantees that moving the left pointer right increases the sum and moving the right pointer left decreases the sum.',
        'Because unsorted arrays cannot be indexed in modern hardware.',
        'Sorting is not required; two pointers work on arbitrary unsorted collections.'
      ],
      correctAnswer: 1,
      explanation: 'Sorting provides monotonic behavior: if sum < target, incrementing left increases the sum; if sum > target, decrementing right decreases the sum. Without sorting, directionality is lost.',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m7',
      q: 'What is the maximum number of comparisons required to find an element using Binary Search on a sorted array of 1,024 elements?',
      options: ['10', '11', '1024', '512'],
      correctAnswer: 1,
      explanation: 'Binary search halves the search space each step. For n = 1024 = 2^10, the maximum number of comparisons is floor(log2(1024)) + 1 = 10 + 1 = 11.',
      difficulty: 'Medium'
    },
    {
      id: 'dsa-m8',
      q: 'What is the time complexity of building a Binary Min-Heap from an unsorted array of n elements using the bottom-up Floyd\'s heapify algorithm?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n^2)'],
      correctAnswer: 0,
      explanation: 'Bottom-up heapify runs sift-down starting from leaves up to the root. Because the majority of nodes are near the bottom and have small heights, the summation sum(h * n / 2^(h+1)) converges mathematically to O(n).',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'dsa-h1',
      q: 'Which two fundamental mathematical properties must a problem satisfy for Dynamic Programming (DP) to yield an optimal polynomial-time solution?',
      options: [
        'Greedy choice property and polynomial bounded input size.',
        'Optimal substructure and non-overlapping independent subproblems.',
        'Optimal substructure and overlapping subproblems.',
        'Markov memoryless state transitions and linear separability.'
      ],
      correctAnswer: 2,
      explanation: 'DP requires: 1. Optimal Substructure (global optimal solution consists of optimal solutions to subproblems), and 2. Overlapping Subproblems (the same subproblems are solved repeatedly, enabling memoization or tabulation).',
      difficulty: 'Hard'
    },
    {
      id: 'dsa-h2',
      q: 'In the Knuth-Morris-Pratt (KMP) string matching algorithm, what does the Longest Proper Prefix which is also Suffix (LPS) array allow the search pointer to do?',
      options: [
        'Skip directly to the end of the text on any mismatch.',
        'Avoid re-examining characters in the main text that have already been matched.',
        'Convert string characters to ASCII hash values.',
        'Reverse the pattern string to match from right to left.'
      ],
      correctAnswer: 1,
      explanation: 'The LPS array precomputes self-overlaps in the pattern. On a character mismatch, KMP slides the pattern to the next valid prefix alignment without ever decrementing or re-scanning the main text pointer, achieving linear O(N + M) matching.',
      difficulty: 'Hard'
    },
    {
      id: 'dsa-h3',
      q: 'In a Segment Tree with n elements, what are the time complexities for point update and arbitrary range sum query?',
      options: [
        'Update: O(1), Query: O(n)',
        'Update: O(log n), Query: O(log n)',
        'Update: O(n), Query: O(1)',
        'Update: O(log n), Query: O(1)'
      ],
      correctAnswer: 1,
      explanation: 'A segment tree is a balanced binary tree of height O(log n). A point update modifies one leaf and recalculates values along the path to the root in O(log n). A range query decomposes the range into at most 2 * log n canonical tree nodes, executing in O(log n).',
      difficulty: 'Hard'
    },
    {
      id: 'dsa-h4',
      q: 'What is the time complexity of finding all Strongly Connected Components (SCCs) in a directed graph using Tarjan\'s or Kosaraju\'s algorithm?',
      options: ['O(V + E)', 'O(V * E)', 'O(V^2)', 'O(E log V)'],
      correctAnswer: 0,
      explanation: 'Both Tarjan\'s (single-pass DFS with low-link values and stack) and Kosaraju\'s (two-pass DFS with graph reversal) compute strongly connected components in optimal linear O(V + E) time.',
      difficulty: 'Hard'
    },
    {
      id: 'dsa-h5',
      q: 'Why does Disjoint Set Union (Union-Find) with both Path Compression and Union by Rank achieve near-constant alpha(n) amortized time per operation?',
      options: [
        'Because it converts graphs into hash tables.',
        'Path compression flattens trees during find, and union by rank keeps trees shallow, bounding amortized operations by the inverse Ackermann function alpha(n) <= 4.',
        'It executes parallel bitwise operations on GPU threads.',
        'It eliminates all cycles in directed graphs before merging.'
      ],
      correctAnswer: 1,
      explanation: 'Combining path compression (re-pointing visited nodes directly to root) and union by rank (attaching smaller tree under larger root) bounds tree depth so aggressively that m operations on n elements take O(m * alpha(n)) time, where alpha is the inverse Ackermann function (effectively <= 4 for all practical inputs).',
      difficulty: 'Hard'
    },
    {
      id: 'dsa-h6',
      q: 'In the A* Search algorithm, what condition must the heuristic function h(n) satisfy to guarantee finding the optimal shortest path?',
      options: [
        'h(n) must equal the exact cost of the remaining path.',
        'h(n) must be Admissible (never overestimate the true cost to reach the goal).',
        'h(n) must be strictly greater than the true remaining distance.',
        'h(n) must be an exponential function of node depth.'
      ],
      correctAnswer: 1,
      explanation: 'For tree search, h(n) must be admissible (h(n) <= true remaining cost). For graph search with visited sets, it must also be consistent (monotonic: h(n) <= c(n, n\') + h(n\')). An admissible heuristic guarantees A* will return the optimal shortest path.',
      difficulty: 'Hard'
    }
  ],

  'Object-Oriented Programming': [
    // 6 Easy
    {
      id: 'oop-e1',
      q: 'Which OOP pillar bundles data attributes and operating methods together while restricting direct access from outside?',
      options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Composition'],
      correctAnswer: 0,
      explanation: 'Encapsulation bundles data and methods operating on that data inside a class, while controlling visibility via access modifiers (private, protected, public).',
      difficulty: 'Easy'
    },
    {
      id: 'oop-e2',
      q: 'What is Polymorphism in object-oriented programming?',
      options: [
        'The ability of different objects to respond to the same method call in their own specific way.',
        'The ability of a class to inherit from multiple parent classes simultaneously.',
        'Compiling source code into different processor instruction sets.',
        'Storing multiple data types in a single database column.'
      ],
      correctAnswer: 0,
      explanation: 'Polymorphism ("many forms") allows objects of different concrete types to be treated through a uniform interface, with runtime dispatch executing the correct subtype method.',
      difficulty: 'Easy'
    },
    {
      id: 'oop-e3',
      q: 'What is the purpose of a constructor in an object-oriented language?',
      options: [
        'To destroy an object when it falls out of scope.',
        'To initialize the state of an object instance when created with "new".',
        'To convert public variables into private variables.',
        'To establish a persistent database socket.'
      ],
      correctAnswer: 1,
      explanation: 'Constructors are special member functions called automatically when an object is instantiated, ensuring required fields and invariants are set up.',
      difficulty: 'Easy'
    },
    {
      id: 'oop-e4',
      q: 'What is the key difference between Method Overloading and Method Overriding?',
      options: [
        'Overloading happens at runtime; Overriding happens at compile-time.',
        'Overloading has the same method name with different parameters in the same class; Overriding redefines a superclass method in a subclass with identical signature.',
        'Overloading requires inheritance; Overriding does not require inheritance.',
        'Overloading is only permitted in functional languages.'
      ],
      correctAnswer: 1,
      explanation: 'Method Overloading (compile-time/static polymorphism) has identical method names with differing signatures. Method Overriding (runtime/dynamic polymorphism) replaces a parent class method in a child class with the same signature.',
      difficulty: 'Easy'
    },
    {
      id: 'oop-e5',
      q: 'What is the purpose of the "super" keyword in languages like Java, C#, or JavaScript?',
      options: [
        'To declare a method that runs with root operating system privileges.',
        'To reference or invoke constructors and methods of the parent/base class.',
        'To mark a variable as globally accessible across all threads.',
        'To prevent garbage collection of an object.'
      ],
      correctAnswer: 1,
      explanation: 'The "super" keyword provides an explicit reference to the immediate parent class, enabling child classes to call base constructors (e.g. super()) or overridden base methods (e.g. super.method()).',
      difficulty: 'Easy'
    },
    {
      id: 'oop-e6',
      q: 'Which access modifier typically restricts member visibility exclusively to the declaring class itself?',
      options: ['public', 'protected', 'private', 'package-private'],
      correctAnswer: 2,
      explanation: '"private" specifies that a field or method is visible only within the body of the declaring class, preventing external classes and subclasses from accessing it directly.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'oop-m1',
      q: 'In modern strongly-typed languages, what is the core structural difference between an Abstract Class and an Interface?',
      options: [
        'Abstract classes cannot contain concrete methods, while interfaces must contain complete implementations.',
        'A class can implement multiple interfaces but typically only inherit from a single abstract class; abstract classes can also maintain stateful instance fields.',
        'Interfaces can be instantiated directly with "new", whereas abstract classes cannot.',
        'Interfaces are dynamically resolved at runtime, while abstract classes are compiled into static C routines.'
      ],
      correctAnswer: 1,
      explanation: 'Most OOP languages allow multiple interface implementations (contract composition) while enforcing single class inheritance. Abstract classes can hold stateful instance fields and constructors, whereas interfaces define abstract capability contracts.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m2',
      q: 'How does runtime polymorphism (dynamic method dispatch) work under the hood in compiled runtimes like C++ or Java JVM?',
      options: [
        'The compiler inlines every subclass into a single monolithic switch statement.',
        'Each object instance contains a pointer to a Virtual Method Table (vtable) holding function pointers resolved at execution time.',
        'The runtime re-parses source code on every method invocation.',
        'Methods are executed on background threads that communicate via IPC.'
      ],
      correctAnswer: 1,
      explanation: 'Dynamic dispatch utilizes a Virtual Method Table (vtable). Classes with virtual or overridden methods have a vtable holding pointers to their implementations. Objects have a vptr pointing to their class vtable, enabling O(1) runtime method lookup.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m3',
      q: 'What is the "Diamond Problem" in multiple inheritance, and how do languages like Java prevent it?',
      options: [
        'Memory leaks caused by circular references between 4 objects.',
        'Ambiguity when a class inherits from two parent classes that both provide conflicting implementations of the same base method; Java avoids it by supporting single class inheritance and interfaces.',
        'A deadlock condition between four concurrent worker threads.',
        'Failure to serialize multidimensional matrix arrays into JSON.'
      ],
      correctAnswer: 1,
      explanation: 'The Diamond Problem arises if Class D inherits from Classes B and C, both inheriting from Class A. If B and C override a method from A, D cannot determine which implementation to invoke. Java avoids this by forbidding multiple class inheritance.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m4',
      q: 'Which Creational Design Pattern ensures that a class has only one instance and provides a global point of access to it?',
      options: ['Singleton Pattern', 'Factory Method Pattern', 'Builder Pattern', 'Prototype Pattern'],
      correctAnswer: 0,
      explanation: 'The Singleton Pattern restricts instantiation of a class to one single object, using a private constructor and a static getInstance() method.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m5',
      q: 'What is the primary advantage of Composition over Inheritance in software architecture?',
      options: [
        'Composition runs in kernel mode; inheritance runs in user space.',
        'Composition decouples behavior, allows changing dependencies dynamically at runtime, and avoids rigid deep class hierarchies.',
        'Composition completely eliminates garbage collection overhead.',
        'Inheritance prevents subclasses from adding new methods.'
      ],
      correctAnswer: 1,
      explanation: '"Favor composition over inheritance" emphasizes assembling objects with focused components. Inheritance creates tight coupling to parent internals ("fragile base class"), while composition allows dynamic swapping of behavior via interfaces.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m6',
      q: 'In the Observer Design Pattern, how does the Subject interact with its registered Observers?',
      options: [
        'The Subject queries the database to inspect observer states.',
        'The Subject maintains a list of observer references and notifies them by calling a standard update() callback when its internal state changes.',
        'Observers poll the Subject continuously in while loops.',
        'The Subject terminates observers after every event.'
      ],
      correctAnswer: 1,
      explanation: 'The Observer pattern defines a one-to-many dependency. When the Subject\'s state changes, it iterates over its collection of registered observers and invokes their update() method, achieving decoupled event broadcasting.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m7',
      q: 'What is the purpose of the Dependency Inversion Principle (DIP) in SOLID?',
      options: [
        'High-level modules should not depend on low-level modules; both should depend on abstractions.',
        'All dependencies must be instantiated directly inside class constructors.',
        'Classes must invert their method names alphabetically.',
        'Dependencies should only be written in XML files.'
      ],
      correctAnswer: 0,
      explanation: 'DIP states that high-level policy code should not couple directly to low-level implementation details. Both should depend upon abstractions (interfaces), allowing implementations to be swapped without changing high-level business logic.',
      difficulty: 'Medium'
    },
    {
      id: 'oop-m8',
      q: 'What is the purpose of the Decorator Design Pattern?',
      options: [
        'To draw graphical user interface borders.',
        'To attach additional responsibilities to an object dynamically without modifying its class or using subclass explosion.',
        'To convert relational database rows into XML.',
        'To terminate idle network connections.'
      ],
      correctAnswer: 1,
      explanation: 'The Decorator pattern wraps an existing object within a decorator class that implements the same interface, augmenting behavior before/after delegating to the wrapped instance without altering existing classes.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'oop-h1',
      q: 'The Liskov Substitution Principle (LSP) in SOLID design states that:',
      options: [
        'High-level modules should never depend upon low-level modules.',
        'A class should have one, and only one, reason to change.',
        'Subtypes must be substitutable for their base types without altering program correctness or violating contracts.',
        'Classes should be open for modification and closed for extension.'
      ],
      correctAnswer: 2,
      explanation: 'LSP requires that child classes honor the contract and invariants of their parent. A classic violation is a Square inheriting from Rectangle, where mutating width unexpectedly alters height, breaking client assumptions.',
      difficulty: 'Hard'
    },
    {
      id: 'oop-h2',
      q: 'In double-checked locking for thread-safe lazy Singleton instantiation in Java/C++, why is the "volatile" keyword mandatory for the instance reference?',
      options: [
        'To prevent memory leaks when the JVM shuts down.',
        'To prevent instruction reordering by compiler and CPU, ensuring the constructor finishes initialization before the instance pointer becomes visible to other threads.',
        'To allow multiple instances to be created in parallel.',
        'To force the Singleton to be stored on the CPU registers.'
      ],
      correctAnswer: 1,
      explanation: 'Without "volatile", the JVM or CPU can reorder instructions such that memory allocation and pointer assignment occur before the constructor finishes execution. Another thread checking for null could see a non-null pointer to a half-initialized object.',
      difficulty: 'Hard'
    },
    {
      id: 'oop-h3',
      q: 'How does the Visitor Design Pattern achieve "Double Dispatch" in single-dispatch languages like Java or C++?',
      options: [
        'By dispatching method calls across two CPU cores simultaneously.',
        'By executing an element\'s accept(visitor) method, which in turn calls visitor.visit(this), binding execution to both the concrete Element and concrete Visitor at runtime.',
        'By parsing bytecode with an auxiliary compiler.',
        'By maintaining two independent virtual method tables for each object.'
      ],
      correctAnswer: 1,
      explanation: 'In single-dispatch languages, method dispatch depends only on the receiver\'s runtime type. The Visitor pattern achieves double dispatch via two polymorphic calls: first element.accept(v) resolves the concrete element, which then calls v.visit(this), passing its typed self to resolve the concrete visitor.',
      difficulty: 'Hard'
    },
    {
      id: 'oop-h4',
      q: 'What is the "Fragile Base Class" problem in object-oriented systems?',
      options: [
        'Base classes that throw runtime exceptions when instantiated with null arguments.',
        'Seemingly innocuous modifications to a base class unintentionally breaking derived classes because the base class internal implementation details leak into subclass assumptions.',
        'Base classes that take too long to compile.',
        'Abstract classes that contain more than 10 abstract methods.'
      ],
      correctAnswer: 1,
      explanation: 'The Fragile Base Class problem occurs when changes to parent class implementation (like making method A call method B internally) breaks subclasses that override method B or rely on previous internal calling behavior.',
      difficulty: 'Hard'
    },
    {
      id: 'oop-h5',
      q: 'In Domain-Driven Design (DDD) object modeling, what distinguishes an Entity from a Value Object?',
      options: [
        'Entities are stored in SQL; Value Objects are stored in NoSQL.',
        'An Entity has a distinct identity that persists through state changes; a Value Object is immutable and defined entirely by the equality of its attributes.',
        'Entities can only have primitive fields; Value Objects can contain complex methods.',
        'Value Objects must implement the Singleton design pattern.'
      ],
      correctAnswer: 1,
      explanation: 'An Entity is tracked by its unique identifier (e.g. User with ID 42 remains the same user even if name changes). A Value Object (e.g. Money(10, "USD")) is immutable and has no unique identity; two instances with identical attributes are completely interchangeable.',
      difficulty: 'Hard'
    },
    {
      id: 'oop-h6',
      q: 'Why does the Prototype pattern with shallow cloning fail when the cloned object holds references to mutable nested objects?',
      options: [
        'Shallow cloning only duplicates the memory pointers to nested objects, meaning mutating nested state in the clone mutates the original object.',
        'Shallow cloning causes immediate stack overflow exceptions in the runtime.',
        'Shallow cloning converts all objects into strings.',
        'Shallow cloning is restricted to operating system kernel objects.'
      ],
      correctAnswer: 0,
      explanation: 'A shallow copy duplicates primitive fields and field references, but not the referenced objects themselves. Modifying a mutable nested structure in a shallow clone alters the shared nested instance in the original object. Deep cloning is required for complete isolation.',
      difficulty: 'Hard'
    }
  ],

  'Database Management (DBMS)': [
    // 6 Easy
    {
      id: 'dbms-e1',
      q: 'Which ACID property guarantees that all operations within a database transaction succeed together or all are rolled back?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctAnswer: 0,
      explanation: 'Atomicity enforces the "all-or-nothing" rule: either all changes in a transaction commit to the database, or the transaction is aborted and rolled back to its pre-transaction state.',
      difficulty: 'Easy'
    },
    {
      id: 'dbms-e2',
      q: 'What is the function of a Primary Key in a relational database table?',
      options: [
        'To encrypt the table data on disk.',
        'To uniquely identify each record in the table while disallowing NULL values.',
        'To connect tables to external web services.',
        'To sort the table alphabetically by user name.'
      ],
      correctAnswer: 1,
      explanation: 'A Primary Key enforces entity integrity: each row must have a unique identifier, and primary key columns cannot contain NULL values.',
      difficulty: 'Easy'
    },
    {
      id: 'dbms-e3',
      q: 'Which SQL clause is used to filter aggregated grouped records after a GROUP BY statement?',
      options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
      correctAnswer: 1,
      explanation: 'WHERE filters rows before aggregation occurs; HAVING filters grouped summary rows after the GROUP BY clause has aggregated them.',
      difficulty: 'Easy'
    },
    {
      id: 'dbms-e4',
      q: 'What does the Durability property of ACID guarantee?',
      options: [
        'Transactions execute in less than 1 millisecond.',
        'Committed transaction modifications survive power outages, crashes, and server restarts.',
        'All database queries are cached in memory forever.',
        'The database schema cannot be altered by migrations.'
      ],
      correctAnswer: 1,
      explanation: 'Durability ensures that once a transaction commits, its writes are persisted permanently (typically via Write-Ahead Logs written to non-volatile storage) and will not be lost if the server crashes.',
      difficulty: 'Easy'
    },
    {
      id: 'dbms-e5',
      q: 'What is a Foreign Key constraint in relational databases?',
      options: [
        'A key stored on a server in another country.',
        'A field in one table that refers to the Primary Key of another table, enforcing referential integrity.',
        'An encryption key used to decode TLS connections.',
        'A column that stores third-party API credentials.'
      ],
      correctAnswer: 1,
      explanation: 'Foreign keys enforce referential integrity: the database prevents inserting child rows with invalid parent IDs and blocks deleting parent records that have linked child rows (unless CASCADE is configured).',
      difficulty: 'Easy'
    },
    {
      id: 'dbms-e6',
      q: 'What is the primary difference between SQL (relational) and NoSQL document databases?',
      options: [
        'SQL databases do not support indexes; NoSQL databases do.',
        'SQL databases use structured tabular schemas with ACID relationships; NoSQL document databases offer flexible JSON-like schemas and horizontal scalability.',
        'NoSQL databases cannot store text strings.',
        'SQL databases only run on desktop computers.'
      ],
      correctAnswer: 1,
      explanation: 'Relational databases store normalized rows in structured tables with strict relational integrity and ACID guarantees. Document NoSQL databases (e.g. MongoDB) store hierarchical documents, offering flexible schemas and simpler horizontal sharding.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'dbms-m1',
      q: 'A relational database table is in Third Normal Form (3NF) if and only if it is in 2NF and:',
      options: [
        'All columns contain only alphanumeric string values.',
        'There are no transitive functional dependencies of non-prime attributes on candidate keys.',
        'Every attribute in the table is a candidate primary key.',
        'It has no foreign key relationships with any other table.'
      ],
      correctAnswer: 1,
      explanation: '3NF requires that non-key columns depend only on candidate keys (no transitive dependencies X -> Y and Y -> Z where Z is non-prime). Attributes must depend "on the key, the whole key, and nothing but the key".',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m2',
      q: 'According to Brewer\'s CAP Theorem, when an unavoidable network partition (P) occurs, what trade-off must a distributed database make?',
      options: [
        'Choose between Encryption (E) and Throughput (T).',
        'Choose between Consistency (C) and Availability (A).',
        'Choose between Read Throughput (R) and Write Latency (W).',
        'Choose between ACID transactions and Multi-Tenancy.'
      ],
      correctAnswer: 1,
      explanation: 'During a network partition, distributed nodes cannot communicate reliably. The system must either reject writes to guarantee all readable data is consistent (CP), or accept writes on isolated nodes causing temporary inconsistency (AP).',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m3',
      q: 'What is a "Dirty Read" in database transaction isolation levels, and which level prevents it?',
      options: [
        'Reading corrupt disk sectors; prevented by RAID 5.',
        'A transaction reading uncommitted data written by another concurrent transaction that might later be rolled back; prevented by Read Committed.',
        'Reading old cached rows; prevented by Redis.',
        'Executing a query with syntax errors.'
      ],
      correctAnswer: 1,
      explanation: 'A Dirty Read occurs at Read Uncommitted when Transaction B reads rows modified by Transaction A before Transaction A commits. If A rolls back, B processed invalid data. Read Committed prevents dirty reads by only returning committed data.',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m4',
      q: 'What is the purpose of Write-Ahead Logging (WAL) in database engines?',
      options: [
        'To record user search queries for analytics dashboards.',
        'To write modifications sequentially to persistent disk before modifying in-memory database pages, ensuring recoverability after crashes.',
        'To backup the entire database to Amazon S3 every hour.',
        'To generate automated documentation for database tables.'
      ],
      correctAnswer: 1,
      explanation: 'WAL ensures Durability and Atomicity. Sequential disk appends to the log are fast. When a crash occurs, the recovery manager replays committed changes (REDO) and undoes uncommitted modifications (UNDO) using the WAL.',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m5',
      q: 'How does a Database Connection Pool improve web application performance?',
      options: [
        'By keeping a set of established database connections open and reusing them, eliminating TCP/TLS handshake and authentication overhead per request.',
        'By running database queries on the client\'s web browser.',
        'By converting relational queries into static HTML files.',
        'By deleting old database tables automatically.'
      ],
      correctAnswer: 0,
      explanation: 'Establishing a new database connection requires TCP handshakes, TLS negotiation, authentication, and backend process/thread allocation. Connection pools reuse pre-warmed connections, reducing request latency.',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m6',
      q: 'What is Database Sharding, and what challenge does it introduce for multi-shard operations?',
      options: [
        'Deleting duplicate rows; makes table backups slower.',
        'Horizontally partitioning rows across multiple database servers based on a shard key; complicates cross-shard joins, transactions, and rebalancing.',
        'Compressing database indexes into zip files.',
        'Splitting columns into separate tables on the same machine.'
      ],
      correctAnswer: 1,
      explanation: 'Sharding splits large tables horizontally across distinct database clusters by a shard key (e.g. user_id % N). While it enables horizontal scaling, cross-shard joins and distributed transactions require complex coordination (like 2PC).',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m7',
      q: 'What is the difference between an INNER JOIN and a LEFT OUTER JOIN?',
      options: [
        'INNER JOIN returns only rows with matching keys in both tables; LEFT JOIN returns all rows from the left table and matched rows (or NULLs) from the right table.',
        'INNER JOIN modifies data; LEFT JOIN is read-only.',
        'LEFT JOIN can only join two tables; INNER JOIN can join up to 10 tables.',
        'INNER JOIN runs on the database server; LEFT JOIN runs in JavaScript.'
      ],
      correctAnswer: 0,
      explanation: 'INNER JOIN yields rows where the join predicate evaluates to true in both tables. LEFT OUTER JOIN preserves every row from the left table, filling missing right-table columns with NULL if no match exists.',
      difficulty: 'Medium'
    },
    {
      id: 'dbms-m8',
      q: 'What is a "Phantom Read" in database transaction isolation?',
      options: [
        'A query reading rows that have been encrypted.',
        'A transaction re-executing a range query and discovering new rows inserted and committed by another transaction that satisfy the search predicate.',
        'A query that never terminates.',
        'A query reading rows from deleted tables.'
      ],
      correctAnswer: 1,
      explanation: 'A Phantom Read occurs when Transaction A queries a range (e.g. SELECT * WHERE age > 25), and Transaction B inserts a new row with age 30 and commits. When A repeats the range query, a "phantom" row appears. Prevented by Serializable isolation.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'dbms-h1',
      q: 'Why do relational engines like MySQL InnoDB and PostgreSQL default to B+ Tree indexes over Hash indexes for primary keys and general columns?',
      options: [
        'Hash indexes consume O(n^2) disk space whereas B+ Trees require zero disk space.',
        'B+ Trees efficiently support range queries (BETWEEN, <, >, ORDER BY) because all leaf nodes are sequentially linked in sorted order.',
        'Hash indexes cannot handle numeric data types.',
        'B+ Trees guarantee O(1) point lookups for all arbitrary string queries.'
      ],
      correctAnswer: 1,
      explanation: 'Hash indexes offer O(1) equality lookups (WHERE id = 5) but are incapable of evaluating range scans (WHERE age BETWEEN 20 AND 30) or ordered traversals. In a B+ Tree, leaf nodes form a sorted doubly linked list, enabling O(log N + K) range scans.',
      difficulty: 'Hard'
    },
    {
      id: 'dbms-h2',
      q: 'How does Multi-Version Concurrency Control (MVCC) eliminate read-write contention in engines like PostgreSQL and MySQL InnoDB?',
      options: [
        'By locking the entire database on every write.',
        'Readers do not block writers and writers do not block readers because updates create new row versions with transaction timestamps/IDs, giving readers a consistent snapshot.',
        'By routing all read queries to SQLite in memory.',
        'By converting all writes into asynchronous UDP packets.'
      ],
      correctAnswer: 1,
      explanation: 'In MVCC, modifying a row creates a new version with creation (xmin) and deletion (xmax) transaction IDs. Readers evaluate a snapshot of versions committed before their transaction began, reading without acquiring shared locks on rows.',
      difficulty: 'Hard'
    },
    {
      id: 'dbms-h3',
      q: 'What problem does the Two-Phase Commit (2PC) protocol solve in distributed databases, and what is its primary failure mode?',
      options: [
        'It accelerates indexing; fails if RAM is exhausted.',
        'It coordinates atomic transaction commits across multiple distributed nodes; if the coordinator crashes during the Commit phase, participant cohorts can remain blocked holding locks indefinitely.',
        'It encrypts passwords across two clusters; fails on network latency.',
        'It partitions large tables; fails when tables exceed 1 million rows.'
      ],
      correctAnswer: 1,
      explanation: '2PC ensures distributed atomicity across shards using Prepare and Commit phases. Its main vulnerability is that it is a blocking protocol: if the coordinator crashes after nodes vote "Yes" but before sending "Commit", cohorts remain blocked holding resource locks.',
      difficulty: 'Hard'
    },
    {
      id: 'dbms-h4',
      q: 'In PostgreSQL, what is the purpose of the VACUUM process and why is it necessary under MVCC?',
      options: [
        'To defragment CPU cache lines.',
        'To reclaim disk space occupied by dead row versions (tuples deleted or obsoleted by updates) and update visibility maps and statistics.',
        'To purge foreign key constraints that are older than 30 days.',
        'To convert B-Tree indexes into Hash indexes.'
      ],
      correctAnswer: 1,
      explanation: 'Because MVCC updates append new row versions rather than overwriting in place, deleted or updated rows leave "dead tuples". VACUUM scans tables to reclaim dead tuple space for future inserts and updates table statistics used by the query planner.',
      difficulty: 'Hard'
    },
    {
      id: 'dbms-h5',
      q: 'What is the Leftmost Prefix Rule in composite B-Tree indexes (e.g. index on columns (A, B, C))?',
      options: [
        'Queries can only use the index if they filter by column C first.',
        'The query planner can utilize the composite index only if the query conditions include column A (the leftmost prefix), followed consecutively by B, then C.',
        'The index only stores strings that begin with vowels.',
        'Leftmost columns cannot contain integer data types.'
      ],
      correctAnswer: 1,
      explanation: 'A composite index on (A, B, C) sorts entries primarily by A, then by B within equal values of A, and then by C. Queries filtering on (A), (A, B), or (A, B, C) use the index. A query filtering only on (B, C) cannot use the tree index effectively.',
      difficulty: 'Hard'
    },
    {
      id: 'dbms-h6',
      q: 'In distributed database systems like CockroachDB or Google Spanner, what consensus mechanism guarantees linearizable distributed transactions without central locking bottlenecks?',
      options: [
        'Round-robin DNS routing.',
        'Raft or Paxos consensus groups per range partition, combined with synchronized physical/logical clocks (TrueTime or Hybrid Logical Clocks).',
        'Single-threaded Redis lock managers.',
        'Sending broadcast UDP pings to all worker machines.'
      ],
      correctAnswer: 1,
      explanation: 'Modern distributed SQL systems partition data into ranges, each managed by a Raft or Paxos consensus group for replication. They use synchronized time (Google TrueTime atomic/GPS clocks or Hybrid Logical Clocks) to assign globally ordered commit timestamps without central bottlenecks.',
      difficulty: 'Hard'
    }
  ],

  'Operating Systems (OS)': [
    // 6 Easy
    {
      id: 'os-e1',
      q: 'What is the primary memory and context switching difference between an OS Process and a Thread?',
      options: [
        'Processes share virtual memory; Threads have isolated memory address spaces.',
        'Processes have independent address spaces requiring page table / TLB flushes on context switch; Threads within a process share the same address space.',
        'Threads can only run on single-core CPUs; Processes require multi-core CPUs.',
        'Processes are managed strictly in user space; Threads are kernel-only.'
      ],
      correctAnswer: 1,
      explanation: 'Processes have isolated virtual memory spaces. Switching processes requires changing page table pointers and invalidating TLB caches. Threads in the same process share heap, code, and global data, making thread context switches much faster.',
      difficulty: 'Easy'
    },
    {
      id: 'os-e2',
      q: 'What is the function of the OS Kernel?',
      options: [
        'It is the core program that manages system hardware resources (CPU, memory, devices) and mediates system calls from user space.',
        'It is the web browser user interface.',
        'It compiles Python code into native machine instructions.',
        'It acts as the primary firewall router.'
      ],
      correctAnswer: 0,
      explanation: 'The kernel is the foundational layer of an operating system. It executes with supervisor privileges (Ring 0), managing process scheduling, virtual memory, interrupt handling, and device drivers.',
      difficulty: 'Easy'
    },
    {
      id: 'os-e3',
      q: 'What is a System Call (syscall) in an operating system?',
      options: [
        'A telephone call made by customer support.',
        'The programmatic interface by which user space applications request privileged services from the operating system kernel.',
        'A function call between two JavaScript classes.',
        'A hardware failure on the motherboard.'
      ],
      correctAnswer: 1,
      explanation: 'User applications run in unprivileged user mode (Ring 3). When they need privileged operations (e.g. read file, open socket, fork process), they execute a system call trap into kernel mode (Ring 0).',
      difficulty: 'Easy'
    },
    {
      id: 'os-e4',
      q: 'What is Virtual Memory in modern operating systems?',
      options: [
        'Memory stored in cloud datacenters.',
        'An abstraction giving each process the illusion of a dedicated contiguous address space, mapped to physical RAM frames and disk swap via page tables.',
        'RAM that can only run video games.',
        'Simulated memory used only in test suites.'
      ],
      correctAnswer: 1,
      explanation: 'Virtual memory isolates processes, prevents them from accessing each other\'s memory, and enables using secondary disk storage as swap when physical RAM is exhausted.',
      difficulty: 'Easy'
    },
    {
      id: 'os-e5',
      q: 'Which CPU scheduling algorithm gives each process a fixed time slice (quantum) in cyclic order?',
      options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
      correctAnswer: 1,
      explanation: 'Round Robin assigns each runnable process a fixed time quantum. When the quantum expires, the timer interrupt preempts the process and moves it to the back of the ready queue.',
      difficulty: 'Easy'
    },
    {
      id: 'os-e6',
      q: 'What is a Race Condition in concurrent programming?',
      options: [
        'A benchmark test comparing two different algorithms.',
        'A situation where multiple threads access shared data concurrently and the final result depends on the non-deterministic timing/order of execution.',
        'A network connection running at gigabit speeds.',
        'When CPU fan speed exceeds 5000 RPM.'
      ],
      correctAnswer: 1,
      explanation: 'A race condition occurs when concurrent threads execute unsynchronized reads and writes on shared state. Without synchronization (locks/semaphores), results become non-deterministic and corrupted.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'os-m1',
      q: 'Which of the following is NOT one of the four mandatory Coffman conditions required for a Deadlock to occur?',
      options: [
        'Mutual Exclusion: Resources cannot be shared simultaneously.',
        'Hold and Wait: Processes holding allocated resources can request additional ones.',
        'Preemption: The OS forcibly revokes resources from waiting processes at any time.',
        'Circular Wait: A closed chain of processes exists where each waits for a resource held by the next.'
      ],
      correctAnswer: 2,
      explanation: 'The Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption (resources CANNOT be taken away), and Circular Wait. If preemption were allowed, the OS could break deadlocks by forcibly seizing resources.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m2',
      q: 'What is a Mutex vs a Counting Semaphore?',
      options: [
        'A Mutex is for files; a Semaphore is for network sockets.',
        'A Mutex provides mutual exclusion with ownership (only the locking thread can unlock); a Semaphore maintains a count of available resources and can be signaled by any thread.',
        'A Mutex is non-blocking; a Semaphore always blocks.',
        'A Semaphore is only used in hardware.'
      ],
      correctAnswer: 1,
      explanation: 'A Mutex is a locking mechanism with ownership: the thread that locks it must unlock it. A Counting Semaphore manages a resource pool (e.g. N available slots); any thread can signal/post to increment the count.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m3',
      q: 'What is Thrashing in virtual memory operating systems?',
      options: [
        'Overheating of the CPU voltage regulator.',
        'A state where the system spends significantly more time swapping pages between RAM and disk than executing user instructions.',
        'Deleting all files in the temporary directory.',
        'A hardware network collision on Ethernet cables.'
      ],
      correctAnswer: 1,
      explanation: 'Thrashing occurs when active working sets exceed physical RAM. Every process generates continuous page faults, causing the OS to spend all CPU time swapping pages in and out of disk rather than making forward progress.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m4',
      q: 'What is the difference between a Preemptive and Non-Preemptive CPU Scheduler?',
      options: [
        'Preemptive schedulers can interrupt a running process when higher-priority tasks arrive or quantums expire; non-preemptive schedulers let a process run until it yields or terminates.',
        'Preemptive schedulers run only in user mode.',
        'Non-preemptive schedulers are used in real-time systems only.',
        'Preemptive schedulers do not support threads.'
      ],
      correctAnswer: 0,
      explanation: 'Preemptive schedulers use hardware timer interrupts to seize the CPU from a running process when higher priority processes become ready or time slices end. Non-preemptive schedulers wait until the process voluntarily yields or halts.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m5',
      q: 'What is an Orphan Process vs a Zombie Process in Unix/Linux?',
      options: [
        'An Orphan process has terminated but its exit code is unread; a Zombie is still running.',
        'An Orphan has its parent terminate before it (reparented to init/systemd); a Zombie has terminated execution but remains in the process table until its parent reads its exit status with wait().',
        'Both terms refer to kernel worker threads.',
        'Zombies run with root privileges; Orphans run with guest privileges.'
      ],
      correctAnswer: 1,
      explanation: 'When a parent terminates without waiting for children, they become Orphans and get reparented to PID 1 (init/systemd). A Zombie has finished executing, but its process control block (PCB) stays in the table until the parent calls wait() to read its exit status.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m6',
      q: 'What is a Translation Lookaside Buffer (TLB) and why is it crucial for virtual memory performance?',
      options: [
        'A network buffer for translating IP addresses.',
        'A high-speed hardware associative cache on the CPU that stores recent virtual-to-physical address translations, avoiding multi-level page table traversals in RAM.',
        'A disk cache for database log files.',
        'A compiler optimization for loops.'
      ],
      correctAnswer: 1,
      explanation: 'Translating a virtual address via a 4-level page table requires 4 separate RAM accesses. The TLB caches recent translations directly on the CPU chip. A TLB hit resolves virtual addresses to physical frames in less than a clock cycle.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m7',
      q: 'What is the purpose of the fork() system call in Unix-like operating systems?',
      options: [
        'To split a hard drive into two partitions.',
        'To create a new child process that is an exact duplicate of the calling parent process, copying execution state and memory mappings.',
        'To switch CPU affinity to another core.',
        'To terminate an active thread pool.'
      ],
      correctAnswer: 1,
      explanation: 'fork() clones the calling process. The child process receives a copy of the parent\'s address space, file descriptors, and registers. fork() returns 0 to the child and the child\'s PID to the parent.',
      difficulty: 'Medium'
    },
    {
      id: 'os-m8',
      q: 'Why is Copy-on-Write (CoW) used during the fork() system call?',
      options: [
        'To encrypt memory pages before copying them.',
        'To defer physically copying memory pages until either the parent or child writes to them, saving memory and CPU time.',
        'To write memory directly to SSD storage.',
        'To prevent child processes from calling exec().'
      ],
      correctAnswer: 1,
      explanation: 'Duplicating gigabytes of RAM during fork() is expensive, especially since most forks immediately call exec(). Copy-on-Write marks parent pages read-only and shares them. Only when a process mutates a page is a physical duplicate created.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'os-h1',
      q: 'What occurs during a Page Fault interrupt when a requested virtual memory page is not in physical RAM?',
      options: [
        'A hardware bus short-circuit triggers an immediate kernel panic.',
        'The MMU traps to the OS kernel, which suspends the thread, allocates a physical RAM frame, issues a disk read to load the page from swap, updates the page table, and restarts the instruction.',
        'A compiler error terminates the application.',
        'A network timeout closes the TCP socket.'
      ],
      correctAnswer: 1,
      explanation: 'When the MMU encounters a page table entry with present bit = 0, it raises a page fault exception. The OS interrupt handler locates the page in backing store, swaps it into an available RAM frame, updates page tables, and re-executes the faulting instruction.',
      difficulty: 'Hard'
    },
    {
      id: 'os-h2',
      q: 'How does the Linux Completely Fair Scheduler (CFS) achieve fairness among competing processes?',
      options: [
        'By using a simple FIFO queue sorted by process creation time.',
        'By tracking the "virtual runtime" (vruntime) of each runnable task using a Red-Black Tree and always scheduling the task that has received the least CPU time (leftmost node).',
        'By executing tasks in random order using cryptographic seeds.',
        'By allocating exactly 1 millisecond to every process regardless of priority.'
      ],
      correctAnswer: 1,
      explanation: 'CFS models an "ideal multi-tasking CPU". Each task has a vruntime that advances as it executes, scaled by its nice level (priority). Runnable tasks are stored in a Red-Black tree keyed by vruntime. CFS always picks the leftmost task with the smallest vruntime.',
      difficulty: 'Hard'
    },
    {
      id: 'os-h3',
      q: 'In inter-process communication (IPC), how does Shared Memory compare to Message Passing (e.g. Unix Pipes / Sockets)?',
      options: [
        'Shared memory requires continuous kernel traps for every byte transmitted; message passing does not.',
        'Shared memory is the fastest IPC mechanism because processes read/write directly to mapped physical RAM frames without kernel copying, but requires user-level synchronization.',
        'Message passing is faster because it uses CPU register caching.',
        'Shared memory cannot be used between processes created with fork().'
      ],
      correctAnswer: 1,
      explanation: 'Message passing involves copying data from user space to kernel buffers and then to the receiver process (two memory copies + syscall overhead). Shared memory maps the same physical frames into both address spaces, enabling direct memory transfers with zero kernel copying.',
      difficulty: 'Hard'
    },
    {
      id: 'os-h4',
      q: 'What is Belady\'s Anomaly in operating system page replacement algorithms?',
      options: [
        'A bug where memory corruption occurs when RAM size is a prime number.',
        'The phenomenon where increasing the number of physical page frames allocated to a process increases the number of page faults under FIFO page replacement.',
        'A condition where LRU replacement causes infinite recursion.',
        'When virtual memory size exceeds 64-bit limits.'
      ],
      correctAnswer: 1,
      explanation: 'Under FIFO page replacement, adding more physical memory frames can counter-intuitively increase the total number of page faults for certain reference strings. Stack algorithms like LRU and Optimal replacement are immune to Belady\'s anomaly.',
      difficulty: 'Hard'
    },
    {
      id: 'os-h5',
      q: 'What is the difference between Edge-Triggered (ET) and Level-Triggered (LT) I/O notification in Linux epoll?',
      options: [
        'LT notifications work over Wi-Fi; ET notifications work over Ethernet.',
        'LT notifies the application as long as a file descriptor is ready/has unread data; ET notifies only when the state changes from unready to ready, requiring the app to drain the buffer in a non-blocking loop.',
        'ET is synchronous; LT is asynchronous.',
        'LT requires kernel recompilation for each process.'
      ],
      correctAnswer: 1,
      explanation: 'Level-Triggered repeatedly reports an event as long as data remains in the buffer (easier to use, but causes redundant wakeups). Edge-Triggered delivers an event only when new data arrives, requiring non-blocking sockets read to EAGAIN/EWOULDBLOCK.',
      difficulty: 'Hard'
    },
    {
      id: 'os-h6',
      q: 'How does the OS prevent priority inversion when a low-priority thread holding a shared lock is preempted by a medium-priority thread, starving a high-priority thread waiting on the lock?',
      options: [
        'By terminating the low-priority thread immediately.',
        'By using Priority Inheritance: temporarily elevating the low-priority thread\'s priority to that of the highest-priority waiting thread until it releases the lock.',
        'By disabling CPU interrupts globally forever.',
        'By allocating all CPU cores to the medium-priority thread.'
      ],
      correctAnswer: 1,
      explanation: 'Priority Inversion occurs when a high-priority thread blocks on a lock held by a low-priority thread, and an unrelated medium-priority thread preempts the low-priority thread. Priority Inheritance boosts the low-priority lock holder\'s priority to match the high-priority waiter, letting it finish and release the lock quickly.',
      difficulty: 'Hard'
    }
  ],

  'Computer Networks (CN)': [
    // 6 Easy
    {
      id: 'cn-e1',
      q: 'What is the exact sequence of packets exchanged to establish a TCP connection in the 3-Way Handshake?',
      options: [
        'ACK -> SYN -> SYN-ACK',
        'SYN -> SYN-ACK -> ACK',
        'FIN -> ACK -> FIN-ACK',
        'CONNECT -> VERIFY -> ESTABLISHED'
      ],
      correctAnswer: 1,
      explanation: 'The TCP 3-way handshake begins with client sending SYN (initiating sequence number), server replying with SYN-ACK (acknowledging client and sending server sequence number), and client responding with ACK.',
      difficulty: 'Easy'
    },
    {
      id: 'cn-e2',
      q: 'Which protocol operates at the Transport layer of the OSI model to provide connection-oriented, reliable byte stream delivery?',
      options: ['UDP', 'IP', 'TCP', 'HTTP'],
      correctAnswer: 2,
      explanation: 'TCP (Transmission Control Protocol) is a connection-oriented Transport Layer protocol that guarantees reliable, ordered, and error-checked delivery of a stream of octets between applications.',
      difficulty: 'Easy'
    },
    {
      id: 'cn-e3',
      q: 'What is the primary role of the Domain Name System (DNS)?',
      options: [
        'To encrypt user passwords on website logins.',
        'To translate human-readable domain names (e.g. google.com) into numerical IP addresses (e.g. 142.250.190.46).',
        'To route physical fiber optic cables under the ocean.',
        'To download website HTML pages.'
      ],
      correctAnswer: 1,
      explanation: 'DNS serves as the phonebook of the Internet, translating human-friendly domain names into the numerical IP addresses used by networking equipment to route packets.',
      difficulty: 'Easy'
    },
    {
      id: 'cn-e4',
      q: 'What is the default port number used for HTTPS (HTTP over TLS/SSL) traffic?',
      options: ['80', '8080', '443', '22'],
      correctAnswer: 2,
      explanation: 'Standard unencrypted HTTP traffic uses port 80. Encrypted HTTPS traffic defaults to port 443. Port 22 is standard for SSH.',
      difficulty: 'Easy'
    },
    {
      id: 'cn-e5',
      q: 'Which protocol is connectionless, does not perform handshakes, and does not guarantee packet delivery or ordering?',
      options: ['TCP', 'UDP', 'BGP', 'FTP'],
      correctAnswer: 1,
      explanation: 'UDP (User Datagram Protocol) is a lightweight, connectionless transport protocol without acknowledgments, retransmissions, or flow control, preferred for low-latency uses like video streaming and gaming.',
      difficulty: 'Easy'
    },
    {
      id: 'cn-e6',
      q: 'What is an IP Subnet Mask (e.g. 255.255.255.0 /24) used for?',
      options: [
        'To hide a computer\'s MAC address on the local network.',
        'To divide an IP address into its Network ID prefix and Host ID components.',
        'To increase download speeds over Wi-Fi.',
        'To encrypt Ethernet frames.'
      ],
      correctAnswer: 1,
      explanation: 'A subnet mask defines which bits of an IPv4 address belong to the network prefix and which bits identify individual host interfaces within that local subnetwork.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'cn-m1',
      q: 'How does HTTP/2 resolve the Head-of-Line (HoL) blocking problem present at the application layer in HTTP/1.1?',
      options: [
        'By running over UDP instead of TCP.',
        'By using binary framing to multiplex multiple concurrent bidirectional request/response streams over a single persistent TCP connection.',
        'By disabling HTTP cookies and headers entirely.',
        'By requiring each browser tab to open 100 parallel TCP sockets.'
      ],
      correctAnswer: 1,
      explanation: 'HTTP/1.1 suffered from application-layer Head-of-Line blocking because requests on a single connection had to be answered sequentially. HTTP/2 introduced binary framing, interleaving independent streams concurrently over a single TCP connection.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m2',
      q: 'In the TCP Congestion Control algorithm, what happens when a packet loss is detected via Triple Duplicate ACKs vs a Retransmission Timeout (RTO)?',
      options: [
        'Both events reset the congestion window (cwnd) to 1 Maximum Segment Size (MSS).',
        'Triple Duplicate ACKs trigger Fast Retransmit / Fast Recovery (halving cwnd to ssthresh); a Timeout represents severe congestion and resets cwnd to 1 MSS (entering Slow Start).',
        'Triple Duplicate ACKs terminate the connection.',
        'Timeouts increase cwnd exponentially.'
      ],
      correctAnswer: 1,
      explanation: 'Triple duplicate ACKs indicate that subsequent packets are still reaching the receiver (mild congestion). TCP enters Fast Recovery, halving cwnd. An RTO indicates no packets are flowing; TCP drops cwnd back to 1 MSS and restarts Slow Start.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m3',
      q: 'What is the difference between Symmetric and Asymmetric Encryption in TLS/HTTPS?',
      options: [
        'Symmetric encryption is used for voice; Asymmetric is used for text.',
        'Asymmetric encryption (public/private key pair) is used during the TLS handshake to authenticate the server and safely exchange a session key; Symmetric encryption (shared key) is used for bulk data transfer due to its speed.',
        'Symmetric encryption uses 4096-bit keys; Asymmetric uses 8-bit keys.',
        'Asymmetric encryption requires no keys.'
      ],
      correctAnswer: 1,
      explanation: 'Asymmetric cryptography (RSA/ECDHE) is computationally heavy and used during the initial TLS handshake to verify certificates and negotiate secrets. Once established, both parties use fast symmetric ciphers (e.g. AES-GCM or ChaCha20) for session data.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m4',
      q: 'What is the Address Resolution Protocol (ARP) responsible for in local area networks?',
      options: [
        'Translating domain names into IPv6 addresses.',
        'Resolving a known IPv4 address to its physical Layer-2 MAC address on the local Ethernet link.',
        'Allocating dynamic IP addresses to new laptops.',
        'Routing packets across autonomous internet systems.'
      ],
      correctAnswer: 1,
      explanation: 'To transmit an Ethernet frame on a local broadcast domain, a host needs the destination\'s Layer-2 MAC address. ARP broadcasts an "ARP Request" asking who owns the target IP; the target replies with its hardware MAC address.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m5',
      q: 'What is Network Address Translation (NAT) and why is it ubiquitous in home and corporate IPv4 routers?',
      options: [
        'It converts IPv4 packets into analog radio waves.',
        'It modifies network address information in IP headers, mapping multiple private IP addresses in a local LAN to a single public IP address, mitigating IPv4 exhaustion.',
        'It speeds up download throughput by compressing HTML.',
        'It prevents computers from connecting to public Wi-Fi.'
      ],
      correctAnswer: 1,
      explanation: 'NAT (specifically NAPT/PAT) maps private RFC 1918 addresses (e.g. 192.168.x.x) to a single public IP by tracking source port numbers in a translation table. This allowed millions of private devices to share limited public IPv4 space.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m6',
      q: 'How does Anycast DNS routing direct a client\'s DNS query to the geographically nearest nameserver?',
      options: [
        'By using client GPS coordinates sent in the HTTP header.',
        'Multiple geographically distributed servers announce the exact same IP address via BGP; internet routers naturally forward packets to the topologically closest server based on shortest AS path.',
        'By maintaining a centralized master database in Silicon Valley.',
        'By broadcasting queries to every computer on the internet.'
      ],
      correctAnswer: 1,
      explanation: 'In Anycast, multiple edge servers advertise the same IP address to upstream ISP routers using BGP. Border routers forward traffic along the shortest network path, routing requests to the nearest edge point of presence (PoP).',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m7',
      q: 'What does the TTL (Time-to-Live) field in an IPv4 header do, and what happens when it hits 0?',
      options: [
        'It specifies the number of milliseconds before data is encrypted; at 0, it encrypts.',
        'It is decremented by 1 by each router that forwards the packet; when it reaches 0, the packet is discarded and an ICMP "Time Exceeded" message is returned, preventing infinite routing loops.',
        'It counts how many times the packet was viewed by users.',
        'It stores the packet\'s timestamp for caching.'
      ],
      correctAnswer: 1,
      explanation: 'TTL prevents packets from circulating forever in routing loops. Each router decrements the TTL field by 1. If TTL reaches 0, the router drops the packet and sends an ICMP Type 11 (Time Exceeded) back to the source (used by traceroute).',
      difficulty: 'Medium'
    },
    {
      id: 'cn-m8',
      q: 'What is the purpose of the Maximum Transmission Unit (MTU), and what occurs when a packet exceeds the link MTU and the Don\'t Fragment (DF) flag is set?',
      options: [
        'The router compresses the packet and forwards it.',
        'The router drops the packet and responds with an ICMP "Fragmentation Needed and DF set" error message, used in Path MTU Discovery.',
        'The packet is converted to UDP.',
        'The router increases the cable bandwidth automatically.'
      ],
      correctAnswer: 1,
      explanation: 'MTU is the largest frame size (typically 1500 bytes for standard Ethernet). If a packet exceeds the MTU of an intermediate link and has DF=1, the router drops it and issues an ICMP notification, enabling Path MTU Discovery (PMTUD).',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'cn-h1',
      q: 'What architectural innovation does HTTP/3 introduce by replacing TCP with the QUIC protocol over UDP?',
      options: [
        'It eliminates transport-layer Head-of-Line blocking (a dropped packet only stalls its individual stream rather than the entire connection) and enables 0-RTT connection handshakes.',
        'It replaces TLS encryption with unencrypted text for lower latency.',
        'It eliminates DNS lookups by hardcoding IP addresses into browsers.',
        'It limits requests to a maximum payload of 64 bytes.'
      ],
      correctAnswer: 0,
      explanation: 'In HTTP/2 over TCP, if a single packet is lost, the entire TCP connection stalls waiting for retransmission (transport HoL blocking). QUIC runs over UDP and handles retransmissions per stream. It also merges transport and cryptographic handshakes for 0-RTT/1-RTT setups.',
      difficulty: 'Hard'
    },
    {
      id: 'cn-h2',
      q: 'How does the Border Gateway Protocol (BGP) manage routing between different Autonomous Systems (AS) across the global Internet?',
      options: [
        'By using Dijkstra\'s shortest path algorithm across all routers on Earth.',
        'It is a Path Vector protocol that exchanges network reachability advertisements containing AS-PATH attributes, enabling policy-based routing and loop detection.',
        'By broadcasting heartbeat ping packets to every residential modem.',
        'By calculating round-trip ping latency between web servers.'
      ],
      correctAnswer: 1,
      explanation: 'BGP is the routing backbone of the internet. It operates as a Path Vector protocol between Autonomous Systems (AS). BGP route advertisements include the AS-PATH (list of autonomous systems traversed), preventing loops and allowing organizations to enforce business peering policies.',
      difficulty: 'Hard'
    },
    {
      id: 'cn-h3',
      q: 'Why does TCP introduce the TIME_WAIT state upon closing a connection, and why does it typically last for 2 * MSL (Maximum Segment Lifetime)?',
      options: [
        'To allow the computer fan to cool the processor down.',
        'To ensure the final ACK sent by the active closer reaches the peer (retransmitting if the peer resends FIN), and to allow delayed or duplicated segments from the connection to expire in the network before port reuse.',
        'To wait for the user to confirm closing the browser tab.',
        'To download background operating system security patches.'
      ],
      correctAnswer: 1,
      explanation: 'The active closer enters TIME_WAIT after sending its final ACK. If this ACK is lost, the peer retransmits FIN; the closer must still have the socket state to resend ACK. 2*MSL (e.g. 60-120 seconds) also ensures lingering delayed packets drain from the network so they don\'t corrupt a future incarnation of the connection on the same 4-tuple.',
      difficulty: 'Hard'
    },
    {
      id: 'cn-h4',
      q: 'What vulnerability did the TCP SYN Flood attack exploit, and how do modern OS kernels mitigate it using SYN Cookies?',
      options: [
        'It saturated hard drive disk space; solved by formatting swap memory.',
        'Attackers sent spoofed SYN packets without finishing the handshake, exhausting the server\'s half-open connection backlog table; SYN Cookies encode connection state into the initial SYN-ACK sequence number, avoiding allocating memory until the final ACK arrives.',
        'It guessed user passwords; solved by two-factor authentication.',
        'It forged SSL certificates; solved by certificate pinning.'
      ],
      correctAnswer: 1,
      explanation: 'A SYN flood fills the SYN backlog queue with half-open connections. SYN Cookies prevent state allocation: the server derives its sequence number cryptographically from client IP, port, and a secret salt. Only when the client responds with valid ACK (echoing seq+1) is a connection control block allocated.',
      difficulty: 'Hard'
    },
    {
      id: 'cn-h5',
      q: 'In TLS 1.3, what significant architectural change was made to the handshake protocol compared to TLS 1.2?',
      options: [
        'TLS 1.3 removed encryption to speed up video streaming.',
        'It reduced the full handshake latency from 2 Round Trips (2-RTT) down to 1 Round Trip (1-RTT) by combining key exchange negotiation, and deprecated insecure legacy cipher suites (like RSA key exchange and CBC mode).',
        'TLS 1.3 replaced certificates with QR codes.',
        'It banned the use of ECDHE (Elliptic Curve Diffie-Hellman).'
      ],
      correctAnswer: 1,
      explanation: 'TLS 1.3 reduced handshake latency to 1-RTT (and 0-RTT for resumed sessions) by having clients send Diffie-Hellman key shares in the initial ClientHello. It also eliminated vulnerable legacy ciphers (RSA key exchange without forward secrecy, RC4, 3DES, CBC).',
      difficulty: 'Hard'
    },
    {
      id: 'cn-h6',
      q: 'How does Bufferbloat degrade interactive network performance, and how do Active Queue Management (AQM) algorithms like CoDel solve it?',
      options: [
        'Routers have too little memory causing immediate packet drops; AQM adds 64GB of RAM to routers.',
        'Excessively large unmanaged router buffers allow queues to fill with bulk transfer packets without dropping them, causing massive queuing latency for interactive traffic; AQM drops or marks packets based on minimum queue sojourn time.',
        'It is a vulnerability in network interface drivers that allows buffer overflow attacks.',
        'It converts Wi-Fi signals into microwave interference.'
      ],
      correctAnswer: 1,
      explanation: 'Bufferbloat occurs when oversized router buffers absorb bursts without packet loss, preventing TCP congestion control from slowing down and causing seconds of latency for interactive traffic. AQM algorithms (like CoDel and FQ-CoDel) monitor packet delay inside the buffer and proactively drop or ECN-mark packets when sojourn time stays high.',
      difficulty: 'Hard'
    }
  ]
};
