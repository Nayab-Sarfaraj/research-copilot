"use client";

import { useState } from "react";
import { ResearchItem } from "@/types/research";
import { MOCK_RESEARCHES } from "@/data/mock-research";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ResearchEmptyState } from "@/components/research/research-empty-state";
import { ResearchReportView } from "@/components/research/research-report-view";
import { ResearchProgress } from "@/components/research/research-progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Plus } from "lucide-react";

export default function Home() {
  const [researches, setResearches] = useState<ResearchItem[]>(MOCK_RESEARCHES);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = researches.find((r) => r.id === selectedId) || null;

  const handleCreateResearch = (query: string) => {
    setIsSubmitting(true);
    const newId = Date.now();
    const newItem: ResearchItem = {
      id: newId,
      query,
      status: "processing",
      currentPhase: "planning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        {
          id: "step-1",
          phase: "planning",
          label: "Deconstruct Inquiry Vectors",
          description: "Deconstructing topic into structured investigative vectors and query strategies.",
          status: "in-progress",
          timestamp: "Just now",
          details: [`Analyzed: "${query}"`, "Constructing LangGraph agent graph."],
        },
        {
          id: "step-2",
          phase: "researching",
          label: "Technical Literature Search",
          description: "Querying external technical documentation and benchmarking frameworks.",
          status: "pending",
        },
        {
          id: "step-3",
          phase: "writing",
          label: "Dossier Synthesis",
          description: "Compiling executive summary, architectural comparisons, and decision tree.",
          status: "pending",
        },
      ],
    };

    setResearches((prev) => [newItem, ...prev]);
    setSelectedId(newId);
    setIsSubmitting(false);

    // Interactive UI preview: step progression simulation
    setTimeout(() => {
      setResearches((current) =>
        current.map((item) => {
          if (item.id !== newId) return item;
          return {
            ...item,
            currentPhase: "researching",
            steps: item.steps?.map((step) => {
              if (step.phase === "planning") {
                return { ...step, status: "completed" };
              }
              if (step.phase === "researching") {
                return {
                  ...step,
                  status: "in-progress",
                  details: [
                    "Querying technical documentation & benchmarks...",
                    "Extracting architecture comparisons...",
                  ],
                };
              }
              return step;
            }),
          };
        })
      );
    }, 2500);

    setTimeout(() => {
      setResearches((current) =>
        current.map((item) => {
          if (item.id !== newId) return item;
          return {
            ...item,
            status: "completed",
            currentPhase: "completed",
            steps: item.steps?.map((step) => ({ ...step, status: "completed" })),
            report: {
              id: newId + 100,
              title: `Technical Brief: ${query}`,
              summary: `Architectural analysis on "${query}". Synthesizes multi-source findings, performance profiles, and operational tradeoffs for engineering leadership.`,
              keyTakeaways: [
                `**Core Architecture**: "${query}" requires a balanced evaluation of operational complexity against throughput.`,
                "**Performance Profile**: Sub-second latency requirements mandate aggressive connection pooling and caching.",
                "**Operational Advice**: Deploy behind a resilient circuit-breaker and observe p99 metrics.",
              ],
              content: `## Executive Overview\n\nThis synthesis investigates the primary technical dimensions regarding: **${query}**.\n\n---\n\n## 1. Architectural Patterns & Trade-offs\n\n- **Decoupled Architecture**: Isolate intensive workloads from interactive client interfaces to maintain sub-100ms response times.\n- **State Management**: LangGraph enforces deterministic state machines across planner, researcher, and writer nodes.\n- **Failure Isolation**: Background job workers ensure resilient retries and transparent error budgets.\n\n---\n\n## 2. Evaluation Matrix\n\n| Evaluation Metric | Baseline Implementation | Optimized Architecture |\n| :--- | :--- | :--- |\n| **Operational Overhead** | Low (Single Process) | Controlled (Decoupled Worker Queue) |\n| **P99 Response Latency** | Variable (2–4s) | Predictable (< 250ms) |\n| **Fault Tolerance** | Moderate | High (Automated Retry Policies) |`,
              sources: [
                {
                  title: `Technical Architecture Standards: ${query.slice(0, 32)}`,
                  url: "https://docs.kernel.org/research",
                  domain: "docs.kernel.org",
                  snippet: `In-depth documentation covering distributed systems, concurrency models, and runtime performance benchmarks.`,
                },
              ],
              createdAt: new Date().toISOString(),
            },
          };
        })
      );
    }, 5500);
  };

  const handleDeleteResearch = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setResearches((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      const remaining = researches.filter((item) => item.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Top Header */}
      <AppHeader
        onNewResearch={() => setSelectedId(null)}
        totalResearches={researches.length}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar History */}
        <AppSidebar
          researches={researches}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          onDelete={handleDeleteResearch}
        />

        {/* Content Area with smooth native scrolling */}
        <main className="flex flex-1 min-h-0 min-w-0 flex-col bg-background overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col p-6 sm:p-10 lg:p-12">
              {/* Mobile Back button */}
              {selectedItem && (
                <div className="mb-4 flex items-center justify-between border-b pb-3 md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedId(null)}
                    className="gap-1.5 text-xs text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>New Query</span>
                  </Button>
                </div>
              )}

              {/* Main View Selection */}
              {!selectedItem ? (
                <ResearchEmptyState
                  onSubmit={handleCreateResearch}
                  isLoading={isSubmitting}
                />
              ) : selectedItem.status === "completed" && selectedItem.report ? (
                <ResearchReportView item={selectedItem} />
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedId(null)}
                      className="h-8 gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>New Inquiry</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCreateResearch(selectedItem.query)
                      }
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Re-run Pipeline</span>
                    </Button>
                  </div>

                  <ResearchProgress item={selectedItem} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
