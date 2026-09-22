"use client";

import { useState } from "react";
import { ArrowUp, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResearchInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

const STARTER_PROMPTS = [
  {
    category: "Distributed Storage",
    title: "PostgreSQL vs. DynamoDB at Scale",
    query: "Architectural comparison and cost/latency tradeoffs between PostgreSQL and DynamoDB for high-throughput transactional systems.",
  },
  {
    category: "Agent Systems",
    title: "LangGraph State & Human-in-the-Loop",
    query: "Deep dive into LangGraph multi-agent orchestration, state persistence with PostgresSaver, and human-in-the-loop interrupt patterns.",
  },
  {
    category: "Vector Retrieval",
    title: "pgvector HNSW vs. Dedicated Engines",
    query: "Analyze HNSW vs IVFFlat indexing in pgvector: Memory requirements, recall accuracy, and query latency at 10M+ scale.",
  },
  {
    category: "Backend Runtimes",
    title: "FastAPI uvloop vs. Go Microservices",
    query: "Benchmark comparison between async Python (FastAPI + uvloop) and Go standard library for I/O-bound microservices.",
  },
];

export function ResearchInput({ onSubmit, isLoading }: ResearchInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim());
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all focus-within:border-foreground/40 focus-within:ring-2 focus-within:ring-foreground/5"
      >
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Formulate a technical inquiry or architecture question..."
          rows={3}
          className="w-full resize-none bg-transparent p-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <span>Press</span>
            <span className="inline-flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-[10px] text-foreground">
              Return <CornerDownLeft className="h-2.5 w-2.5" />
            </span>
            <span>to synthesize</span>
          </div>

          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            size="sm"
            className="h-8 gap-1.5 rounded-md px-3 text-xs font-medium cursor-pointer shadow-xs"
          >
            <span>Investigate</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </form>

      {/* Suggested Inquiries */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
          Featured Architectural Inquiries
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt.title}
              type="button"
              onClick={() => setQuery(prompt.query)}
              className="flex flex-col items-start gap-1.5 rounded-lg border border-border/70 bg-card/60 p-3.5 text-left transition-all hover:border-foreground/30 hover:bg-muted/30 cursor-pointer group"
            >
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground group-hover:text-foreground">
                {prompt.category}
              </span>
              <span className="text-xs font-semibold text-foreground group-hover:underline underline-offset-2">
                {prompt.title}
              </span>
              <span className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                {prompt.query}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
