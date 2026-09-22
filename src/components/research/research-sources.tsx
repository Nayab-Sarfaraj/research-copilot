"use client";

import { ResearchSource } from "@/types/research";
import { ExternalLink, Globe } from "lucide-react";

interface ResearchSourcesProps {
  sources?: ResearchSource[];
}

export function ResearchSources({ sources }: ResearchSourcesProps) {
  if (!sources || sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
        <Globe className="h-8 w-8 mb-2 opacity-30" />
        <p className="font-medium text-foreground">No external sources recorded</p>
        <p className="mt-1 text-[11px]">
          The agent answered using foundational domain knowledge and local models.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
          External Evidence & Consulted Sources ({sources.length})
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-2.5 rounded-xl border border-border/70 bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-accent/40 shadow-2xs"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  {source.domain}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 group-hover:text-primary" />
              </div>

              <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {source.title}
              </h4>

              <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                {source.snippet}
              </p>
            </div>

            <span className="text-[10px] text-muted-foreground truncate font-mono">
              {source.url}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
