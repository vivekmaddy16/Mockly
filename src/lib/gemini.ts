import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, QuestionEvaluation, ExperienceLevel } from '@/types';

export const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error('Failed to initialize Gemini AI client:', e);
    return null;
  }
};

export const generateInterviewQuestions = async (
  targetRole: string,
  experienceLevel: ExperienceLevel,
  resumeText: string = '',
  jobDescriptionText: string = '',
  questionCount: number = 3,
  difficultyMode: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  roundType: 'technical_screen' | 'dsa' | 'system_design' | 'behavioral' = 'technical_screen'
): Promise<{ questions: Question[]; extractedSkills: string[] }> => {
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let roundPrompt = '';
      if (roundType === 'dsa') {
        roundPrompt = `
Round focus: "Algorithms & Coding (DSA)".
Generate pure data structures and algorithms questions (e.g. Arrays, Recursion, Trees, Graphs, Dynamic Programming). 
For each question, you MUST provide an initial code snippet template or scaffolding in the 'contextOrCode' field. The questions should ask the candidate to explain their programmatic approach and state the Big-O time and space complexity.
`;
      } else if (roundType === 'system_design') {
        roundPrompt = `
Round focus: "System Design & Architecture".
Generate questions on designing large-scale distributed systems, system trade-offs, microservices, databases, load balancing, caching strategies, and scale bottlenecks. Do not include coding snippets.
`;
      } else if (roundType === 'behavioral') {
        roundPrompt = `
Round focus: "Behavioral & HR".
Generate situational, leadership, teamwork, or conflict-resolution questions. These should test the candidate's communication, empathy, and past problem-solving using the STAR (Situation, Task, Action, Result) method.
`;
      } else {
        // technical_screen
        roundPrompt = `
Round focus: "Technical Screening".
Generate general conceptual questions covering the candidate's resume, technical breadth matching the target role, basic programming standards, and job requirements.
`;
      }

      const prompt = `
You are an expert technical interviewer for top technology companies.
Generate ${questionCount} customized, high-quality interview questions for a candidate interviewing for the role of "${targetRole}" at experience level "${experienceLevel}" with an overall interview difficulty of "${difficultyMode}".

Interview Round Context:
${roundPrompt}

${resumeText ? `Candidate Resume Content:\n${resumeText.slice(0, 1500)}\n` : ''}
${jobDescriptionText ? `Job Description Requirements:\n${jobDescriptionText.slice(0, 1500)}\n` : ''}

Instructions:
1. Ensure all questions match the target role, experience level, and the specific round focus described above.
2. Return ONLY a valid raw JSON object matching the JSON schema below. Do not include markdown code block formatting like \`\`\`json.

JSON Schema:
{
  "extractedSkills": ["Skill1", "Skill2", "Skill3"],
  "questions": [
    {
      "id": "q_1",
      "type": "${roundType === 'behavioral' ? 'behavioral' : 'technical'}",
      "category": "DSA / Frontend / Backend / System Design / HR",
      "questionText": "Detailed question prompt...",
      "contextOrCode": "Initial code snippet template, or empty if not applicable",
      "expectedKeyPoints": ["Key point 1", "Key point 2"],
      "difficulty": "${difficultyMode}"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return {
          questions: parsed.questions,
          extractedSkills: parsed.extractedSkills || ['React', 'TypeScript', 'Node.js', 'System Architecture']
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to intelligent dynamic generator:', err);
    }
  }

  // High Quality Smart Fallback Dynamic Generator
  const extractedSkills = extractSkillsFromText(resumeText + ' ' + jobDescriptionText + ' ' + targetRole);
  const contextText = (resumeText + ' ' + jobDescriptionText + ' ' + targetRole).toLowerCase();
  
  // Extract custom keywords from the user's input for granular template injections
  const frontendTech = ['react', 'next.js', 'typescript', 'javascript', 'tailwind', 'redux', 'graphql', 'html5', 'css3'].filter(k => contextText.includes(k));
  const backendTech = ['node.js', 'express', 'nest.js', 'python', 'django', 'fastapi', 'java', 'spring boot', 'go', 'golang', 'c++', 'ruby'].filter(k => contextText.includes(k));
  const databaseTech = ['mongodb', 'postgresql', 'mysql', 'redis', 'cassandra', 'dynamodb', 'sql', 'nosql', 'elasticsearch'].filter(k => contextText.includes(k));
  const infraTech = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'terraform', 'serverless', 'microservices', 'git'].filter(k => contextText.includes(k));

  // Determine user's primary languages and stack parameters
  const primarySkills = extractedSkills.length > 0 ? extractedSkills : ['React', 'Node.js', 'TypeScript', 'SQL'];
  const preferredLang = backendTech[0] || frontendTech[0] || 'typescript';
  
  const getDsaCodeSnippet = (qIndex: number, lang: string) => {
    if (lang === 'go' || lang === 'golang') {
      if (qIndex === 1) return `func maxSubArray(nums []int) int {\n  // Implement Kadane's Algorithm\n}`;
      if (qIndex === 2) return `type LRUCache struct {}\nfunc Constructor(capacity int) LRUCache {}\nfunc (this *LRUCache) Get(key int) int {}\nfunc (this *LRUCache) Put(key int, value int) {}`;
      if (qIndex === 3) return `func inorderTraversal(root *TreeNode) []int {\n  // Iterative in-order traversal using stack\n}`;
      if (qIndex === 4) return `func twoSum(numbers []int, target int) []int {\n  // Implement two-pointer technique\n}`;
    }
    if (lang === 'python') {
      if (qIndex === 1) return `def maxSubArray(self, nums: List[int]) -> int:\n    # Implement Kadane's Algorithm\n    pass`;
      if (qIndex === 2) return `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass`;
      if (qIndex === 3) return `def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n    # Iterative in-order traversal using stack\n    pass`;
      if (qIndex === 4) return `def twoSum(self, numbers: List[int], target: int) -> List[int]:\n    # Implement two-pointer technique\n    pass`;
    }
    if (lang === 'java') {
      if (qIndex === 1) return `public int maxSubArray(int[] nums) {\n    // Implement Kadane's Algorithm\n}`;
      if (qIndex === 2) return `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) {}\n    public void put(int key, int value) {}\n}`;
      if (qIndex === 3) return `public List<Integer> inorderTraversal(TreeNode root) {\n    // Iterative in-order traversal using stack\n}`;
      if (qIndex === 4) return `public int[] twoSum(int[] numbers, int target) {\n    // Implement two-pointer technique\n}`;
    }
    // Default TypeScript / JavaScript
    if (qIndex === 1) return `function maxSubArray(nums: number[]): number {\n  // Implement Kadane's Algorithm\n}`;
    if (qIndex === 2) return `class LRUCache {\n  constructor(capacity: number) {}\n  get(key: number): number {}\n  put(key: number, value: number): void {}\n}`;
    if (qIndex === 3) return `function inorderTraversal(root: TreeNode | null): number[] {\n  // Iterative in-order traversal using stack\n}`;
    if (qIndex === 4) return `function twoSum(numbers: number[], target: number): number[] {\n  // Implement two-pointer technique\n}`;
    return ``;
  };

  const pool: Question[] = [];
  
  if (roundType === 'dsa') {
    pool.push(
      {
        id: `gen_q1_${Date.now()}_1`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Given an array of integers, how would you find the contiguous subarray which has the largest sum in ${preferredLang.toUpperCase()}? Explain Kadane's Algorithm, and state the complexity bounds.`,
        contextOrCode: getDsaCodeSnippet(1, preferredLang),
        expectedKeyPoints: ["Kadane's Algorithm implementation", "O(n) time complexity and O(1) space complexity", "Handling negative number edge cases"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q2_${Date.now()}_2`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `How would you design and implement a Least Recently Used (LRU) Cache in ${preferredLang.toUpperCase()}? Explain the double linked list and hash map structure.`,
        contextOrCode: getDsaCodeSnippet(2, preferredLang),
        expectedKeyPoints: ["Use of Doubly Linked List and Hash Map", "O(1) lookup and insertion complexity", "Eviction policy details when capacity is reached"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q3_${Date.now()}_3`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Given a binary tree, write an iterative algorithm in ${preferredLang.toUpperCase()} to perform an in-order traversal iteratively without recursion.`,
        contextOrCode: getDsaCodeSnippet(3, preferredLang),
        expectedKeyPoints: ["Use of stack data structure to track nodes", "O(n) time complexity and O(h) space complexity where h is height", "Correct traversal order (Left, Root, Right)"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q4_${Date.now()}_4`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Given a sorted array of integers in ascending order, find two numbers that sum to a specific target using ${preferredLang.toUpperCase()}. State the optimal complexity.`,
        contextOrCode: getDsaCodeSnippet(4, preferredLang),
        expectedKeyPoints: ["Two pointer technique from start and end", "O(n) time and O(1) auxiliary space", "Binary search alternative at O(n log n)"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q5_${Date.now()}_5`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `You are given an array of k linked lists, each sorted in ascending order. Merge all the linked lists into one sorted linked list. Explain the heap trade-offs.`,
        contextOrCode: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {\n  // Use min heap / priority queue\n}`,
        expectedKeyPoints: ["Min Heap / Priority Queue implementation", "O(N log k) time complexity where N is total nodes", "Comparing list headers dynamically"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q6_${Date.now()}_6`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Explain cycle prevention.`,
        contextOrCode: `function cloneGraph(node: Node | null): Node | null {\n  // Traverse with map tracking original -> cloned\n}`,
        expectedKeyPoints: ["DFS or BFS traversal", "Hash map to map original node to clone node", "Handling cycles and self-loops"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q7_${Date.now()}_7`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Explain the dynamic programming approach to find the length of the longest common subsequence between two strings. State the complexity.`,
        contextOrCode: `function longestCommonSubsequence(text1: string, text2: string): number {\n  // DP Grid implementation\n}`,
        expectedKeyPoints: ["DP table dimensions (m+1)x(n+1)", "Time complexity O(m*n)", "Space optimization to O(min(m,n))"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q8_${Date.now()}_8`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `An array sorted in ascending order is rotated at an unknown pivot. How would you search for a target value in O(log n) time?`,
        contextOrCode: `function search(nums: number[], target: number): number {\n  // Modified binary search\n}`,
        expectedKeyPoints: ["Modified binary search", "Finding which half is sorted", "O(log n) time complexity"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q9_${Date.now()}_9`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Implement a Trie (Prefix Tree) with insert, search, and startsWith methods. What are the key advantages of a Trie over a Hash Map?`,
        contextOrCode: `class Trie {\n  insert(word: string): void {}\n  search(word: string): boolean {}\n  startsWith(prefix: string): boolean {}\n}`,
        expectedKeyPoints: ["TrieNode with children array/map and isEndOfWord flag", "Search/insert time complexity O(word_length)", "Space efficiency trade-offs"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q10_${Date.now()}_10`,
        type: 'technical',
        category: 'DSA (Data Structures & Algorithms)',
        questionText: `Given a linked list, reverse the nodes of a linked list k at a time and return its modified list. Unreversed items should remain as is.`,
        contextOrCode: `function reverseKGroup(head: ListNode | null, k: number): ListNode | null {\n  // k-group reverse recursion / loop\n}`,
        expectedKeyPoints: ["Group length check before reversing", "Iterative pointer redirection with previous and next nodes", "O(N) time and O(1) extra space"],
        difficulty: difficultyMode
      }
    );
  } else if (roundType === 'system_design') {
    pool.push(
      {
        id: `gen_q1_${Date.now()}_1`,
        type: 'technical',
        category: 'System Design & Storage',
        questionText: `Design a high-throughput, globally distributed URL shortening service (like Bit.ly) supporting target role requirements for a ${targetRole}. Focus on database scaling using ${databaseTech[0] || 'NoSQL'} and cached redirects.`,
        expectedKeyPoints: ["Unique ID generation (Base62 encoding or Snowflake ID)", "Database choice for fast read lookups (NoSQL key-value store or SQL with indexes)", "Use of Redis caching for hot redirection paths", "Load balancers and horizontal scaling"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q2_${Date.now()}_2`,
        type: 'technical',
        category: 'System Design & Real-Time',
        questionText: `How would you architect a real-time collaborative doc editing platform (like Google Docs) handling concurrent edits? Address synchronization with ${frontendTech[0] || 'React/TypeScript'} clients.`,
        expectedKeyPoints: ["Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs)", "WebSockets for duplex low-latency client-server connection", "Redis Pub/Sub or Kafka message queuing", "Database concurrency controls and state synchronization"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q3_${Date.now()}_3`,
        type: 'technical',
        category: 'System Design & Scaling',
        questionText: `Explain how you would design an API rate limiter to protect a cluster of services built using ${backendTech[0] || 'Node/Python'}. Compare sliding window vs token bucket.`,
        expectedKeyPoints: ["Token bucket, leaking bucket, or sliding window algorithms", "Redis in-memory store for rate limiting counters", "Middleware interceptors at API gateway level", "Graceful HTTP 429 Too Many Requests response handling"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q4_${Date.now()}_4`,
        type: 'technical',
        category: 'System Design & Queues',
        questionText: `Design a real-time chat application (like WhatsApp or Slack) handling massive concurrent connections. Detail how you manage state and buffer messages using ${infraTech[0] || 'message queues'}.`,
        expectedKeyPoints: ["Persistent connections (WebSocket/MQTT)", "Message status delivery tracking (sent, delivered, read)", "Distributed databases (Cassandra/DynamoDB) for messaging history", "Push notification integration"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q5_${Date.now()}_5`,
        type: 'technical',
        category: 'System Design & Geospatial',
        questionText: `Design a ride-sharing service backend like Uber. How do you track drivers in real-time and calculate surge rates under high database write concurrency?`,
        expectedKeyPoints: ["Geospatial indexing (S2 geometry or H3 spatial index)", "Real-time location pub/sub updates", "Dynamic pricing surge calculation algorithms", "Matchmaker dispatching service"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q6_${Date.now()}_6`,
        type: 'technical',
        category: 'System Design & CDNs',
        questionText: `Design a global video streaming platform like Netflix. Explain the flow from content upload to media delivery using CDNs and transcoding pipelines.`,
        expectedKeyPoints: ["Content Delivery Networks (CDNs) optimization", "Adaptive Bitrate Streaming (HLS / MPEG-DASH)", "Transcoding servers for multiple resolutions", "Metadata storage and recommendations engine caching"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q7_${Date.now()}_7`,
        type: 'technical',
        category: 'System Design & Scraping',
        questionText: `How would you design a distributed web crawler that scales to index billions of pages? Address duplicate checks using Bloom filters.`,
        expectedKeyPoints: ["Frontier URL queue sorting and prioritization", "DNS resolver caching layer", "Duplicate detection using Bloom filters or hashes", "Robots.txt parsing politeness limits"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q8_${Date.now()}_8`,
        type: 'technical',
        category: 'System Design & Databases',
        questionText: `Design a highly available distributed key-value store. Explain partition strategy using consistent hashing and vector clocks for conflict resolution.`,
        expectedKeyPoints: ["Consistent hashing partition strategy", "Quorum consensus read/write consistency levels (W + R > N)", "Sloppy quorum and hinted handoff", "Vector clocks for conflict resolution"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q9_${Date.now()}_9`,
        type: 'technical',
        category: 'System Design & Notifications',
        questionText: `Design a transactional and promotional notification service. How do you handle asynchronous distribution to SMS/Email and guarantee idempotency?`,
        expectedKeyPoints: ["Task queues (RabbitMQ/Celery) for asynchronous execution", "Third-party gateway integrations (Twilio, APNS, FCM)", "User notification settings database schema", "Idempotent processing to avoid double delivery"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q10_${Date.now()}_10`,
        type: 'technical',
        category: 'System Design & Telemetry',
        questionText: `Design a metrics monitoring and alerting system for tracking CPU usage across 100,000 servers. Detail the metrics pull model using Prometheus.`,
        expectedKeyPoints: ["Time-series database selection (InfluxDB/Prometheus)", "Pull vs push metric collection models", "Data aggregation and downsampling policies", "Grafana-style dashboard visualization interface"],
        difficulty: difficultyMode
      }
    );
  } else if (roundType === 'behavioral') {
    pool.push(
      {
        id: `gen_q1_${Date.now()}_1`,
        type: 'behavioral',
        category: 'Behavioral & Leadership',
        questionText: `Describe a time when you had a major technical disagreement with a colleague on the architectural direction of a project built using ${primarySkills[0] || 'modern stack'}. How did you resolve the conflict?`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Constructive conflict management and active listening", "Data-driven trade-off analysis", "Supporting the final decision to align with project milestones"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q2_${Date.now()}_2`,
        type: 'behavioral',
        category: 'Behavioral & Trade-offs',
        questionText: `Tell me about a time you had to balance shipping a critical feature using ${primarySkills[1] || 'your core stack'} to meet a business deadline versus maintaining high code quality and test coverage.`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Proactive alignment and collaboration with product management", "Documenting and scheduling refactoring cycles", "Minimizing risk and core system stability"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q3_${Date.now()}_3`,
        type: 'behavioral',
        category: 'Behavioral & Adaptability',
        questionText: `Describe a situation where a project scope or database requirements changed dramatically mid-development. How did you adapt your plan, communicate changes, and deliver?`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Agile response to dynamic requirements", "Clear and transparent updates to key stakeholders", "Prioritizing minimal viable scope items"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q4_${Date.now()}_4`,
        type: 'behavioral',
        category: 'Behavioral & Stakeholders',
        questionText: `Describe a time you had to handle a highly demanding or difficult stakeholder during the rollout of a ${targetRole} feature. How did you manage expectations?`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Active empathy and customer success perspective", "Clear communication boundaries", "Finding middle-ground solutions with documentation"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q5_${Date.now()}_5`,
        type: 'behavioral',
        category: 'Behavioral & Growth',
        questionText: `Tell me about a major engineering mistake or bug you introduced in a system utilizing ${primarySkills[0] || 'development tools'}. What went wrong, and how did you mitigate it?`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Ownership and vulnerability regarding errors", "Root-cause analysis post-mortem", "Process improvements implemented to prevent repeat"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q6_${Date.now()}_6`,
        type: 'behavioral',
        category: 'Behavioral & Initiative',
        questionText: `Describe a time you noticed an inefficiency or technical debt in a codebase using ${primarySkills[2] || 'your stack'} and proactively took initiative to refactor it without being asked.`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Proactive identification of bottleneck or risk", "Rallying peers or seeking approval independently", "Quantifiable positive performance outcomes"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q7_${Date.now()}_7`,
        type: 'behavioral',
        category: 'Behavioral & Priorities',
        questionText: `How do you prioritize deliverables when working on multiple high-priority tasks simultaneously? Provide an example from your past projects.`,
        expectedKeyPoints: ["Eisenhower matrix (Urgent vs Important)", "Stakeholder communication regarding trade-offs", "Time blocking and capacity planning", "Automating repetitive work to focus on high impact"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q8_${Date.now()}_8`,
        type: 'behavioral',
        category: 'Behavioral & Mentorship',
        questionText: `Describe a time you mentored or coached a classmate or developer in understanding a complex topic, like ${primarySkills[0] || 'system architecture'} or design patterns.`,
        expectedKeyPoints: ["Active coaching and pairing", "Tailoring learning style to match individual", "Constructive feedback loops", "Celebrating team member success and independence"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q9_${Date.now()}_9`,
        type: 'behavioral',
        category: 'Behavioral & Adaptability',
        questionText: `Tell me about a time you had to learn a completely new technology (such as ${infraTech[0] || 'Docker/Kubernetes'} or ${databaseTech[0] || 'NoSQL'}) in a matter of days to deliver a project.`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Filling critical execution gap", "Fast learning curve on new domain", "Handover plan back to specialized team"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q10_${Date.now()}_10`,
        type: 'behavioral',
        category: 'Behavioral & Communications',
        questionText: `Tell me about a time you had to deliver bad news (like a critical security vulnerability or delayed launch date) to a team lead or client. How did you structure the communication?`,
        expectedKeyPoints: ["STAR format (Situation, Task, Action, Result)", "Direct and transparent honesty", "Presenting mitigation solutions alongside problem", "Earning long-term respect and alignment"],
        difficulty: difficultyMode
      }
    );
  } else {
    // technical_screen
    pool.push(
      {
        id: `gen_q1_${Date.now()}_1`,
        type: 'technical',
        category: extractedSkills[0] || 'Web Architecture',
        questionText: `Given your target role as a ${targetRole} (${experienceLevel}), how would you optimize the performance and memory consumption of a production application utilizing ${extractedSkills.slice(0, 3).join(', ') || 'modern frameworks'} under high request concurrency?`,
        expectedKeyPoints: [
          'Profiling memory leaks and event loop bottlenecks',
          'Caching strategy (Redis / CDN / In-Memory)',
          'Asynchronous non-blocking batch execution',
          'Database indexing and connection pooling'
        ],
        difficulty: difficultyMode
      },
      {
        id: `gen_q2_${Date.now()}_2`,
        type: 'behavioral',
        category: 'Behavioral & Problem Solving',
        questionText: `Given the requirements for ${primarySkills[0] || 'engineering'} in the Job Description, tell me about a time you balanced building a quick feature versus writing a long-term scalable system.`,
        expectedKeyPoints: [
          'STAR format (Situation, Task, Action, Result)',
          'Clear trade-off analysis and communication with stakeholders',
          'Documenting and tracking technical debt backlog items',
          'Post-launch refactoring strategy'
        ],
        difficulty: difficultyMode
      },
      {
        id: `gen_q3_${Date.now()}_3`,
        type: 'technical',
        category: 'CS Fundamentals & Reliability',
        questionText: `How do you handle error boundaries, distributed transactions, or state recovery when an upstream API service fails in a system using ${primarySkills[1] || 'your core stack'}?`,
        expectedKeyPoints: [
          'Circuit breaker pattern and retry backoff',
          'Idempotency keys and saga transaction pattern',
          'Graceful UX degradation and user notification'
        ],
        difficulty: difficultyMode
      },
      {
        id: `gen_q4_${Date.now()}_4`,
        type: 'technical',
        category: 'Database Scaling',
        questionText: `What are the trade-offs between horizontal and vertical database scaling? Compare relational database sharding with NoSQL scaling using ${databaseTech[0] || 'SQL/NoSQL'}.`,
        expectedKeyPoints: ["Vertical vs horizontal scalability", "Normalization/joins vs denormalization/documents", "Distributed sharding and replication lag", "CAP theorem trade-offs"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q5_${Date.now()}_5`,
        type: 'technical',
        category: 'Modern Web Architecture',
        questionText: `Explain the differences in rendering, state management, and page hydration speed when building frontend applications using ${frontendTech[0] || 'React'} compared to server rendering.`,
        expectedKeyPoints: ["Hydration overhead and initial page load speed", "Data fetching location (client vs server)", "Bundle size reduction strategies", "SEO and metadata implications"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q6_${Date.now()}_6`,
        type: 'technical',
        category: 'Authentication & Security',
        questionText: `How do JSON Web Tokens (JWTs) work for securing user sessions in a ${backendTech[0] || 'Node/Go'} backend, and how do you protect cookies from XSS and CSRF?`,
        expectedKeyPoints: ["Token lifecycle and expiration strategies", "Storing refresh tokens in HTTP-only cookies", "Token revocation / blacklisting databases", "CSRF vs XSS protection vectors"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q7_${Date.now()}_7`,
        type: 'technical',
        category: 'API Protocols',
        questionText: `Compare REST and GraphQL protocols. Under what specific scenarios would you choose GraphQL for a project leveraging ${primarySkills[2] || 'your stack'}?`,
        expectedKeyPoints: ["Over-fetching vs under-fetching of endpoint resources", "Schema definitions and strong type safety", "Caching complexity differences (HTTP proxy caching)", "Single endpoint request consolidation"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q8_${Date.now()}_8`,
        type: 'technical',
        category: 'Containerization & Infrastructure',
        questionText: `How does containerization with ${infraTech[0] || 'Docker'} improve deployment reliability compared to virtual machines? Detail networking isolation boundaries.`,
        expectedKeyPoints: ["Shared host OS kernel vs full hypervisor overhead", "Isolation bounds and security security", "Startup speeds and horizontal scaling agility", "Image layers caching for CI/CD speed"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q9_${Date.now()}_9`,
        type: 'technical',
        category: 'CI/CD Pipelines',
        questionText: `Design a high-reliability Continuous Integration and Delivery (CI/CD) deployment pipeline for a project built on ${primarySkills[0] || 'your stack'}. What checks block the merge?`,
        expectedKeyPoints: ["Unit/Integration test stages blocking merge", "Automated code analysis and security scans", "Immutable container image registry uploads", "Canary or Blue-Green release orchestrations"],
        difficulty: difficultyMode
      },
      {
        id: `gen_q10_${Date.now()}_10`,
        type: 'technical',
        category: 'Security Protocols',
        questionText: `Explain CORS, CSRF, and XSS. How does an application built with ${frontendTech[0] || 'JavaScript'} enforce secure HTTP header policies?`,
        expectedKeyPoints: ["Cross-Origin Resource Sharing (CORS) headers configuration", "Cross-Site Scripting (XSS) input sanitization", "Cross-Site Request Forgery (CSRF) tokens validation", "HTTPS/TLS encryption in transit"],
        difficulty: difficultyMode
      }
    );
  }

  const slicedQuestions = pool.slice(0, Math.min(questionCount, pool.length));
  return { questions: slicedQuestions, extractedSkills };
};

export const evaluateAnswer = async (
  question: Question,
  userAnswer: string,
  targetRole: string
): Promise<QuestionEvaluation> => {
  const genAI = getGeminiClient();

  if (genAI && userAnswer.trim().length > 10) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an elite Tech Lead & Senior Interviewer evaluating a candidate's answer for the role of "${targetRole}".

Question Category: ${question.category}
Question Difficulty: ${question.difficulty}
Question: "${question.questionText}"
Expected Key Points: ${question.expectedKeyPoints.join(', ')}

Candidate's Answer:
"${userAnswer}"

Instructions:
Evaluate the answer critically and constructively, calibrating your expectations according to the question difficulty level ("${question.difficulty}").
Return ONLY a valid raw JSON object matching the schema below (no markdown code block syntax).

JSON Schema:
{
  "score": 85,
  "structureScore": 80,
  "technicalScore": 90,
  "clarityScore": 85,
  "keyPointsCovered": ["Point 1 covered"],
  "keyPointsMissed": ["Point 2 missed"],
  "feedback": "Constructive 2-3 sentence overview...",
  "positiveHighlights": ["Clear explanation of concept X", "Good use of STAR framework"],
  "areasToImprove": ["Mention time complexity explicitly", "Add error handling details"],
  "modelAnswer": "Comprehensive model answer for comparison..."
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        questionId: question.id,
        userAnswer,
        score: parsed.score || 75,
        structureScore: parsed.structureScore || 75,
        technicalScore: parsed.technicalScore || 75,
        clarityScore: parsed.clarityScore || 80,
        keyPointsCovered: parsed.keyPointsCovered || question.expectedKeyPoints.slice(0, 2),
        keyPointsMissed: parsed.keyPointsMissed || question.expectedKeyPoints.slice(2),
        feedback: parsed.feedback || 'Good structural start. Incorporate more granular technical examples to strengthen your response.',
        positiveHighlights: parsed.positiveHighlights || ['Identified the primary system constraint clearly.', 'Good logical flow.'],
        areasToImprove: parsed.areasToImprove || ['Mention specific Big-O memory bounds.', 'Provide concrete real-world code snippet.'],
        modelAnswer: parsed.modelAnswer || `To answer this question effectively: 1. Briefly define the core problem. 2. Explain your solution using ${question.expectedKeyPoints.join(', ')}. 3. Address edge cases and scalability.`
      };
    } catch (e) {
      console.warn('Gemini evaluation fallback:', e);
    }
  }

  // Dynamic Rule-based Heuristic AI Evaluation Engine
  const words = userAnswer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  let score = 50;
  if (wordCount > 20) score += 20;
  if (wordCount > 60) score += 15;
  if (wordCount > 120) score += 10;

  const covered: string[] = [];
  const missed: string[] = [];

  question.expectedKeyPoints.forEach(pt => {
    const keyTerms = pt.toLowerCase().split(' ').filter(w => w.length > 3);
    const hasMatch = keyTerms.some(term => userAnswer.toLowerCase().includes(term));
    if (hasMatch) {
      covered.push(pt);
      score += 5;
    } else {
      missed.push(pt);
    }
  });

  score = Math.min(95, Math.max(40, score));

  return {
    questionId: question.id,
    userAnswer,
    score,
    structureScore: Math.min(95, score + 2),
    technicalScore: Math.min(95, score - 3),
    clarityScore: Math.min(95, score + 5),
    keyPointsCovered: covered.length ? covered : [question.expectedKeyPoints[0] || 'Core concept identification'],
    keyPointsMissed: missed,
    feedback: wordCount < 30 
      ? 'Your response was concise. Try expanding with the STAR method or specific code trade-offs to demonstrate depth.'
      : 'Solid response with clear logic! You demonstrated good domain familiarity and covered key requirements.',
    positiveHighlights: [
      'Logical flow and clear progression of thoughts.',
      `Directly addressed the core context of ${question.category}.`
    ],
    areasToImprove: [
      'Elaborate on edge cases and failure recovery mechanisms.',
      'Explicitly quantify performance gains (e.g. latency reduction, memory footprint).'
    ],
    modelAnswer: `A comprehensive answer should follow a structured breakdown:\n1. Core Overview: State your approach clearly.\n2. Technical Implementation: Detail ${question.expectedKeyPoints.join(', ')}.\n3. Metrics & Trade-offs: Contrast with alternatives.`
  };
};

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 
    'Python', 'Java', 'C++', 'Go', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
    'Docker', 'AWS', 'Kubernetes', 'REST APIs', 'GraphQL', 'System Design',
    'Tailwind CSS', 'Microservices', 'Git', 'CI/CD'
  ];
  
  const found = commonSkills.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startBoundary = /^\w/.test(skill) ? '\\b' : '';
    const endBoundary = /\w$/.test(skill) ? '\\b' : '';
    return new RegExp(`${startBoundary}${escaped}${endBoundary}`, 'i').test(text);
  });

  return found.length > 0 ? found : ['React', 'Node.js', 'TypeScript', 'System Design', 'SQL'];
}
