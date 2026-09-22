import { ResearchItem } from "@/types/research";

export const MOCK_RESEARCHES: ResearchItem[] = [
  {
    id: 1,
    query: "Architectural differences and trade-offs between PostgreSQL with pgvector vs dedicated vector databases (Pinecone, Qdrant)",
    status: "completed",
    currentPhase: "completed",
    createdAt: "2026-09-21T14:32:00Z",
    updatedAt: "2026-09-21T14:34:12Z",
    steps: [
      {
        id: "step-1",
        phase: "planning",
        label: "Research Planning",
        description: "Decomposed query into vector indexing, performance scaling, operational overhead, and cost profiles.",
        status: "completed",
        timestamp: "14:32:05",
        details: [
          "Identified key evaluation dimensions: latency, recall, index building time, maintenance.",
          "Targeted official benchmarks and production engineering postmortems.",
        ],
      },
      {
        id: "step-2",
        phase: "researching",
        label: "Deep Web Research",
        description: "Queried benchmarks from pgvector v0.7+, Pinecone serverless, and Qdrant distributed architecture.",
        status: "completed",
        timestamp: "14:33:10",
        details: [
          "Retrieved HNSW vs IVFFlat benchmarks on 1M+ 1536-dim embeddings.",
          "Evaluated ACID transaction and hybrid relational+vector filtering capabilities.",
        ],
      },
      {
        id: "step-3",
        phase: "writing",
        label: "Synthesis & Report Generation",
        description: "Drafted structured report with comparison matrix, key tradeoffs, and decision tree.",
        status: "completed",
        timestamp: "14:34:12",
      },
    ],
    report: {
      id: 101,
      title: "Comparative Analysis: PostgreSQL (pgvector) vs. Dedicated Vector Databases",
      summary:
        "For teams already operating PostgreSQL, pgvector provides zero-data-movement simplicity, unified ACID transactions, and robust hybrid filtering for datasets up to ~5–10 million vectors. Dedicated solutions like Pinecone or Qdrant excel when billion-scale vectors, sub-10ms p99 latency guarantees, and specialized clustering algorithms take precedence over operational simplicity.",
      keyTakeaways: [
        "**Single Source of Truth**: pgvector eliminates cross-system sync between relational records and vector embeddings.",
        "**Hybrid Query Performance**: Joining vector search with relational metadata filters (e.g. `WHERE tenant_id = ? AND status = 'active'`) is orders of magnitude faster and cleaner in Postgres.",
        "**Memory & Scaling Wall**: pgvector HNSW indices require substantial RAM (`shared_buffers` / `maintenance_work_mem`). Above 10M vectors, dedicated vector engines optimize memory via aggressive quantization (PQ/SQ).",
        "**Operational Overhead**: Pinecone is fully managed/serverless; Qdrant offers hybrid cloud/self-hosted; pgvector leverages existing Postgres backups, replication, and telemetry.",
      ],
      content: `## Executive Overview

The rise of generative AI and Retrieval-Augmented Generation (RAG) pipelines has elevated vector indexing from a specialized capability into an infrastructure baseline. Engineering teams face a pivotal choice: **extend their primary relational database using PostgreSQL + pgvector**, or **adopt a purpose-built vector engine such as Pinecone, Qdrant, or Milvus**.

---

## 1. Architectural Paradigms

### PostgreSQL + pgvector
- **Engine Type**: Relational engine extended with SIMD-accelerated vector distance calculations (L2, Cosine, Inner Product, Hamming).
- **Index Algorithms**: HNSW (Hierarchical Navigable Small World) and IVFFlat (Inverted File Flat).
- **Storage Model**: Row-oriented tuple storage with Write-Ahead Logging (WAL).
- **Metadata Filtering**: Native SQL engine execution plan integration—filtering happens inside the database query planner, avoiding post-filtering or pre-filtering round-trips.

### Dedicated Vector Databases (Pinecone / Qdrant)
- **Engine Type**: Purpose-built columnar or graph-optimized storage designed specifically for high-dimensional floating-point vectors.
- **Index Algorithms**: Customized distributed HNSW, graph partitioning, scalar and product quantization.
- **Storage Model**: Vector-optimized memory structures with tiered SSD/disk caching.
- **Metadata Filtering**: Custom vector-graph traversal with boolean bitset filters applied concurrently during traversal.

---

## 2. Head-to-Head Comparison Matrix

| Feature / Metric | PostgreSQL (pgvector) | Dedicated (Pinecone / Qdrant) |
| :--- | :--- | :--- |
| **Operational Complexity** | Very Low (reuses existing Postgres cluster) | Medium (new infrastructure, auth, sync pipelines) |
| **ACID & Consistency** | Full ACID guarantees | Eventual consistency or specialized distributed consensus |
| **Hybrid Relational Joins** | Native \`JOIN\` across users, tenants, vectors | Requires dual-query orchestration in application code |
| **Scale Sweet Spot** | < 10,000,000 vectors | 10,000,000 to Billions of vectors |
| **Quantization Support** | Halfvec, binary quantization, sparse vectors | Deep support for SQ, PQ, and turbo quantization |
| **Cost Profile** | Tied to existing database instance compute/RAM | Usage-based per query / vector dimensions |

---

## 3. Engineering Decision Heuristic

1. **Choose PostgreSQL + pgvector if:**
   - Your vector dataset is under 10 million items.
   - You need strict multi-tenant authorization and complex relational filtering.
   - You value zero pipeline friction (no dual-write bugs, no out-of-sync vector records).
   - Your team already possesses strong PostgreSQL DBA competencies.

2. **Choose Dedicated Vector DBs (Pinecone / Qdrant) if:**
   - Your corpus exceeds 20–50 million high-dimensional vectors.
   - You require sub-15ms p99 retrieval at high concurrent throughput (>5,000 QPS).
   - You need serverless auto-scaling without database connection pool sizing constraints.`,
      sources: [
        {
          title: "pgvector official documentation and benchmarks",
          url: "https://github.com/pgvector/pgvector",
          domain: "github.com",
          snippet: "Open-source vector similarity search for Postgres supporting HNSW, IVFFlat, and halfvec.",
        },
        {
          title: "Vector Database Benchmarks & Scaling Analysis",
          url: "https://qdrant.tech/benchmarks",
          domain: "qdrant.tech",
          snippet: "Comparing retrieval accuracy, QPS, and memory consumption across vector storage backends.",
        },
        {
          title: "Building Production RAG Systems with Hybrid Search",
          url: "https://pinecone.io/learn/hybrid-search",
          domain: "pinecone.io",
          snippet: "Combining dense semantic embeddings with sparse keyword search in production pipelines.",
        },
      ],
      createdAt: "2026-09-21T14:34:12Z",
    },
  },
  {
    id: 2,
    query: "Deep dive into LangGraph multi-agent choreography patterns and human-in-the-loop workflows",
    status: "processing",
    currentPhase: "researching",
    createdAt: "2026-09-22T08:15:00Z",
    updatedAt: "2026-09-22T08:16:30Z",
    steps: [
      {
        id: "step-1",
        phase: "planning",
        label: "Graph Topology Formulation",
        description: "Constructing state graph schema with cyclical branches and interrupt conditions.",
        status: "completed",
        timestamp: "08:15:10",
        details: [
          "Designed StateGraph with ResearchState type contract.",
          "Configured conditional edges for iterative agent critique cycles.",
        ],
      },
      {
        id: "step-2",
        phase: "researching",
        label: "Agent Tool Invocation & Web Search",
        description: "Executing web search tools and extracting technical design patterns from LangChain docs.",
        status: "in-progress",
        timestamp: "08:15:45",
        details: [
          "Searching for: 'LangGraph checkpointer persistence with PostgresSaver'.",
          "Analyzing human-in-the-loop breakpoint patterns with interrupt() function.",
        ],
      },
      {
        id: "step-3",
        phase: "writing",
        label: "Comprehensive Synthesis",
        description: "Compiling architectural diagrams, code examples, and state transition tables.",
        status: "pending",
      },
    ],
  },
  {
    id: 3,
    query: "Real-world Server-Sent Events (SSE) vs WebSockets for streaming LLM reasoning steps to Next.js clients",
    status: "queued",
    currentPhase: "planning",
    createdAt: "2026-09-22T08:20:00Z",
    updatedAt: "2026-09-22T08:20:00Z",
    steps: [
      {
        id: "step-1",
        phase: "planning",
        label: "Inngest Queue Scheduled",
        description: "Job queued in event bus. Waiting for worker assignment.",
        status: "pending",
      },
    ],
  },
  {
    id: 4,
    query: "Quantum error correction code implementations in superconducting qubits (2025-2026 literature)",
    status: "failed",
    currentPhase: "researching",
    errorMessage: "External retrieval rate-limit exceeded: Research provider throttled downstream requests. Retry requested.",
    createdAt: "2026-09-20T11:04:00Z",
    updatedAt: "2026-09-20T11:05:22Z",
    steps: [
      {
        id: "step-1",
        phase: "planning",
        label: "Literature Review Scoping",
        description: "Scattered papers across arXiv and Nature Quantum Information.",
        status: "completed",
        timestamp: "11:04:05",
      },
      {
        id: "step-2",
        phase: "researching",
        label: "Academic Database Search",
        description: "Attempted automated extraction of preprint metadata.",
        status: "failed",
        timestamp: "11:05:20",
        details: ["Rate limit 429 received from upstream academic search API."],
      },
    ],
  },
];
