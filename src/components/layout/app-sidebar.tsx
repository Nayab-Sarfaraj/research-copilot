"use client";

import { useState } from "react";
import { ResearchItem } from "@/types/research";
import { ResearchCard } from "@/components/research/research-card";
import { Search } from "lucide-react";

interface AppSidebarProps {
  researches: ResearchItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

export function AppSidebar({
  researches,
  selectedId,
  onSelect,
  onDelete,
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "active">("all");

  const filteredItems = researches.filter((item) => {
    const matchesSearch =
      item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.report?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;

    if (!matchesSearch) return false;

    if (filterStatus === "completed") return item.status === "completed";
    if (filterStatus === "active")
      return item.status === "processing" || item.status === "queued";
    return true;
  });

  return (
    <aside className="flex h-full w-full flex-col border-r border-border/70 bg-muted/10 md:w-80 lg:w-88 shrink-0 min-h-0">
      <div className="flex flex-col gap-2.5 p-3.5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            History ({researches.length})
          </span>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterStatus === "all" ? "bg-muted font-medium text-foreground" : "hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterStatus === "completed" ? "bg-muted font-medium text-foreground" : "hover:text-foreground"
              }`}
            >
              Ready
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterStatus === "active" ? "bg-muted font-medium text-foreground" : "hover:text-foreground"
              }`}
            >
              Active
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search research dossiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-background/90 py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
          />
        </div>
      </div>

      {/* Native scroll container with custom slim scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground">
            <p className="font-medium text-foreground">No matches found</p>
            <p className="mt-1 text-[11px]">
              {searchQuery ? "Try a different search term." : "Start a new query above."}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <ResearchCard
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </aside>
  );
}
