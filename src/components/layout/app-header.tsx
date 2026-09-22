"use client";

import { Compass, Plus, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onNewResearch: () => void;
  onToggleMobileSidebar: () => void;
  totalResearches: number;
}

export function AppHeader({
  onNewResearch,
  onToggleMobileSidebar,
  totalResearches,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/70 bg-background/90 px-3 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Sidebar Trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMobileSidebar}
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          title="Toggle history"
          aria-label="Toggle history sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background shadow-xs shrink-0">
          <Compass className="h-4 w-4 stroke-[2.2]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-serif text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">
            Research Copilot
          </span>
          <span className="hidden sm:inline text-border">/</span>
          <span className="hidden sm:inline text-xs text-muted-foreground font-sans">
            Technical Intelligence
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{totalResearches} dossiers indexed</span>
        </div>

        <Button
          onClick={onNewResearch}
          size="sm"
          className="h-8 gap-1.5 rounded-md px-2.5 sm:px-3 text-xs font-medium cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden xs:inline sm:inline">New Query</span>
          <span className="inline xs:hidden sm:hidden">New</span>
        </Button>
      </div>
    </header>
  );
}
