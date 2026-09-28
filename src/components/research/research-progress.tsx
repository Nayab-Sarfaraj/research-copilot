"use client";

import { AgentStep, ResearchItem } from "@/types/research";
import { Check, Loader2, AlertCircle, Terminal, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchProgressProps {
  item: ResearchItem;
}

function getPhaseLabel(phase: string | undefined) {
  const normalized = (phase || "queued").toLowerCase();
  const map: Record<string, string> = {
    queued: "Queued",
    planning: "Planning",
    researching: "Researching",
    writing: "Writing",
    completed: "Completed",
    failed: "Failed",
    processing: "Processing",
    created: "Created",
  };

  return map[normalized] || "Queued";
}

export function ResearchProgress({ item }: ResearchProgressProps) {
  const currentPhase = item.currentPhase || item.status;
  const steps =
    item.steps && item.steps.length > 0
      ? item.steps
      : [
          {
            id: "current-phase",
            phase: currentPhase as string,
            label: getPhaseLabel(currentPhase),
            description:
              item.status === "completed"
                ? "The research dossier has been generated and is ready to review."
                : item.status === "failed"
                  ? "The workflow stopped while processing this research request."
                  : "The backend is processing this research task and will publish the final output when complete.",
            status:
              item.status === "completed"
                ? "completed"
                : item.status === "failed"
                  ? "failed"
                  : "in-progress",
          } as AgentStep,
        ];

  const phaseLabel = getPhaseLabel(currentPhase);

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-border/80 bg-card p-6 shadow-2xs">
      <div className="flex flex-col gap-3 border-b border-border/70 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full animate-pulse",
                item.status === "completed"
                  ? "bg-emerald-500"
                  : item.status === "failed"
                    ? "bg-red-500"
                    : "bg-amber-500",
              )}
            />
            <h3 className="font-serif text-lg font-medium text-foreground">
              {item.status === "completed"
                ? "Research Synthesis Complete"
                : item.status === "failed"
                  ? "Research Synthesis Failed"
                  : "Research Synthesis in Progress"}
            </h3>
          </div>
          <span className="rounded-full border border-border/80 bg-muted/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {phaseLabel}
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

        {steps.map((step) => {
          const isCurrent =
            step.status === "in-progress" || step.status === "pending";
          const isDone = step.status === "completed";
          const isFailed = step.status === "failed";

          return (
            <div key={step.id} className="relative flex items-start gap-4 z-10">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-mono transition-colors",
                  isDone
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isCurrent
                      ? "border-foreground bg-foreground text-background shadow-xs"
                      : isFailed
                        ? "border-destructive bg-destructive text-white"
                        : "border-border text-muted-foreground",
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isFailed ? (
                  <AlertCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                ) : (
                  <Circle className="h-2.5 w-2.5 fill-current" />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wide",
                      isCurrent
                        ? "text-foreground"
                        : isDone
                          ? "text-foreground/90"
                          : "text-muted-foreground",
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

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {step.details && step.details.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 rounded-md border border-border/70 bg-muted/30 p-2.5 font-mono text-[11px] text-muted-foreground">
                    <div className="mb-0.5 flex items-center gap-1.5 text-foreground/80">
                      <Terminal className="h-3 w-3" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                        Execution Trace
                      </span>
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
