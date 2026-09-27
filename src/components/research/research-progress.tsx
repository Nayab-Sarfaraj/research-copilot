"use client";

import { AgentStep, ResearchItem } from "@/types/research";
import { Check, Loader2, AlertCircle, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchProgressProps {
  item: ResearchItem;
}

const DEFAULT_STEPS: AgentStep[] = [
  {
    id: "step-1",
    phase: "planning",
    label: "Decompose Research Vectors",
    description: "Planner agent analyzes inquiry, extracts evaluation metrics, and forms research execution plan.",
    status: "in-progress",
  },
  {
    id: "step-2",
    phase: "researching",
    label: "Deep Technical Literature & Web Ingestion",
    description: "Queries external technical sources, verifies benchmark methodologies, and extracts findings.",
    status: "pending",
  },
  {
    id: "step-3",
    phase: "writing",
    label: "Editorial Dossier Synthesis",
    description: "Compiles structured executive summary, comparative tables, and decision framework.",
    status: "pending",
  },
];

export function ResearchProgress({ item }: ResearchProgressProps) {
  const steps = item.steps && item.steps.length > 0 ? item.steps : DEFAULT_STEPS;

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-border/80 bg-card p-6 shadow-2xs">
      <div className="flex flex-col gap-2 border-b border-border/70 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg font-medium text-foreground">
              Research Synthesis in Progress
            </h3>
          </div>
          <span className="font-mono text-xs uppercase text-muted-foreground">
            Phase: {item.currentPhase || item.status}
          </span>
        </div>

        <p className="text-xs text-muted-foreground font-sans italic">
          &ldquo;{item.query}&rdquo;
        </p>
      </div>

      {item.errorMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold font-mono">Execution Fault</span>
            <span>{item.errorMessage}</span>
          </div>
        </div>
      )}

      {/* Vertical Linear Timeline */}
      <div className="relative flex flex-col gap-6 pl-2">
        <div className="absolute left-[17px] top-3 bottom-3 w-px bg-border/80" />

        {steps.map((step, idx) => {
          const isCurrent = step.status === "in-progress";
          const isDone = step.status === "completed";
          const isFailed = step.status === "failed";

          return (
            <div key={step.id} className="relative flex items-start gap-4 z-10">
              {/* Step indicator node */}
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-mono transition-colors",
                  isDone
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isCurrent
                    ? "border-foreground bg-foreground text-background shadow-xs"
                    : isFailed
                    ? "border-destructive bg-destructive text-white"
                    : "border-border text-muted-foreground"
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>

              {/* Step content */}
              <div className="flex flex-1 flex-col gap-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isCurrent
                        ? "text-foreground"
                        : isDone
                        ? "text-foreground/90"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {step.timestamp}
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {step.details && step.details.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 rounded border border-border/70 bg-muted/40 p-2.5 font-mono text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-foreground/80 mb-0.5">
                      <Terminal className="h-3 w-3" />
                      <span className="font-semibold text-[10px] tracking-wider">EXECUTION TRACE</span>
                    </div>
                    {step.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-muted-foreground">›</span>
                        <span className="leading-snug">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
