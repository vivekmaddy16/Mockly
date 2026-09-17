import { MCQPracticeQuestion } from '@/types';

export const companyPrepQuestions: Record<string, MCQPracticeQuestion[]> = {
  'Google Prep': [
    // 6 Easy
    {
      id: 'goog-e1',
      q: 'What binary serialization protocol developed by Google provides faster, smaller, and typed message exchange compared to JSON and XML?',
      options: ['Protocol Buffers (Protobuf)', 'YAML', 'MessagePack', 'GraphQL'],
      correctAnswer: 0,
      explanation: 'Protocol Buffers (Protobuf) is Google\'s language-neutral, platform-neutral extensible mechanism for serializing structured data into compact binary streams, making it standard for gRPC microservices.',
      difficulty: 'Easy'
    },
    {
      id: 'goog-e2',
      q: 'What is gRPC, and what transport protocol does it mandate by default?',
      options: [
        'A remote procedure call framework developed by Google running over HTTP/2.',
        'A relational database engine running over UDP.',
        'A frontend state management library running in JavaScript.',
        'An encryption algorithm for mobile devices.'
      ],
      correctAnswer: 0,
      explanation: 'gRPC is a high-performance, open-source universal RPC framework developed by Google. By leveraging HTTP/2, it supports bidirectional streaming, multiplexing, and header compression.',
      difficulty: 'Easy'
    },
    {
      id: 'goog-e3',
      q: 'In Google search indexing, what is the role of the "Inverted Index" data structure?',
      options: [
        'To list websites sorted from newest to oldest.',
        'To map search terms/words directly to the list of document IDs (postings lists) containing those words, enabling sub-millisecond keyword lookup.',
        'To reverse the order of letters in URLs for encryption.',
        'To compress images stored in cloud data centers.'
      ],
      correctAnswer: 1,
      explanation: 'An inverted index maps terms to postings lists (document IDs and token offsets). When a user enters keywords, search engines perform set intersections on these postings lists rather than scanning raw web pages.',
      difficulty: 'Easy'
    },
    {
      id: 'goog-e4',
      q: 'Which Google container orchestration system served as the internal predecessor to Kubernetes?',
      options: ['Borg', 'Docker Swarm', 'Mesos', 'Nomad'],
      correctAnswer: 0,
      explanation: 'Google\'s internal cluster manager "Borg" managed hundreds of thousands of jobs across tens of thousands of machines for over a decade, directly informing the open-source design of Kubernetes.',
      difficulty: 'Easy'
    },
    {
      id: 'goog-e5',
      q: 'What is the primary role of an SRE (Site Reliability Engineer) as defined by Google?',
      options: [
        'Writing marketing copy for Google Cloud products.',
        'Applying software engineering practices to infrastructure and operations problems, managing SLAs, error budgets, and system automation.',
        'Installing physical Ethernet cables in server racks.',
        'Conducting employee interviews exclusively.'
      ],
      correctAnswer: 1,
      explanation: 'At Google, "SRE is what happens when you ask a software engineer to design an operations function". SREs write automation, eliminate operational toil, define error budgets, and ensure system reliability.',
      difficulty: 'Easy'
    },
    {
      id: 'goog-e6',
      q: 'What is a Bloom Filter and why is it used heavily across Google infrastructure (like Bigtable)?',
      options: [
        'An image processing filter used in Google Photos.',
        'A space-efficient probabilistic data structure used to test set membership; it can return false positives but never false negatives.',
        'A sorting algorithm for large string arrays.',
        'A network routing filter that blocks spam emails.'
      ],
      correctAnswer: 1,
      explanation: 'A Bloom filter uses bit arrays and k hash functions. If it says an element is absent, it is guaranteed 100% absent (no false negatives), saving expensive disk I/O when reading Bigtable SSTables.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'goog-m1',
      q: 'What occurs during the Shuffle and Sort phase of the Google MapReduce computing paradigm?',
      options: [
        'Mappers delete their intermediate output files to free cluster RAM.',
        'Intermediate key-value pairs produced by mappers are partitioned across machines, transferred over the network, and sorted by key so each reducer receives all values for a given key.',
        'Data is transformed into relational SQL tables.',
        'Failed compute nodes are rebooted by the master node.'
      ],
      correctAnswer: 1,
      explanation: 'The Shuffle and Sort phase acts as the communication pipeline between Map and Reduce: it routes intermediate outputs from all mappers (partitioned by hash(key) mod R), sorts them by key, and streams them into Reducer tasks.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m2',
      q: 'How does Google Colossus (the successor to Google File System / GFS) address the single master bottleneck?',
      options: [
        'By eliminating all metadata storage.',
        'By distributing file system metadata across a scalable Bigtable cluster, allowing billions of files and petabytes of throughput without a centralized master node bottleneck.',
        'By running entirely on consumer laptops.',
        'By switching from TCP to satellite transmission.'
      ],
      correctAnswer: 1,
      explanation: 'Original GFS relied on a single master node holding all chunk metadata in RAM, which limited file counts and caused failover delays. Colossus decentralized metadata storage onto Bigtable and distributed consensus services.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m3',
      q: 'In Google\'s distributed lock service "Chubby", which consensus algorithm is used to maintain coarse-grained locks and configuration files?',
      options: ['Paxos', 'Two-Phase Commit', 'Gossip Protocol', 'Vector Clocks'],
      correctAnswer: 0,
      explanation: 'Google Chubby uses the Paxos consensus algorithm across a replica set (typically 5 nodes) to provide fault-tolerant, coarse-grained distributed locks and small file storage for thousands of clients.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m4',
      q: 'In designing a web crawler indexing billions of pages, how do Google systems prevent overwhelming target web servers?',
      options: [
        'By running crawls exclusively on weekends.',
        'By employing Per-Host Politeness Queues with configurable domain rate limits and backoff heuristics, alongside distributed URL deduplication.',
        'By issuing ICMP ping bursts to target domains before crawling.',
        'By opening headless browsers without checking domain history.'
      ],
      correctAnswer: 1,
      explanation: 'The crawler URL frontier isolates URLs into per-host politeness queues. A scheduler ensures a safe delay (e.g. 500ms to a few seconds) between successive requests to the same domain, respecting robots.txt directives.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m5',
      q: 'In Google BigQuery (Dremel), what is the architectural principle behind its ability to query petabytes in seconds?',
      options: [
        'It loads the entire petabyte dataset into CPU L1 cache.',
        'Columnar data layout (Cap\'n Proto / Capacitor) paired with a massive multi-level execution tree that dynamically dispatches query fragments across thousands of worker slots.',
        'It converts SQL queries into regular expressions.',
        'It requires all data to be indexed using B+ Trees.'
      ],
      correctAnswer: 1,
      explanation: 'BigQuery / Dremel stores data in a nested columnar format (reading only referenced columns) and uses a multi-level serving tree: root servers rewrite queries, intermediate mixers aggregate fragments, and thousands of leaf slots scan storage in parallel.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m6',
      q: 'What is the function of Google\'s Borglet in Borg cluster architecture?',
      options: [
        'A load balancer that handles Google.com homepage traffic.',
        'An agent process that runs on every worker machine in the Borg cell, responsible for starting/stopping tasks, monitoring health, and enforcing resource allocations (cgroups).',
        'A command-line compiler for C++ code.',
        'A billing calculation script for Google Cloud.'
      ],
      correctAnswer: 1,
      explanation: 'The Borglet is the local node daemon in Borg (equivalent to the Kubelet in Kubernetes). It reports machine status to the Borgmaster, starts/kills container tasks, and manages OS cgroup resource constraints.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m7',
      q: 'In distributed rate limiting, why is the Token Bucket algorithm preferred over a Fixed Window Counter?',
      options: [
        'Token Bucket uses 0 memory.',
        'Token bucket allows controlled traffic bursts up to the bucket capacity while maintaining a steady average throughput rate, avoiding boundary traffic spikes at window edges.',
        'Fixed window counter requires running background threads on client phones.',
        'Token bucket cannot be used with Redis.'
      ],
      correctAnswer: 1,
      explanation: 'Fixed window counters suffer from double-limit bursts (e.g. limit 100/min: sending 100 at 0:59 and 100 at 1:01 yields 200 requests within 2 seconds). Token Bucket smooths traffic and cleanly accommodates defined burst sizes.',
      difficulty: 'Medium'
    },
    {
      id: 'goog-m8',
      q: 'In building Google Autocomplete (typeahead search suggestions), which data structure provides fast prefix matching and ranking?',
      options: [
        'Trie (Prefix Tree) with top-K frequency suggestions cached at each node',
        'Doubly Linked List',
        'Min-Heap with sequential array scans',
        'Bloom Filter'
      ],
      correctAnswer: 0,
      explanation: 'A Trie organizes strings by common prefixes. By storing precomputed top-K historical query completions directly at each Trie node, search prefix lookups run in O(L) time where L is query length, independent of total dataset size.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'goog-h1',
      q: 'Search Rank: In Google\'s foundational PageRank algorithm, why is the Damping Factor (typically d = 0.85) mathematically necessary for convergence?',
      options: [
        'It stops spider-traps (cyclic link loops) and sink nodes (dead-ends) from absorbing all rank, ensuring the Markov chain converges to a unique stationary distribution.',
        'It compresses the graph adjacency matrix into 16-bit integers.',
        'It calculates Google Ads click-through probabilities.',
        'It filters non-indexed PDF files from the link matrix.'
      ],
      correctAnswer: 0,
      explanation: 'Without the damping factor d, dead ends act as rank sinks and isolated cycles trap probability mass. The (1-d)/N probability of jumping to a random page ensures the transition matrix is irreducible, aperiodic, and stochastic (Perron-Frobenius theorem).',
      difficulty: 'Hard'
    },
    {
      id: 'goog-h2',
      q: 'Storage: In Google Bigtable and LSM-Tree storage engines, how are writes and reads handled to sustain massive write throughput?',
      options: [
        'Writes overwrite records in place via B-Tree page splits.',
        'Writes are sequentially appended to a commit log (WAL) and inserted into an in-memory MemTable (skip list); background compaction flushes MemTables to immutable SSTables on disk.',
        'Data is kept strictly in RAM without any disk persistence.',
        'Every write acquires a cluster-wide distributed lock.'
      ],
      correctAnswer: 1,
      explanation: 'Log-Structured Merge-Trees turn random disk I/O into sequential writes. Writes are logged to WAL and inserted into a memory skip list (MemTable). Periodically, MemTables flush as immutable SSTables. Reads check MemTable, Bloom filters, and SSTables.',
      difficulty: 'Hard'
    },
    {
      id: 'goog-h3',
      q: 'Consistency: In Google Spanner, how does the TrueTime API enable globally consistent (external/linearizable) distributed transactions without cross-datacenter two-phase locking for reads?',
      options: [
        'By assuming all network latencies are exactly zero.',
        'By providing bounded clock uncertainty [earliest, latest] using atomic clocks and GPS receivers in every datacenter; transactions wait out the uncertainty window (commit wait) before releasing timestamps.',
        'By executing all writes in a single master datacenter in California.',
        'By forcing all transactions to run in serial single-threaded queues.'
      ],
      correctAnswer: 1,
      explanation: 'TrueTime exposes an interval [t.earliest, t.latest] with guaranteed bounded uncertainty epsilon (< 7ms). By enforcing a "commit wait" rule (delaying commit acknowledgement until current real time > commit timestamp), Spanner guarantees strict external consistency globally.',
      difficulty: 'Hard'
    },
    {
      id: 'goog-h4',
      q: 'Distributed Systems: In Google MillWheel / Cloud Dataflow stream processing, what is the distinction between "Event Time" and "Processing Time"?',
      options: [
        'They are synonymous terms for CPU clock cycles.',
        'Event Time is the timestamp when the real-world event occurred on the user device; Processing Time is when the stream processor machine observes and processes the record.',
        'Event Time applies only to SQL databases; Processing Time applies to NoSQL.',
        'Processing Time is always earlier than Event Time.'
      ],
      correctAnswer: 1,
      explanation: 'Network delays, mobile offline caching, and retries cause messages to arrive out of order. Watermarks track progress in Event Time (when events happened), allowing systems to compute correct windowed aggregates despite unpredictable Processing Time delays.',
      difficulty: 'Hard'
    },
    {
      id: 'goog-h5',
      q: 'Distributed Tracing: In Google Dapper distributed tracing architecture, how are requests tracked across dozens of asynchronous RPC boundaries?',
      options: [
        'By sending entire database copies along with network packets.',
        'By propagating a lightweight TraceContext (Trace ID, Span ID, Sampling Flags) in RPC metadata headers across thread boundaries and network hops.',
        'By installing screen recording software on every server.',
        'By running every service inside a single OS thread.'
      ],
      correctAnswer: 1,
      explanation: 'Dapper injects a Trace ID (for the entire distributed tree) and Span ID (for individual RPC units) into RPC metadata headers. Daemons collect trace spans asynchronously with negligible CPU/bandwidth overhead (~0.01%).',
      difficulty: 'Hard'
    },
    {
      id: 'goog-h6',
      q: 'Consensus: In Google Paxos implementations, what condition guarantees that two distinct Proposers cannot commit conflicting values for the same instance?',
      options: [
        'Proposers must obtain approval from all nodes in the universe.',
        'Any two Quorums (majorities of nodes) must overlap by at least one common acceptor node; acceptors reject proposals with lower proposal numbers than already seen.',
        'Proposals are sorted alphabetically by server hostname.',
        'Proposals can only be submitted on odd-numbered days.'
      ],
      correctAnswer: 1,
      explanation: 'Paxos relies on the Pigeonhole Principle: in a cluster of 2F+1 nodes, any two majority quorums (F+1 nodes) must share at least one node. Because acceptors only accept higher proposal numbers and report previously accepted values, safety is guaranteed.',
      difficulty: 'Hard'
    }
  ],

  'Amazon Prep': [
    // 6 Easy
    {
      id: 'amzn-e1',
      q: 'Under Amazon\'s hallmark "Customer Obsession" principle, what product development methodology is mandatory across engineering teams?',
      options: [
        'Build features first and gather customer feedback only after deployment.',
        'Working Backwards: Drafting an internal Press Release and Customer FAQ (PR/FAQ) from the customer perspective before writing any code.',
        'Copying competitor features pixel-for-pixel.',
        'Maximizing sprint velocity regardless of error budgets.'
      ],
      correctAnswer: 1,
      explanation: 'Amazon\'s "Working Backwards" process requires engineering and product teams to author a customer-centric Press Release and exhaustive FAQ (PR/FAQ) defining customer benefits and architecture tradeoffs before engineering starts.',
      difficulty: 'Easy'
    },
    {
      id: 'amzn-e2',
      q: 'Which AWS service is a managed, highly scalable NoSQL key-value and document database offering single-digit millisecond latency?',
      options: ['Amazon Aurora', 'Amazon DynamoDB', 'Amazon Redshift', 'Amazon Neptune'],
      correctAnswer: 1,
      explanation: 'Amazon DynamoDB is a fully managed serverless NoSQL database designed for massive scale, supporting consistent single-digit millisecond performance and automatic horizontal sharding.',
      difficulty: 'Easy'
    },
    {
      id: 'amzn-e3',
      q: 'What is the purpose of Amazon S3 (Simple Storage Service)?',
      options: [
        'An operating system kernel.',
        'An object storage service offering 99.999999999% (11 9s) of data durability for unstructured data like images, backups, and data lakes.',
        'A real-time relational SQL transaction engine.',
        'A DNS query router.'
      ],
      correctAnswer: 1,
      explanation: 'Amazon S3 stores data as objects within buckets, providing high durability (11 9s) across multiple Availability Zones, versatile storage tiers, and fine-grained IAM access control.',
      difficulty: 'Easy'
    },
    {
      id: 'amzn-e4',
      q: 'What does Amazon\'s "Two-Pizza Team" rule represent in organizational and software architecture?',
      options: [
        'Teams must spend their entire budget on pizza every Friday.',
        'Teams should be small enough (typically 6-10 engineers) to be fed by two pizzas, promoting autonomy, clear ownership, and decoupled microservice boundaries.',
        'Engineers are not allowed to eat during sprints.',
        'Two teams must always collaborate on every pull request.'
      ],
      correctAnswer: 1,
      explanation: 'Jeff Bezos popularized the "Two-Pizza Team" philosophy: small autonomous teams reduce communication overhead, own their end-to-end service lifecycle ("you build it, you run it"), and minimize organizational coupling.',
      difficulty: 'Easy'
    },
    {
      id: 'amzn-e5',
      q: 'Which AWS service provides serverless event-driven computing where code executes in response to triggers without managing servers?',
      options: ['AWS Lambda', 'Amazon EC2', 'AWS Elastic Beanstalk', 'Amazon ECS'],
      correctAnswer: 0,
      explanation: 'AWS Lambda runs code in ephemeral micro-VMs (Firecracker) triggered by events (HTTP API calls, S3 uploads, DynamoDB streams), automatically scaling execution and billing per millisecond.',
      difficulty: 'Easy'
    },
    {
      id: 'amzn-e6',
      q: 'What is an AWS Availability Zone (AZ)?',
      options: [
        'A geographical country boundary.',
        'One or more discrete datacenters with redundant power, networking, and connectivity in an AWS Region, isolated from faults in other AZs.',
        'A browser cache partition.',
        'A software firewall rule.'
      ],
      correctAnswer: 1,
      explanation: 'An AWS Region contains multiple isolated Availability Zones (AZs). Each AZ comprises one or more physical datacenters separated by meaningful physical distance to protect against localized disasters.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'amzn-m1',
      q: 'Why must microservice consumers processing orders from AWS SQS (Simple Queue Service) standard queues be strictly idempotent?',
      options: [
        'Standard SQS guarantees at-least-once delivery, meaning network retries or visibility timeouts can cause duplicate message delivery.',
        'Standard SQS only allows each message to be read once in its lifetime.',
        'SQS cancels credit card transactions if duplicate messages appear.',
        'Messages in SQS are deleted immediately upon retrieval.'
      ],
      correctAnswer: 0,
      explanation: 'Standard SQS guarantees "at-least-once" delivery to maximize throughput and resilience. In consumer crashes or network retries, duplicate deliveries happen. Consumers must use idempotency keys (e.g. Order ID) to prevent double processing.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m2',
      q: 'What is Amazon\'s "Bias for Action" leadership principle, and how does the concept of "One-Way vs Two-Way Doors" guide it?',
      options: [
        'All engineering decisions must be approved by the CEO.',
        'Speed matters in business: Two-way door decisions are easily reversible and should be made quickly with high velocity; One-way door decisions are irreversible and require deliberate analysis.',
        'Engineers should never write automated tests.',
        'All software must be released as open source.'
      ],
      correctAnswer: 1,
      explanation: 'Two-way doors (type 2 decisions) can be reversed if they fail; teams should act decisively without paralysis. One-way doors (type 1 decisions, like architectural contracts or data schemas) cannot be easily undone and warrant exhaustive diligence.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m3',
      q: 'In AWS API Gateway, what is the difference between a Throttling Limit and a Burst Limit?',
      options: [
        'Throttling applies to mobile users; Burst applies to desktop users.',
        'Throttling defines the sustained steady-state rate (requests per second via token bucket); Burst defines the instantaneous concurrency spike capacity the gateway accepts before rejecting with HTTP 429.',
        'Throttling is measured in gigabytes; Burst in megabytes.',
        'Burst limit shuts down the server for 10 minutes.'
      ],
      correctAnswer: 1,
      explanation: 'AWS API Gateway uses the token bucket algorithm. The steady-state rate is the sustained token refill rate (e.g. 10,000 RPS). The burst capacity allows momentary traffic spikes (e.g. 5,000 extra requests) beyond steady-state before returning 429 Too Many Requests.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m4',
      q: 'In DynamoDB data modeling, what is the purpose of the "Single-Table Design" pattern?',
      options: [
        'To reduce AWS cloud costs by keeping table counts under 1, and to fetch multiple related entities (e.g. Order and OrderItems) in a single round-trip query using partition and sort keys.',
        'Because DynamoDB limits accounts to a maximum of 1 table.',
        'To prevent SQL injection attacks.',
        'To avoid configuring IAM permissions.'
      ],
      correctAnswer: 0,
      explanation: 'Single-Table Design models multiple relational entities in one physical table using generic partition (PK) and sort keys (SK). By querying a common partition key, related records are fetched in a single low-latency network call, eliminating distributed joins.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m5',
      q: 'What is the purpose of the Saga Pattern in distributed Amazon e-commerce checkout flows?',
      options: [
        'To compress order data using gzip.',
        'To maintain data consistency across decoupled microservices (Payment, Inventory, Shipping) without distributed 2PC locks, using a sequence of local transactions and compensating actions on failure.',
        'To convert JavaScript code to Python.',
        'To manage employee payroll.'
      ],
      correctAnswer: 1,
      explanation: 'In microservice architectures, distributed 2PC locks degrade throughput and availability. A Saga coordinates steps via choreographed events or an orchestrator (e.g. AWS Step Functions); if payment fails, compensating transactions undo inventory reservations.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m6',
      q: 'How does Amazon CloudFront CDN improve global user experience while reducing origin load?',
      options: [
        'By hosting backend database servers in users\' homes.',
        'By caching static and dynamic web content at hundreds of global Edge Points of Presence (PoPs), terminating TLS connections close to users and routing cache misses over AWS backbone fiber.',
        'By disabling HTTPS encryption.',
        'By limiting video resolutions to 480p.'
      ],
      correctAnswer: 1,
      explanation: 'CloudFront caches content at edge locations worldwide. Edge termination minimizes round-trip latency for TCP/TLS handshakes, and requests missing edge caches travel across optimized AWS private fiber back to origin servers.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m7',
      q: 'What is the "Exponential Backoff with Jitter" algorithm, and why is Jitter essential for AWS SDK client retries?',
      options: [
        'Jitter encrypts retry tokens with AES-256.',
        'Adding random jitter prevents "thundering herd" retry stampedes where thousands of failed clients retry simultaneously at identical synchronized intervals, crashing the recovering service.',
        'Jitter speeds up DNS lookups.',
        'Backoff without jitter is illegal in cloud environments.'
      ],
      correctAnswer: 1,
      explanation: 'Without jitter, all clients encountering an outage retry at exact intervals (e.g. 1s, 2s, 4s), creating repeating traffic spikes that knock down recovering services. Randomizing retry delays (full jitter) spreads out load smoothly.',
      difficulty: 'Medium'
    },
    {
      id: 'amzn-m8',
      q: 'In AWS Aurora distributed storage, how is high durability and write performance achieved across Availability Zones?',
      options: [
        'By storing data on single local SSDs with daily backups.',
        'Storage is decoupled from compute into a 6-way replicated log-structured storage fleet across 3 AZs; Aurora writes only redo log records (no dirty pages) and requires 4 of 6 quorum acknowledgments for writes.',
        'By writing all data to magnetic tape drives.',
        'By compressing all database tables with zip.'
      ],
      correctAnswer: 1,
      explanation: 'Aurora decouples storage from compute: storage is organized in 10GB protection groups replicated 6 ways across 3 AZs. By logging only redo records and using a 4/6 write quorum and 3/6 read quorum, it handles AZ failure without write stoppage.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'amzn-h1',
      q: 'Scale: During massive shopping traffic events (like Prime Day), how does Amazon DynamoDB balance read availability and latency?',
      options: [
        'By enforcing heavy two-phase commit (2PC) locks across all global replicas on every read.',
        'By providing Eventually Consistent reads by default (halving RCU cost and latency) while supporting Strongly Consistent reads and ACID transactions when requested.',
        'By storing all shopping cart changes only in browser cookies.',
        'By rejecting write requests once database CPU crosses 50%.'
      ],
      correctAnswer: 1,
      explanation: 'DynamoDB partitions data across multi-AZ storage nodes using consistent hashing and Paxos consensus. By default, reads are Eventually Consistent (costing 0.5 Read Capacity Units), optimizing for maximum availability and single-digit millisecond latency.',
      difficulty: 'Hard'
    },
    {
      id: 'amzn-h2',
      q: 'Architecture: In high-concurrency flash sales, how can systems prevent stock overselling without bottlenecking database row-level pessimistic locks?',
      options: [
        'By running unindexed SQL updates with no transaction boundaries.',
        'By using Optimistic Concurrency Control (conditional writes) and pre-allocating inventory buckets in an in-memory cache (Redis) with atomic DECR operations, queuing orders for async persistence.',
        'By processing purchases manually via email.',
        'By allowing negative inventory counts.'
      ],
      correctAnswer: 1,
      explanation: 'Pessimistic row locks cause connection exhaustion during flash sales. High-performance systems decouple validation via in-memory Redis atomic Lua scripts (DECR stock >= 1) or conditional updates in DynamoDB, queuing verified orders for async persistence.',
      difficulty: 'Hard'
    },
    {
      id: 'amzn-h3',
      q: 'Consistent Hashing: In Amazon\'s seminal 2007 Dynamo paper, how does the system handle node additions/removals without rehashing all keys, and what problem do Virtual Nodes solve?',
      options: [
        'By using modular arithmetic (hash mod N) which moves 100% of keys.',
        'Keys and nodes map to a circular 128-bit ring where keys assign to the first clockwise node; Virtual Nodes (replicas) distribute each physical server across multiple ring points to ensure uniform load distribution.',
        'By keeping all keys on a central master server.',
        'Virtual nodes prevent network cables from overheating.'
      ],
      correctAnswer: 1,
      explanation: 'Consistent hashing bounds key migration to K/N keys when nodes join/leave. Virtual nodes allocate multiple tokens per physical machine, preventing "hot spots" caused by non-uniform hash ring spacing and heterogeneous server capacities.',
      difficulty: 'Hard'
    },
    {
      id: 'amzn-h4',
      q: 'Conflict Resolution: In Dynamo-style leaderless replication with Sloppy Quorums and Vector Clocks, how are concurrent divergent updates reconciled?',
      options: [
        'The server with the highest IP address deletes the other update.',
        'Vector clocks track causal history across replicas; when updates are concurrent (neither dominates), the divergence is preserved and returned as siblings for application-level resolution (or Last-Write-Wins).',
        'Replicas reboot themselves to clear conflict state.',
        'The database prompts the end user with a popup dialog.'
      ],
      correctAnswer: 1,
      explanation: 'Dynamo permits concurrent writes during network partitions. Vector clocks detect concurrent updates. If clock branches diverge, Dynamo saves both versions as siblings. The shopping cart service reconciles them (e.g. unioning items) on the next read.',
      difficulty: 'Hard'
    },
    {
      id: 'amzn-h5',
      q: 'Distributed Storage: In AWS S3\'s internal architecture, what storage optimization ensures high durability while reducing physical raw storage overhead compared to 3x replication?',
      options: [
        'Deleting files older than 7 days.',
        'Erasure Coding (e.g. Reed-Solomon 8+4 or 12+4): splitting objects into data and parity chunks distributed across distinct failure domains, tolerating multiple storage drive/rack losses with only ~1.3-1.5x storage overhead.',
        'Storing files as compressed text screenshots.',
        'Running all storage in single-datacenter memory chips.'
      ],
      correctAnswer: 1,
      explanation: 'Simple 3x replication incurs 200% storage overhead (3x footprint). Erasure coding divides data into K data chunks and M parity chunks. Any K of the K+M chunks can reconstruct the original object, delivering 11 9s durability at only ~33-50% overhead.',
      difficulty: 'Hard'
    },
    {
      id: 'amzn-h6',
      q: 'Multi-Region High Availability: What is the difference between AWS Route 53 Geolocation Routing and Geoproximity Routing with Traffic Flow?',
      options: [
        'Geolocation routing routes based on the geographic location of the DNS query; Geoproximity routing routes traffic based on the physical distance between user and resources and lets you adjust traffic share via bias sliders.',
        'Geolocation is for IPv4; Geoproximity is for IPv6.',
        'Geoproximity routes only to on-premises servers.',
        'Route 53 does not support DNS routing.'
      ],
      correctAnswer: 0,
      explanation: 'Geolocation maps queries to endpoints by continent/country/state. Geoproximity routes traffic to the nearest AWS region/endpoint based on physical distance, and enables shifting traffic between regions using "bias" values for maintenance or regional failover.',
      difficulty: 'Hard'
    }
  ],

  'Meta Prep': [
    // 6 Easy
    {
      id: 'meta-e1',
      q: 'What is the Virtual DOM in React, and what purpose does it serve?',
      options: [
        'A physical computer monitor attached to the server.',
        'An in-memory lightweight JavaScript representation of the real DOM tree used to compute minimal diffs and batch updates to the real browser DOM.',
        'A browser extension for debugging CSS styles.',
        'A database table storing user profile pictures.'
      ],
      correctAnswer: 1,
      explanation: 'Direct DOM manipulation is slow. React creates a Virtual DOM tree in memory, diffs it with the previous snapshot (reconciliation), and applies the minimal set of batched mutations to the browser DOM.',
      difficulty: 'Easy'
    },
    {
      id: 'meta-e2',
      q: 'What query language for APIs was created by Facebook/Meta in 2012 and open-sourced in 2015?',
      options: ['GraphQL', 'SQL', 'SPARQL', 'Cypher'],
      correctAnswer: 0,
      explanation: 'Meta developed GraphQL to solve mobile data-fetching challenges (over-fetching and under-fetching), allowing clients to request exactly the data fields they need in a single round-trip.',
      difficulty: 'Easy'
    },
    {
      id: 'meta-e3',
      q: 'What is the purpose of the useEffect hook in React functional components?',
      options: [
        'To compile TypeScript code to JavaScript.',
        'To perform side effects (such as data fetching, subscriptions, and manual DOM mutations) after rendering.',
        'To define CSS animations.',
        'To restart the web browser when errors occur.'
      ],
      correctAnswer: 1,
      explanation: 'useEffect handles component lifecycles in functional components (mounting, updating, unmounting). It executes after render and can return a cleanup function to cancel subscriptions or timers.',
      difficulty: 'Easy'
    },
    {
      id: 'meta-e4',
      q: 'What is "Prop Drilling" in React applications, and how is it commonly avoided?',
      options: [
        'Drilling holes into hardware server chassis.',
        'Passing data through intermediate components that do not need it just to reach deeply nested children; resolved using React Context or global state management.',
        'An optimization technique for CSS styles.',
        'A bug in JavaScript garbage collection.'
      ],
      correctAnswer: 1,
      explanation: 'Prop drilling occurs when props must be manually threaded down multiple layers of components. Solutions include React Context, state libraries (Redux, Zustand), or component composition.',
      difficulty: 'Easy'
    },
    {
      id: 'meta-e5',
      q: 'What open-source mobile development framework created by Meta enables building iOS and Android apps using React and JavaScript?',
      options: ['React Native', 'Flutter', 'SwiftUI', 'Cordova'],
      correctAnswer: 0,
      explanation: 'React Native lets developers build native mobile applications using React component architecture, rendering native platform UI widgets instead of running inside a Webview.',
      difficulty: 'Easy'
    },
    {
      id: 'meta-e6',
      q: 'What is the function of PyTorch, originally developed by Meta AI Research (FAIR)?',
      options: [
        'A web browser engine.',
        'An open-source machine learning framework providing tensor computing with GPU acceleration and dynamic computation graphs (Autograd).',
        'A tool for managing MySQL migrations.',
        'A video editing desktop application.'
      ],
      correctAnswer: 1,
      explanation: 'PyTorch is one of the world\'s leading deep learning frameworks, prized for its dynamic eager-mode execution graph, intuitive Python interface, and broad adoption in cutting-edge AI research and LLMs.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'meta-m1',
      q: 'Data Fetching: In GraphQL architectures, what is the N+1 problem and how does Meta\'s DataLoader pattern resolve it?',
      options: [
        'A math error in the GraphQL AST parser.',
        'Resolvers firing separate SQL queries for each child record (1 query for parents + N queries for children); DataLoader batches IDs requested in a single event-loop tick into one single query (WHERE id IN (...)) with caching.',
        'N+1 refers to creating N additional web servers per login.',
        'It requires downloading the entire database schema to the browser.'
      ],
      correctAnswer: 1,
      explanation: 'When fetching posts and authors, naive resolvers fetch posts (1 query) and each author individually (N queries). DataLoader queues requests within a tick and executes one batched query (SELECT * FROM authors WHERE id IN (...)).',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m2',
      q: 'State Management: What is the fundamental difference between React\'s useMemo and useCallback hooks?',
      options: [
        'useMemo is for CSS; useCallback is for HTML.',
        'useMemo memoizes the computed result value of an expensive calculation; useCallback memoizes the callback function instance itself across re-renders.',
        'useCallback can only be called inside loops.',
        'useMemo runs asynchronously on a Web Worker.'
      ],
      correctAnswer: 1,
      explanation: 'useMemo caches the result of invoking a function (returning the cached value unless dependencies change). useCallback caches the function definition itself, preventing child components wrapped in React.memo from re-rendering.',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m3',
      q: 'Social Graph: In Meta\'s TAO (The Associations and Objects) distributed database, how is the social graph represented?',
      options: [
        'As serialized CSV text files on Amazon S3.',
        'As Objects (nodes: users, posts, comments with typed IDs) and Associations (directed edges: friend, liked, authored with 32-bit edge types and timestamps), cached in a massive distributed graph cache.',
        'As a single monolithic PostgreSQL database table.',
        'As a relational schema requiring 20-table SQL joins.'
      ],
      correctAnswer: 1,
      explanation: 'TAO models Facebook\'s social graph as Objects (nodes typed with IDs) and Associations (directed edges between nodes with edge types and timestamps). TAO sits as a geographically distributed write-through caching layer on top of MySQL shards.',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m4',
      q: 'Storage: Why did Meta create RocksDB (forked from Google\'s LevelDB) and deploy it widely across backend services?',
      options: [
        'To replace React in frontend web browsers.',
        'To optimize an embedded Log-Structured Merge (LSM) key-value engine specifically for fast multi-core CPUs and fast flash storage (SSDs), supporting high write throughput and low read amplification.',
        'To provide automated audio mixing for podcasts.',
        'To run SQL queries directly on GPU cores.'
      ],
      correctAnswer: 1,
      explanation: 'RocksDB optimized LevelDB for fast server environments: exploiting multi-core processors, multi-threaded compactions, fast SSD NVMe drives, and prefix Bloom filters, becoming the storage engine for MySQL (MyRocks), Kafka, and Ceph.',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m5',
      q: 'Feed Architecture: How does Meta\'s News Feed handle fan-out for regular users vs celebrities (users with tens of millions of followers)?',
      options: [
        'By sending an email to every follower immediately.',
        'Hybrid fan-out: Fan-out-on-write (pushing to follower feed inboxes) for standard users, and Fan-out-on-read (pulling from the celebrity timeline upon feed load) for high-follower accounts to avoid write explosions.',
        'By banning users with more than 1,000 followers.',
        'Celebrities do not appear in News Feed.'
      ],
      correctAnswer: 1,
      explanation: 'If a celebrity with 50M followers posts, fan-out-on-write requires 50M immediate writes, causing massive latency spikes. Modern feed architectures use hybrid fan-out: fan-out-on-write for regular users, and fan-out-on-read for celebrity accounts.',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m6',
      q: 'Frontend Performance: What is "Code Splitting" and how do React.lazy and dynamic import() enhance initial page load times?',
      options: [
        'Splitting JavaScript files across two hard drive disks.',
        'Splitting the application bundle into smaller chunks loaded on demand when a route or component is requested, drastically reducing the initial JavaScript payload the browser must download and parse.',
        'Splitting variables between CSS and HTML files.',
        'Compressing JavaScript source code into zip archives.'
      ],
      correctAnswer: 1,
      explanation: 'Monolithic single-page bundles delay First Contentful Paint. React.lazy and dynamic import() allow bundlers (Webpack/Vite) to split code into separate chunks, downloading only the JavaScript required for the currently viewed route.',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m7',
      q: 'Optimistic UI: How does an Optimistic Update improve perceived responsiveness in user actions (such as "Liking" an Instagram post)?',
      options: [
        'By keeping the user\'s screen brightness high.',
        'Immediately updating the client UI to reflect success before receiving server confirmation, and rolling back state with an error toast if the backend API call fails.',
        'By disabling internet checks on the phone.',
        'By delaying the action by 5 seconds.'
      ],
      correctAnswer: 1,
      explanation: 'Waiting for round-trip network confirmation creates perceived lag. Optimistic UI updates the heart icon and counter instantaneously. If the API request succeeds, state stays synchronized; if it fails, the UI rolls back gracefully.',
      difficulty: 'Medium'
    },
    {
      id: 'meta-m8',
      q: 'Live Video: In Facebook Live video broadcasting, what low-latency streaming protocol architecture is used between broadcaster and viewers?',
      options: [
        'FTP file downloads.',
        'RTMP or WebRTC ingest from the broadcaster, segmented into Low-Latency HLS (LL-HLS) or MPEG-DASH chunks distributed across edge caching networks.',
        'Sending individual JPEG images via SMTP email.',
        'Single TCP socket connection between broadcaster phone and each viewer.'
      ],
      correctAnswer: 1,
      explanation: 'Broadcasters ingest video via RTMP/WebRTC into real-time transcoding clusters. The video is transcoded into multiple bitrates and packaged into sub-second chunked LL-HLS or DASH segments, cached and served via global CDN edges.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'meta-h1',
      q: 'Frontend: What critical performance limitation of React\'s legacy Stack Reconciler did the React Fiber rewrite resolve?',
      options: [
        'It allowed React apps to run without any JavaScript engine.',
        'It replaced synchronous, un-interruptible recursive tree traversals with an incremental work loop that yields control back to the browser to maintain 60 FPS responsiveness.',
        'It automatically converted all CSS files into WebAssembly.',
        'It replaced DOM elements with Canvas drawing calls.'
      ],
      correctAnswer: 1,
      explanation: 'The legacy Stack Reconciler executed rendering synchronously and recursively until the entire component tree was traversed. On heavy updates, this monopolized the browser main thread and caused dropped frames. Fiber restructured the tree into a linked list of fiber nodes, enabling cooperative multitasking: yielding work, prioritizing user inputs, and pausing work.',
      difficulty: 'Hard'
    },
    {
      id: 'meta-h2',
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
      id: 'meta-h3',
      q: 'Distributed Cache: In Meta\'s large-scale Memcached infrastructure, what problem does the "Lease" mechanism solve?',
      options: [
        'It automates server hardware leasing from cloud vendors.',
        'It mitigates "Cache Stampedes" (thundering herds on cache misses) and prevents stale sets caused by out-of-order writes.',
        'It encrypts cached data with public/private keys on every GET request.',
        'It restricts cache access to users with verified badges.'
      ],
      correctAnswer: 1,
      explanation: 'When a cache miss occurs, Memcached grants the client a 64-bit lease token. Only that client is permitted to query the database and write the value back, preventing thousands of concurrent queries from stampeding the DB simultaneously. If an invalidation occurs before the write-back, the lease is invalidated, preventing stale overwrites.',
      difficulty: 'Hard'
    },
    {
      id: 'meta-h4',
      q: 'Concurrency: What is the purpose of React 18\'s Concurrent Features and the useTransition hook?',
      options: [
        'To run JavaScript on multiple CPU threads in Node.js.',
        'To distinguish between urgent updates (like typing in an input or clicking) and non-urgent transitions (like filtering a list), allowing React to interrupt non-urgent renders to keep the UI interactive.',
        'To animate page transitions using WebGL shaders.',
        'To transition components from class components to functional components automatically.'
      ],
      correctAnswer: 1,
      explanation: 'Concurrent React can pause and resume rendering. useTransition marks state updates as non-urgent transitions. If a user types while an expensive filtered list is re-rendering, React yields to handle the keystroke immediately, preventing UI freezing.',
      difficulty: 'Hard'
    },
    {
      id: 'meta-h5',
      q: 'Live Comments: In designing an Instagram Live comments architecture receiving 100,000 comments per second, how do systems protect viewers\' devices from browser crashes?',
      options: [
        'By dropping the video feed and showing only comments.',
        'Rate-limiting and sampling/filtering comments via a sliding-window message queue at the edge, aggregating comments into batched pushes, and having clients render only a capped visible viewport.',
        'By writing every single comment to disk synchronously in MySQL before broadcast.',
        'By showing comments only after the live stream ends.'
      ],
      correctAnswer: 1,
      explanation: 'Delivering 100k events/sec directly to mobile devices causes DOM thrashing and CPU thermal throttling. Server-side aggregators sample and rank high-affinity comments, batching them into 500ms intervals. Mobile clients use virtualized lists rendering at most 10-20 active items.',
      difficulty: 'Hard'
    },
    {
      id: 'meta-h6',
      q: 'Feed Ranking: How does Meta\'s multi-stage recommendation architecture balance candidate retrieval latency and heavy ML ranking models?',
      options: [
        'By running a 100-billion parameter transformer model on all 10 billion historical posts for every user request.',
        'A multi-stage funnel: 1. Candidate Retrieval (filtering billions down to ~1,000 items via lightweight embeddings/Two-Tower models); 2. Heavy Ranking (scoring ~1,000 items via deep neural ranking models); 3. Integrity & Diversity filtering.',
        'By sorting posts alphabetically by author username.',
        'By picking 10 completely random posts from the database.'
      ],
      correctAnswer: 1,
      explanation: 'Running complex ranking models on billions of posts is computationally impossible within 100ms. Retrieval funnels use fast Two-Tower ANN vector search to select ~1,000 candidates, pass them to heavy Deep Learning models for fine-grained ranking, and apply policy/diversity business rules.',
      difficulty: 'Hard'
    }
  ]
};
