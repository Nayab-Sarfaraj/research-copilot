"use client";

import { ResearchInput } from "@/components/research/research-input";

export interface ResearchEmptyStateProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function ResearchEmptyState({ onSubmit, isLoading, error }: ResearchEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8 sm:py-16">
      <div className="flex flex-col items-center text-center max-w-xl mb-10">
        <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground mb-3">
          Deep Technical Research
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground leading-tight">
          Formulate an architectural inquiry.
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Decomposes multi-faceted questions into targeted vectors, cross-examines technical literature, and compiles structured dossiers.
        </p>
      </div>

      <ResearchInput onSubmit={onSubmit} isLoading={isLoading} error={error} />
    </div>
  );
}
