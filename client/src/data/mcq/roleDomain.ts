import { MCQPracticeQuestion } from '@/types';

export const roleDomainQuestions: Record<string, MCQPracticeQuestion[]> = {
  'Machine Learning & AI': [
    // 6 Easy
    {
      id: 'ml-e1',
      q: 'What is the key difference between Supervised and Unsupervised learning?',
      options: [
        'Supervised uses labeled training examples with target ground truth; Unsupervised discovers inherent patterns or clusters in unlabeled data.',
        'Supervised runs on CPUs; Unsupervised runs only on GPUs.',
        'Supervised learning does not require loss functions.',
        'Unsupervised learning can only be used for image data.'
      ],
      correctAnswer: 0,
      explanation: 'Supervised learning trains on inputs paired with target labels (regression/classification). Unsupervised learning identifies latent structures, clusters, or dimensionality reductions in unlabeled data without explicit targets.',
      difficulty: 'Easy'
    },
    {
      id: 'ml-e2',
      q: 'What is Overfitting in machine learning models?',
      options: [
        'The model performs poorly on both training and test data.',
        'The model learns noise and specific details of the training dataset too closely, resulting in high training accuracy but poor generalization to unseen test data.',
        'The model trains faster than expected.',
        'The model runs out of GPU VRAM memory.'
      ],
      correctAnswer: 1,
      explanation: 'Overfitting occurs when a model fits the training data too tightly (high variance, low bias), capturing random noise rather than true underlying relationships and degrading generalization on test sets.',
      difficulty: 'Easy'
    },
    {
      id: 'ml-e3',
      q: 'In highly imbalanced classification problems (e.g. fraud detection where fraud represents 0.1% of transactions), why is standard Accuracy misleading?',
      options: [
        'Accuracy cannot be calculated on floating-point numbers.',
        'A naive baseline model predicting "Not Fraud" 100% of the time achieves 99.9% accuracy while detecting 0 fraud cases; metrics like Precision, Recall, and PR-AUC must be used.',
        'Accuracy is only valid for multi-class problems.',
        'Accuracy is disabled when using neural networks.'
      ],
      correctAnswer: 1,
      explanation: 'On heavily skewed datasets, trivial majority-class classifiers achieve deceptive near-100% accuracy. Precision, Recall, F1-Score, and Precision-Recall curves correctly reveal performance on the rare positive class.',
      difficulty: 'Easy'
    },
    {
      id: 'ml-e4',
      q: 'What is the purpose of an Activation Function (e.g. ReLU, GELU) in a neural network?',
      options: [
        'To save weights to disk.',
        'To introduce non-linearity into the network, enabling it to learn complex non-linear decision boundaries instead of collapsing into a single linear transformation.',
        'To speed up network cable communication.',
        'To prevent memory leaks in Python.'
      ],
      correctAnswer: 1,
      explanation: 'Without non-linear activations, composing multiple dense layers W2(W1(x)) mathematically collapses into a single linear function W\'x. Non-linear activations allow networks to approximate arbitrary continuous functions.',
      difficulty: 'Easy'
    },
    {
      id: 'ml-e5',
      q: 'What is Gradient Descent in machine learning optimization?',
      options: [
        'A method for organizing files in folders.',
        'An iterative optimization algorithm that updates model parameters in the direction of the negative gradient of the loss function to minimize loss.',
        'An algorithm for generating random numbers.',
        'A technique for encrypting model weights.'
      ],
      correctAnswer: 1,
      explanation: 'Gradient descent computes the partial derivatives of the loss with respect to each model parameter (gradient) and takes steps proportional to the negative gradient scaled by the learning rate.',
      difficulty: 'Easy'
    },
    {
      id: 'ml-e6',
      q: 'What is a Vector Embedding in modern AI/LLM applications?',
      options: [
        'A vector graphic (SVG) stored on a web server.',
        'A dense numerical vector of floating-point numbers that captures the semantic meaning and contextual relationships of text, images, or audio in high-dimensional vector space.',
        'A hardware device connected via USB.',
        'A compiler flag for C++ code.'
      ],
      correctAnswer: 1,
      explanation: 'Embeddings map high-dimensional categorical or unstructured data (words, sentences, images) into a lower-dimensional continuous vector space where semantically similar items have small distances (e.g. cosine similarity).',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'ml-m1',
      q: 'Ensemble Learning: What is the fundamental bias-variance trade-off difference between Bagging (e.g. Random Forests) and Boosting (e.g. XGBoost)?',
      options: [
        'Bagging reduces variance by averaging independent high-variance learners trained in parallel; Boosting reduces bias by training weak learners sequentially on residual errors.',
        'Bagging only reduces bias, while Boosting only reduces variance.',
        'Bagging can only be used for classification; Boosting is exclusively for regression.',
        'Bagging trains models sequentially; Boosting trains models in parallel.'
      ],
      correctAnswer: 0,
      explanation: 'Bagging (Bootstrap Aggregation) trains deep, low-bias/high-variance trees on bootstrap sample subsets; averaging their outputs decreases variance. Boosting trains shallow, high-bias trees sequentially, where each tree fits the residuals/errors of prior trees, reducing bias.',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m2',
      q: 'Regularization: What is the difference between L1 (Lasso) and L2 (Ridge) weight regularization in linear and neural models?',
      options: [
        'L1 adds the sum of absolute weight values, driving unimportant feature coefficients to exactly zero (sparse feature selection); L2 adds the sum of squared weights, penalizing large weights and shrinking them continuously toward zero.',
        'L1 is for deep learning; L2 is for decision trees.',
        'L1 increases model parameters; L2 decreases model parameters.',
        'L1 cannot be used with gradient descent.'
      ],
      correctAnswer: 0,
      explanation: 'L1 penalizes sum(|w|), whose diamond-shaped constraint contour often intersects parameter axes at corners, yielding sparse weights (feature selection). L2 penalizes sum(w^2), with circular contours that shrink weights smoothly without zeroing them.',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m3',
      q: 'RAG Architecture: What are the three core steps in a Retrieval-Augmented Generation (RAG) system for LLMs?',
      options: [
        'Compile, Link, Execute.',
        '1. Ingestion/Indexing (chunking and embedding documents into a vector database); 2. Retrieval (finding top-K relevant chunks via vector similarity); 3. Generation (prompting LLM with retrieved context).',
        'Train, Test, Validate.',
        'Encrypt, Transmit, Decrypt.'
      ],
      correctAnswer: 1,
      explanation: 'RAG overcomes LLM hallucination and knowledge cutoff by retrieving real-time domain documents from a vector store based on the query embedding and injecting those chunks into the LLM\'s context prompt for grounded generation.',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m4',
      q: 'Optimization: Why is Adam (Adaptive Moment Estimation) optimizer widely used over basic Stochastic Gradient Descent (SGD)?',
      options: [
        'Adam requires no learning rate parameter.',
        'Adam combines momentum (tracking exponentially decaying moving averages of past gradients) and RMSProp (scaling updates inversely by root mean square of past gradients), adapting learning rates per parameter.',
        'Adam runs entirely on the CPU without GPU support.',
        'Adam guarantees zero loss on all training datasets.'
      ],
      correctAnswer: 1,
      explanation: 'Adam tracks both the first moment (mean of past gradients, providing inertia through ravines) and second moment (uncentered variance of past gradients, dampening updates for frequently updated parameters), stabilizing training on complex loss surfaces.',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m5',
      q: 'Evaluation: In a binary classification test, what does Precision measure vs Recall?',
      options: [
        'Precision measures training speed; Recall measures memory usage.',
        'Precision is TP / (TP + FP) (of all predicted positives, how many were truly positive); Recall is TP / (TP + FN) (of all actual positives, how many did the model correctly identify).',
        'Precision applies to positive cases; Recall applies to negative cases.',
        'Precision is always greater than Recall.'
      ],
      correctAnswer: 1,
      explanation: 'Precision measures exactness (minimizing false positives, critical in spam detection). Recall measures completeness (minimizing false negatives, critical in medical diagnostics or fraud detection).',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m6',
      q: 'Data Leakage: What is data leakage during feature engineering and model validation, and how is it prevented?',
      options: [
        'A hacker stealing the model weights from the server.',
        'Information from the test or target dataset inadvertently leaking into the training pipeline (e.g. fitting a StandardScaler on the entire dataset before splitting), causing artificially high validation scores that fail in production.',
        'A memory leak in the Python garbage collector.',
        'Using more than 100 features in a model.'
      ],
      correctAnswer: 1,
      explanation: 'Data leakage happens when future or test information contaminates training. It is prevented by splitting data strictly into train/test sets before any normalization, imputing, or target-dependent feature transformations are fitted.',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m7',
      q: 'Vector Search: In Approximate Nearest Neighbor (ANN) search for vector databases, how does Hierarchical Navigable Small World (HNSW) balance search speed and recall?',
      options: [
        'By scanning every vector sequentially in linear O(N) time.',
        'By constructing a multi-layer graph where upper layers have long-range links for fast greedy skip-traversal and bottom layers have dense local links for fine-grained nearest neighbor resolution.',
        'By rounding all floating-point numbers to integers.',
        'By sorting vectors by file size.'
      ],
      correctAnswer: 1,
      explanation: 'HNSW is inspired by skip lists. Upper sparse layers allow logarithmic greedy routing across large vector spaces, and descending through denser layers refines the search to the true nearest neighbors with sub-linear logarithmic complexity.',
      difficulty: 'Medium'
    },
    {
      id: 'ml-m8',
      q: 'LLM Quantization: How do quantization techniques like INT8 / INT4 (e.g. AWQ, GPTQ) allow running large models on consumer GPUs?',
      options: [
        'By deleting half of the layers in the neural network.',
        'By converting high-precision 16-bit floating point weights (FP16/BF16) into low-precision 8-bit or 4-bit integers with scaling factors, drastically reducing VRAM footprint and memory bandwidth bottlenecks with minimal perplexity loss.',
        'By running models in the cloud rather than on local hardware.',
        'By converting transformer models into linear regression models.'
      ],
      correctAnswer: 1,
      explanation: 'LLM inference is memory-bandwidth bound. Quantizing weights from FP16 (2 bytes) to INT4 (0.5 bytes) slashes memory consumption by ~75%, allowing a 70B parameter model to fit in ~35GB VRAM instead of 140GB with negligible accuracy loss.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'ml-h1',
      q: 'Transformers: In standard Multi-Head Self-Attention (as in original Transformer architectures), what is the computational and memory complexity with respect to input sequence length N?',
      options: [
        'O(N) linear complexity in both time and memory.',
        'O(N^2) quadratic complexity because every token computes attention weights against every other token in the sequence.',
        'O(log N) logarithmic complexity via binary search index trees.',
        'O(N!) factorial complexity.'
      ],
      correctAnswer: 1,
      explanation: 'The attention score matrix Q * K^T produces an N x N matrix for sequence length N. Storing and applying Softmax across this matrix requires O(N^2) memory and compute, motivating innovations like FlashAttention and linear attention.',
      difficulty: 'Hard'
    },
    {
      id: 'ml-h2',
      q: 'Deep Learning: Why does the Vanishing Gradient problem occur during backpropagation in deep networks using Sigmoid/Tanh activations, and how do ResNets solve it?',
      options: [
        'Loss functions output negative numbers that crash matrix multiplication.',
        'Repeated chain-rule multiplication of derivatives less than 1 causes early layer gradients to decay exponentially toward zero; ResNets add identity skip connections [F(x) + x] ensuring gradient signals propagate directly backward.',
        'Learning rates drop to zero automatically after epoch 1 in deep models.',
        'Weights in dense layers overflow 64-bit floating point precision.'
      ],
      correctAnswer: 1,
      explanation: 'Sigmoid derivatives peak at 0.25. Multiplying these through dozens of layers via chain rule causes gradients to vanish exponentially. ResNet introduces skip connections: Output = F(x) + x. The derivative contains "+ 1", allowing gradient flow unaltered back to early layers.',
      difficulty: 'Hard'
    },
    {
      id: 'ml-h3',
      q: 'Attention Optimization: How does FlashAttention (Dao et al.) achieve significant speedups and memory reductions during Transformer attention without altering numerical outputs?',
      options: [
        'By dropping random tokens from the attention matrix.',
        'By tiling the attention computation into SRAM blocks and computing Softmax incrementally using online softmax normalization, avoiding reading/writing the large N x N attention matrix to slow GPU High Bandwidth Memory (HBM).',
        'By switching from CUDA to JavaScript.',
        'By replacing matrix multiplication with additions.'
      ],
      correctAnswer: 1,
      explanation: 'Standard attention writes the large N x N intermediate matrix to slow GPU HBM and reads it back multiple times. FlashAttention tiles queries/keys into fast on-chip SRAM and applies the online softmax trick, making attention IO-aware with zero approximation error.',
      difficulty: 'Hard'
    },
    {
      id: 'ml-h4',
      q: 'Alignment: In Reinforcement Learning from Human Feedback (RLHF), what role does the Reference Model / KL-Divergence penalty play during PPO training?',
      options: [
        'It prevents the model from generating text in non-English languages.',
        'It penalizes the policy model if its token probability distribution drifts too far from the initial un-finetuned supervised reference model, preventing reward hacking and policy collapse.',
        'It accelerates GPU clock speed.',
        'It encrypts the reward model weights.'
      ],
      correctAnswer: 1,
      explanation: 'Without a KL penalty, the policy will exploit quirks in the learned reward model ("reward hacking"), producing ungrammatical or repetitive text that scores high reward. The KL penalty ensures outputs remain close to the natural distribution of the base supervised policy.',
      difficulty: 'Hard'
    },
    {
      id: 'ml-h5',
      q: 'Positional Encoding: Why is Rotary Position Embedding (RoPE) widely adopted in modern foundation LLMs (such as LLaMA) over static sinusoidal embeddings?',
      options: [
        'RoPE converts tokens to binary integers.',
        'RoPE applies a rotation matrix to Query and Key vectors in 2D chunks, naturally decaying attention with relative token distance and demonstrating superior length extrapolation to longer context windows.',
        'RoPE eliminates the need for Key and Value matrices in attention.',
        'RoPE works only on single-token prompts.'
      ],
      correctAnswer: 1,
      explanation: 'RoPE encodes relative position by rotating Q and K representations in the complex plane. The dot product (R_m Q)^T (R_n K) depends only on relative offset m - n, providing smooth relative positional information and enabling context window expansion.',
      difficulty: 'Hard'
    },
    {
      id: 'ml-h6',
      q: 'Parameter-Efficient Fine-Tuning (PEFT): How does Low-Rank Adaptation (LoRA) enable fine-tuning 70B parameter models using a fraction of GPU VRAM?',
      options: [
        'By training only on 1% of the training dataset.',
        'By freezing base model weights W_0 and decomposing weight updates into two low-rank matrices: delta_W = B * A (where rank r << d), updating only the low-rank adapters and reducing trainable parameters by over 99%.',
        'By running training on mobile phone processors.',
        'By replacing all linear layers with convolutional layers.'
      ],
      correctAnswer: 1,
      explanation: 'Full fine-tuning requires updating and saving optimizer states for all parameters (consuming massive VRAM). LoRA freezes the original weights and injects low-rank decomposition matrices (d x r and r x k, where r is e.g. 8 or 16), reducing trainable parameters and optimizer memory drastically.',
      difficulty: 'Hard'
    }
  ],

  'DevOps & SRE': [
    // 6 Easy
    {
      id: 'devops-e1',
      q: 'What is the primary difference between a Container (e.g. Docker) and a Virtual Machine (VM)?',
      options: [
        'Containers virtualize hardware and run a full guest operating system; VMs share the host kernel.',
        'Containers share the host operating system kernel and isolate user space using Linux cgroups and namespaces, making them lightweight and fast to start; VMs run a full guest OS on hypervisor-virtualized hardware.',
        'Containers can only run on Linux; VMs run only on Windows.',
        'VMs do not require disk space.'
      ],
      correctAnswer: 1,
      explanation: 'VMs emulate virtual hardware via a hypervisor and execute complete guest operating systems with heavy overhead. Containers share the host kernel and use namespaces (for isolation) and cgroups (for resource limits), starting in milliseconds.',
      difficulty: 'Easy'
    },
    {
      id: 'devops-e2',
      q: 'What does CI/CD stand for in modern DevOps workflows?',
      options: [
        'Computer Interface / Cloud Deployment',
        'Continuous Integration / Continuous Delivery (or Deployment)',
        'Central Infrastructure / Container Distribution',
        'Code Inspection / Compiler Debugging'
      ],
      correctAnswer: 1,
      explanation: 'Continuous Integration (CI) automatically builds, tests, and merges code changes into a shared repository. Continuous Delivery/Deployment (CD) automatically stages and deploys validated builds to production environments.',
      difficulty: 'Easy'
    },
    {
      id: 'devops-e3',
      q: 'What is the smallest deployable computing unit in Kubernetes?',
      options: ['Cluster', 'Node', 'Pod', 'Service'],
      correctAnswer: 2,
      explanation: 'A Pod represents a single instance of a running process in a cluster. It encapsulates one or more containers that share network IP, storage volumes, and namespace specifications.',
      difficulty: 'Easy'
    },
    {
      id: 'devops-e4',
      q: 'Site Reliability Engineering (SRE): What is the relationship between SLA, SLO, and SLI?',
      options: [
        'They are accounting metrics for calculating server depreciation.',
        'SLI is the measured metric (e.g. latency), SLO is the internal reliability target (e.g. 99.9% under 200ms), and SLA is the contract with customers containing business penalties.',
        'SLA is measured in bits; SLO in bytes; SLI in gigabytes.',
        'They are Kubernetes configuration files.'
      ],
      correctAnswer: 1,
      explanation: 'SLI (Service Level Indicator) measures actual behavior. SLO (Service Level Objective) is the engineering target. SLA (Service Level Agreement) is the legal commitment with customer compensation if breached.',
      difficulty: 'Easy'
    },
    {
      id: 'devops-e5',
      q: 'What is Infrastructure as Code (IaC) and what tool is an industry standard for declarative multi-cloud IaC?',
      options: [
        'Writing bash scripts manually on production servers.',
        'Managing and provisioning cloud infrastructure through version-controlled, declarative configuration files; HashiCorp Terraform is an industry standard.',
        'A tool that writes documentation from code comments.',
        'A hardware diagnostic tool for data centers.'
      ],
      correctAnswer: 1,
      explanation: 'IaC treats infrastructure provisioning (VMs, networks, buckets) like software: defined in declarative configuration files (e.g. Terraform HCL), peer-reviewed in Git, and applied reproducibly across environments.',
      difficulty: 'Easy'
    },
    {
      id: 'devops-e6',
      q: 'What is the primary role of an Ingress Controller in Kubernetes?',
      options: [
        'To compile Docker images on worker nodes.',
        'To manage external HTTP/HTTPS access and routing into cluster Services, acting as a reverse proxy, SSL terminator, and layer-7 load balancer.',
        'To delete unused container logs from disk.',
        'To monitor CPU temperature in datacenters.'
      ],
      correctAnswer: 1,
      explanation: 'An Ingress Controller (e.g. NGINX, Traefik) evaluates Ingress resource rules to route external inbound HTTP/S requests to the appropriate internal backend Kubernetes Services based on hostnames and URL paths.',
      difficulty: 'Easy'
    },

    // 8 Medium
    {
      id: 'devops-m1',
      q: 'Resilience: What are the three states of the Circuit Breaker pattern, and what triggers the transition from "Open" to "Half-Open"?',
      options: [
        'Pending, Active, Completed; triggered by a manual deploy command.',
        'Closed (normal operations), Open (failing fast), and Half-Open (trial probe); transitioned from Open to Half-Open after a configured cooldown sleep window elapses.',
        'Read-Only, Write-Only, Full-Access; triggered when disk usage hits 90%.',
        'Alpha, Beta, Production; triggered when unit tests pass.'
      ],
      correctAnswer: 1,
      explanation: 'In "Closed", requests pass normally. If error rates exceed a threshold, it trips to "Open", failing fast without touching downstream services. After a cooldown timeout, it enters "Half-Open", sending a test probe. If successful, it closes; if not, it reopens.',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m2',
      q: 'Kubernetes: How does the Kubernetes Horizontal Pod Autoscaler (HPA) controller compute the target replica count?',
      options: [
        'It randomly doubles replicas whenever network traffic increases.',
        'Using the formula: desiredReplicas = ceil[ currentReplicas * ( currentMetricValue / targetMetricValue ) ] based on metrics from the metrics-server or Prometheus.',
        'By rebooting the worker node if pod CPU drops below 20%.',
        'By reading replica numbers written in Git commit messages.'
      ],
      correctAnswer: 1,
      explanation: 'The HPA control loop periodically queries metric values and calculates desiredReplicas = ceil[ currentReplicas * (currentMetricValue / targetMetricValue) ], enforcing min/max boundaries and stabilization windows.',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m3',
      q: 'Monitoring: What are the "Four Golden Signals" of service monitoring as defined in Google\'s SRE Handbook?',
      options: [
        'CPU, RAM, Disk, Network',
        'Latency, Traffic, Errors, and Saturation',
        'Commits, Pull Requests, Issues, Releases',
        'Cost, Revenue, Profit, Tax'
      ],
      correctAnswer: 1,
      explanation: 'The Four Golden Signals are: Latency (time to serve a request), Traffic (demand/throughput), Errors (rate of failing requests), and Saturation (how full service resources are, e.g. thread pools or memory).',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m4',
      q: 'Container Security: Why is running container processes as the "root" user (UID 0) considered a major security risk?',
      options: [
        'It prevents the container from opening port 80.',
        'If an attacker escapes the container via a kernel vulnerability, they possess unrestricted root privileges on the underlying host operating system.',
        'Root containers cannot run JavaScript applications.',
        'It causes Docker to charge higher licensing fees.'
      ],
      correctAnswer: 1,
      explanation: 'Containers share the host kernel. If a containerized process running as UID 0 achieves a container breakout (e.g. through a kernel exploit or misconfigured volume mount), the attacker immediately has root control over the host node.',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m5',
      q: 'Database Migrations: How does the "Expand and Contract" (Parallel Run) pattern enable zero-downtime database schema migrations?',
      options: [
        'By shutting down the website for 2 hours during maintenance.',
        'Phase 1 (Expand): Add new column/table without breaking old code; Phase 2: Deploy new app version writing to both old and new schemas; Phase 3 (Contract): Backfill historical data and drop old schema columns.',
        'By deleting foreign keys permanently.',
        'By storing database schemas in browser localStorage.'
      ],
      correctAnswer: 1,
      explanation: 'Direct destructive migrations (renaming/deleting columns) cause immediate errors in active running servers. Expand-Contract introduces changes incrementally in backwards-compatible steps, ensuring seamless zero-downtime rollouts.',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m6',
      q: 'Kubernetes Networking: What is the difference between a ClusterIP, NodePort, and LoadBalancer Service type in Kubernetes?',
      options: [
        'ClusterIP exposes the service internally within the cluster only; NodePort opens a static high port on all worker nodes; LoadBalancer provisions an external cloud load balancer (e.g. AWS ALB) pointing to the service.',
        'ClusterIP is for databases; NodePort is for web servers; LoadBalancer is for DNS.',
        'ClusterIP requires physical cables; NodePort runs over Wi-Fi.',
        'There is no difference; they are aliases for the same configuration.'
      ],
      correctAnswer: 0,
      explanation: 'ClusterIP is default and internal only. NodePort opens a designated port (30000-32767) on each node\'s IP. LoadBalancer integrates with cloud providers to automatically create a public cloud load balancer routing to NodePort/ClusterIP.',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m7',
      q: 'Log Management: In the centralized ELK / EFK logging stack, what are the roles of Fluentbit/Logstash, Elasticsearch/OpenSearch, and Kibana?',
      options: [
        'Logstash compiles code; Elasticsearch runs containers; Kibana hosts Git repositories.',
        'Fluentbit/Logstash collects and parses log streams from nodes; Elasticsearch/OpenSearch indexes and stores logs for full-text search; Kibana provides search visualization dashboards.',
        'They are Linux kernel modules.',
        'They are AWS billing tools.'
      ],
      correctAnswer: 1,
      explanation: 'In centralized logging: shippers (Fluentbit/Logstash) scrape and transform log lines from containers, passing them to an indexing cluster (Elasticsearch/OpenSearch), which exposes them via Kibana dashboards for search and alerting.',
      difficulty: 'Medium'
    },
    {
      id: 'devops-m8',
      q: 'Chaos Engineering: What is the primary purpose of Chaos Engineering (e.g. Chaos Monkey)?',
      options: [
        'To delete company databases as an employee prank.',
        'Proactively injecting controlled failures into production environments (killing instances, injecting network latency) to uncover systemic weaknesses before they cause user-facing outages.',
        'To test CPU overclocking limits in hardware labs.',
        'To randomize software deployment schedules.'
      ],
      correctAnswer: 1,
      explanation: 'Pioneered by Netflix, Chaos Engineering builds confidence in system resilience by testing whether automated failovers, auto-healing, and redundancies actually function as intended under live turbulent conditions.',
      difficulty: 'Medium'
    },

    // 6 Hard
    {
      id: 'devops-h1',
      q: 'Zero-Downtime Deployment: What is the architectural difference between Blue-Green deployments and Canary deployments?',
      options: [
        'Blue-Green runs on mobile; Canary runs only in desktop web browsers.',
        'Blue-Green maintains two identical environments and swaps 100% of traffic instantaneously at the router/load balancer; Canary routes a small percentage (e.g. 5%) of live traffic to the new version first to monitor health before broader rollout.',
        'Canary requires shutting down the cluster database; Blue-Green does not use a database.',
        'Blue-Green is an AWS exclusive feature; Canary is restricted to Linux Docker.'
      ],
      correctAnswer: 1,
      explanation: 'Blue-Green maintains two identical production environments; traffic is cut over all at once from Blue to Green. Canary releases deploy the new version alongside existing pods, directing a small fraction of live traffic while monitoring telemetry before progressive expansion.',
      difficulty: 'Hard'
    },
    {
      id: 'devops-h2',
      q: 'Linux Internals: What Linux kernel primitives underpin container isolation and resource restriction in Docker/containerd?',
      options: [
        'VirtualBox hypervisors and BIOS emulators.',
        'Namespaces (isolating PID, Mount, Net, IPC, UTS, User views) and Control Groups (cgroups, enforcing CPU, memory, and I/O quotas and accounting).',
        'Cron jobs and SSH keys.',
        'TCP sockets and iptables NAT only.'
      ],
      correctAnswer: 1,
      explanation: 'Linux Namespaces provide the illusion of dedicated system resources by partitioning global OS abstractions (a process in a PID namespace sees only its own process tree). Control Groups (cgroups) meter and enforce limits on physical CPU, memory, and disk I/O.',
      difficulty: 'Hard'
    },
    {
      id: 'devops-h3',
      q: 'Kubernetes Internals: How does the Kubernetes kube-scheduler decide which worker node should execute an unscheduled Pod?',
      options: [
        'By choosing the node with the lowest IP address.',
        'A two-phase cycle: 1. Filtering (Predicates: eliminating nodes that fail constraints like resource requests, taints/tolerations, affinity); 2. Scoring (Priorities: ranking feasible nodes to pick the optimal placement).',
        'By asking users via Slack notifications.',
        'By random coin flip.'
      ],
      correctAnswer: 1,
      explanation: 'The kube-scheduler watches for pods with empty nodeName. In Phase 1 (Filtering), it filters out nodes that cannot satisfy the pod requirements. In Phase 2 (Scoring), it scores surviving nodes based on spreading, image locality, and affinity rules, assigning the pod to the highest-scoring node.',
      difficulty: 'Hard'
    },
    {
      id: 'devops-h4',
      q: 'Observability: What is OpenTelemetry (OTel), and how does its Collector architecture unify metrics, logs, and traces?',
      options: [
        'A proprietary database owned by Oracle.',
        'A vendor-neutral, open-source telemetry framework providing standardized APIs, SDKs, and a processing Collector pipeline that ingests, processes, and exports traces, metrics, and logs to any backend.',
        'A tool for compiling C programs into WebAssembly.',
        'An encryption standard for Wi-Fi routers.'
      ],
      correctAnswer: 1,
      explanation: 'OpenTelemetry standardizes observability instrumentation. Applications use OTel SDKs to generate traces, metrics, and logs without vendor lock-in. The OTel Collector receives, filters, batches, and exports telemetry to Datadog, Prometheus, Jaeger, or CloudWatch.',
      difficulty: 'Hard'
    },
    {
      id: 'devops-h5',
      q: 'Service Mesh: How does a Service Mesh (like Istio or Linkerd) implement mutual TLS (mTLS) and traffic management without modifying application code?',
      options: [
        'By rewriting the Linux kernel on every deploy.',
        'By injecting a high-performance Sidecar Proxy (e.g. Envoy) alongside each application container, intercepting all inbound and outbound network traffic using iptables rules.',
        'By converting all HTTP requests into email messages.',
        'By running applications inside web browser tabs.'
      ],
      correctAnswer: 1,
      explanation: 'Istio injects an Envoy sidecar proxy into each application Pod. iptables rules redirect all socket traffic into the Envoy sidecar. Envoy handles mTLS encryption, certificate rotation, retries, rate limiting, and telemetry transparently without touching application source code.',
      difficulty: 'Hard'
    },
    {
      id: 'devops-h6',
      q: 'High Availability: In designing a multi-region active-active deployment for critical web services, what is the primary challenge regarding data consistency and write latency?',
      options: [
        'Color schemes displaying differently in different countries.',
        'The speed of light bounds cross-region network latency (~70-100ms round trips); synchronous cross-region consensus degrades write throughput, while asynchronous replication introduces replication lag and conflict resolution complexities.',
        'Kubernetes cannot run outside North America.',
        'SSL certificates can only be issued in a single time zone.'
      ],
      correctAnswer: 1,
      explanation: 'Speed-of-light propagation across transoceanic fiber creates unavoidable network round-trip latency. Synchronous multi-region consensus (e.g. multi-region Paxos) introduces 100ms+ write latency, while asynchronous replication requires CRDTs or deterministic conflict resolution (LWW) to resolve divergent writes.',
      difficulty: 'Hard'
    }
  ]
};
