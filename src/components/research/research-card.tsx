"use client";

import { ResearchItem, ResearchStatus } from "@/types/research";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchCardProps {
  item: ResearchItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

export function ResearchCard({
  item,
  isSelected,
  onSelect,
  onDelete,
}: ResearchCardProps) {
  const getStatusIndicator = (status: ResearchStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Ready</span>
          </span>
        );
      case "processing":
        return (
          <span className="flex items-center gap-1.5 text-[11px] text-amber-600 font-mono">
            <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
            <span>Synthesizing</span>
          </span>
        );
      case "queued":
        return (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span>Queued</span>
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1.5 text-[11px] text-destructive font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            <span>Failed</span>
          </span>
        );
    }
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={() => onSelect(item.id)}
      className={cn(
        "group relative flex flex-col gap-1.5 rounded-md border p-3 text-left transition-all cursor-pointer",
        isSelected
          ? "border-foreground/20 bg-muted/70 shadow-2xs"
          : "border-border/50 bg-background/50 hover:bg-muted/40 hover:border-border"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {getStatusIndicator(item.status)}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground font-mono">{formattedDate}</span>
          <button
            onClick={(e) => onDelete(item.id, e)}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-opacity"
            title="Delete dossier"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="line-clamp-2 text-xs font-medium text-foreground leading-relaxed">
        {item.report?.title || item.query}
      </p>

      {item.status === "processing" && item.currentPhase && (
        <span className="text-[10px] text-amber-600 font-mono capitalize">
          › {item.currentPhase}...
        </span>
      )}
    </div>
  );
}
