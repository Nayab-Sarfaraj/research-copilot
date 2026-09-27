"use client";

import { useState } from "react";
import { ResearchItem } from "@/types/research";
import { ResearchSources } from "@/components/research/research-sources";
import { ResearchProgress } from "@/components/research/research-progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Share2,
  FileText,
  ListChecks,
  Globe,
  GitBranch,
  Clock,
  Calendar,
} from "lucide-react";

interface ResearchReportViewProps {
  item: ResearchItem;
}

export function ResearchReportView({ item }: ResearchReportViewProps) {
  const [copied, setCopied] = useState(false);
  const report = item.report;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <FileText className="h-10 w-10 mb-2 opacity-30" />
        <p className="text-sm font-medium">No report generated for this research.</p>
      </div>
    );
  }

  const handleCopy = () => {
    const fullText = `# ${report.title}\n\n## Executive Summary\n${report.summary}\n\n${report.content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="flex w-full flex-col gap-8 pb-16">
      {/* Header Banner */}
      <header className="flex flex-col gap-4 border-b border-border/70 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              5 min read
            </span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Verified Synthesis
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert("Share link copied to clipboard")}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-medium tracking-tight text-foreground leading-[1.18]">
            {report.title}
          </h1>

          <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground/80 shrink-0">
              Query
            </span>
            <p className="text-foreground/80 font-normal italic leading-relaxed">
              &ldquo;{item.query}&rdquo;
            </p>
          </div>
        </div>
      </header>

      {/* Abstract / Executive Summary */}
      <section className="relative rounded-lg border-l-2 border-foreground/80 bg-muted/20 py-4 px-5">
        <span className="block text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Executive Summary
        </span>
        <p className="text-sm font-normal text-foreground/90 leading-relaxed">
          {report.summary}
        </p>
      </section>

      {/* Tabs Navigation with mobile horizontal scroll */}
      <Tabs defaultValue="report" className="w-full">
        <div className="mb-6 w-full overflow-x-auto border-b border-border/70 pb-px [scrollbar-width:none] [-ms-overflow-style:none]">
          <TabsList className="flex w-max min-w-full justify-start rounded-none bg-transparent p-0 h-9 gap-3 sm:gap-6 border-none">
            <TabsTrigger
              value="report"
              className="shrink-0 gap-1.5 text-xs cursor-pointer rounded-none border-b-2 border-transparent px-2 pb-2 pt-1 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:shadow-none"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Dossier</span>
            </TabsTrigger>
            <TabsTrigger
              value="takeaways"
              className="shrink-0 gap-1.5 text-xs cursor-pointer rounded-none border-b-2 border-transparent px-2 pb-2 pt-1 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:shadow-none"
            >
              <ListChecks className="h-3.5 w-3.5" />
              <span>Key Takeaways</span>
            </TabsTrigger>
            <TabsTrigger
              value="sources"
              className="shrink-0 gap-1.5 text-xs cursor-pointer rounded-none border-b-2 border-transparent px-2 pb-2 pt-1 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:shadow-none"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Evidence ({report.sources?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger
              value="trace"
              className="shrink-0 gap-1.5 text-xs cursor-pointer rounded-none border-b-2 border-transparent px-2 pb-2 pt-1 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:shadow-none"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>Agent Execution</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Full Report Content */}
        <TabsContent value="report" className="mt-0">
          <div className="space-y-6 text-sm leading-relaxed text-foreground/90 max-w-none">
            {report.content.split("\n\n").map((block, idx) => {
              // Header 2 (Section Title in Editorial Serif)
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="font-serif text-2xl font-semibold text-foreground border-b border-border/60 pb-2 pt-6 first:pt-0"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              // Header 3
              if (block.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="font-serif text-lg font-medium text-foreground pt-3"
                  >
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              // Divider
              if (block.trim() === "---") {
                return <hr key={idx} className="my-8 border-border/60" />;
              }
              // Bullet lists
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={idx} className="space-y-2.5 pl-4">
                    {items.map((it, iIdx) => {
                      const line = it.replace("- ", "");
                      return (
                        <li key={iIdx} className="relative pl-3 text-foreground/90">
                          <span className="absolute -left-1 top-2.5 h-1 w-1 rounded-full bg-foreground/40" />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="font-semibold text-foreground">$1</strong>'
                              ),
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              // Numbered lists
              if (/^\d+\.\s/.test(block)) {
                const items = block.split("\n");
                return (
                  <div key={idx} className="space-y-3 pl-2">
                    {items.map((line, lIdx) => (
                      <p key={lIdx} className="text-foreground/90">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-foreground">$1</strong>'
                            ),
                          }}
                        />
                      </p>
                    ))}
                  </div>
                );
              }
              // Markdown Table detection
              if (block.includes("|") && block.includes("---")) {
                const rows = block.trim().split("\n");
                const headerRow = rows[0]
                  .split("|")
                  .filter((c) => c.trim().length > 0)
                  .map((c) => c.trim());
                const dataRows = rows.slice(2).map((r) =>
                  r
                    .split("|")
                    .filter((c) => c.trim().length > 0)
                    .map((c) => c.trim())
                );

                return (
                  <div key={idx} className="my-6 overflow-x-auto rounded-lg border border-border/70 [scrollbar-width:thin]">
                    <table className="w-full min-w-[480px] border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/70 bg-muted/40 text-left font-mono font-medium text-foreground">
                          {headerRow.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 uppercase tracking-wider text-[11px]">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {dataRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 text-foreground/80 leading-normal">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Normal paragraph
              return (
                <p key={idx} className="text-foreground/90 leading-relaxed">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: block.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="font-semibold text-foreground">$1</strong>'
                      ),
                    }}
                  />
                </p>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Key Takeaways */}
        <TabsContent value="takeaways" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.keyTakeaways?.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-lg border border-border/70 bg-card p-4 shadow-2xs"
              >
                <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5 font-semibold">
                  0{idx + 1}
                </span>
                <div className="text-xs text-foreground/90 leading-relaxed">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: takeaway.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-foreground font-semibold">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Sources */}
        <TabsContent value="sources" className="mt-0">
          <ResearchSources sources={report.sources} />
        </TabsContent>

        {/* Tab 4: Agent Trace */}
        <TabsContent value="trace" className="mt-0">
          <ResearchProgress item={item} />
        </TabsContent>
      </Tabs>
    </article>
  );
}
