export type ResearchStatus =
  | "queued"
  | "created"
  | "processing"
  | "planning"
  | "researching"
  | "writing"
  | "completed"
  | "failed";

export type AgentPhase = "planning" | "researching" | "writing" | "completed";

export type SourceType = "web" | "document";

export interface AgentStep {
  id: string;
  phase: AgentPhase;
  label: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  timestamp?: string;
  details?: string[];
}

export interface SourceResponse {
  id?: number;
  research_id?: number;
  title: string;
  url?: string | null;
  source_type?: SourceType | string;
  source_metadata?: Record<string, any>;
  created_at?: string;
  snippet?: string;
  domain?: string;
}

export interface ResearchReportResponse {
  id: number;
  research_id?: number;
  title: string;
  summary: string;
  content: string;
  created_at?: string;
  createdAt?: string;
  keyTakeaways?: string[];
  sources?: SourceResponse[];
}

export interface ResearchResponse {
  id: number;
  user_id?: number | null;
  query: string;
  status: ResearchStatus;
  error_message?: string | null;
  errorMessage?: string | null;
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
  report?: ResearchReportResponse | null;
  sources: SourceResponse[];
  currentPhase?: AgentPhase;
  steps?: AgentStep[];
}

export interface ResearchListResponse {
  items: ResearchResponse[];
  page: number;
  limit: number;
  total: number;
}

export interface DocumentChunk {
  id?: number;
  content: string;
  metadata: Record<string, any>;
  embedding_length?: number;
  created_at?: string;
}

export interface DocumentResponse {
  filename: string;
  saved_chunk_count: number;
  chunks: DocumentChunk[];
}

export interface User {
  id: number;
  email: string;
  name?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// UI Compatibility types
export interface ResearchSource extends SourceResponse {}
export interface ResearchReport extends ResearchReportResponse {}

export interface ResearchItem {
  id: number;
  query: string;
  status: ResearchStatus;
  user_id?: number | null;
  currentPhase?: AgentPhase;
  steps?: AgentStep[];
  errorMessage?: string | null;
  error_message?: string | null;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  report?: ResearchReportResponse | null;
  sources?: SourceResponse[];
}
