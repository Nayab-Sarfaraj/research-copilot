"use client";

import { ResearchSource } from "@/types/research";
import { ExternalLink, Globe, FileText, BookOpen } from "lucide-react";

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
        {sources.map((source, idx) => {
          const isDocument = source.source_type === "document" || (!source.url && !!source.source_metadata);
          const docName = source.source_metadata?.source || source.title;
          const pageNum = source.source_metadata?.page;

          if (isDocument) {
            return (
              <div
                key={idx}
                className="group flex flex-col justify-between gap-2.5 rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xs"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <FileText className="h-3 w-3" />
                      Document Source
                    </span>
                    {pageNum !== undefined && pageNum !== null && (
                      <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        <BookOpen className="h-2.5 w-2.5" />
                        Page {pageNum}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-foreground line-clamp-2">
                    {docName}
                  </h4>

                  {source.snippet && (
                    <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                      {source.snippet}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <span>Knowledge Base Index</span>
                </div>
              </div>
            );
          }

          // Web source
          const targetUrl = source.url || "#";
          return (
            <a
              key={idx}
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between gap-2.5 rounded-xl border border-border/70 bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-accent/40 shadow-2xs"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    {source.domain || "Web Source"}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 group-hover:text-primary" />
                </div>

                <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {source.title}
                </h4>

                {source.snippet && (
                  <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                    {source.snippet}
                  </p>
                )}
              </div>

              {source.url && (
                <span className="text-[10px] text-muted-foreground truncate font-mono">
                  {source.url}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
