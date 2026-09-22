export type ResearchStatus = "queued" | "processing" | "completed" | "failed";

export type AgentPhase = "planning" | "researching" | "writing" | "completed";

export interface AgentStep {
  id: string;
  phase: AgentPhase;
  label: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  timestamp?: string;
  details?: string[];
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

export interface ResearchReport {
  id: number;
  title: string;
  summary: string;
  content: string;
  keyTakeaways?: string[];
  sources?: ResearchSource[];
  createdAt: string;
}

export interface ResearchItem {
  id: number;
  query: string;
  status: ResearchStatus;
  currentPhase?: AgentPhase;
  steps?: AgentStep[];
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  report?: ResearchReport;
}
