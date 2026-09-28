"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { researchApi, getErrorMessage } from "@/lib/api-client";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ResearchReportView } from "@/components/research/research-report-view";
import { ResearchProgress } from "@/components/research/research-progress";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  AlertCircle,
  Loader2,
  FileQuestion,
} from "lucide-react";

interface ResearchPageProps {
  params: Promise<{ id: string }>;
}

export default function ResearchDetailPage({ params }: ResearchPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const researchId = Number(resolvedParams.id);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 13.7: Fetch research history
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["research-list"],
    queryFn: () => researchApi.getResearchList(1, 50),
  });

  // 13.3: Periodically fetch research status while active
  const {
    data: research,
    isLoading: isResearchLoading,
    error: researchError,
    refetch,
  } = useQuery({
    queryKey: ["research", researchId],
    queryFn: () => researchApi.getResearchById(researchId),
    enabled: !isNaN(researchId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Continue polling every 2s until completed or failed
      if (status && !["completed", "failed"].includes(status)) {
        return 2000;
      }
      return false;
    },
  });

  // Re-run pipeline / Re-create research mutation
  const rerunMutation = useMutation({
    mutationFn: (query: string) => researchApi.createResearch(query),
    onSuccess: (newResearch) => {
      queryClient.invalidateQueries({ queryKey: ["research-list"] });
      router.push(`/research/${newResearch.id}`);
    },
  });

  // Delete research mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => researchApi.deleteResearch(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["research-list"] });
      if (deletedId === researchId) {
        router.push("/");
      }
    },
  });

  const handleDeleteResearch = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this research dossier?")) {
      deleteMutation.mutate(id);
    }
  };

  const researches = historyData?.items || [];

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
      <AppHeader
        onNewResearch={() => {
          router.push("/");
          setIsMobileSidebarOpen(false);
        }}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        totalResearches={historyData?.total ?? researches.length}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar History */}
        <AppSidebar
          researches={researches}
          selectedId={researchId}
          onSelect={(id) => {
            router.push(`/research/${id}`);
            setIsMobileSidebarOpen(false);
          }}
          onDelete={handleDeleteResearch}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isLoading={isHistoryLoading}
        />

        {/* Content Area */}
        <main className="flex flex-1 min-h-0 min-w-0 flex-col bg-background overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-5 sm:px-8 sm:py-8 lg:p-12">
              <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Home</span>
                </Button>
              </div>

              {/* Back to New Inquiry bar on mobile */}
              <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>New Inquiry</span>
                </Button>
              </div>

              {/* 13.8: Loading State */}
              {isResearchLoading ? (
                <div className="flex flex-col items-center justify-center p-16 text-center text-muted-foreground gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="text-xs font-mono">
                    Loading research dossier #{researchId}...
                  </span>
                </div>
              ) : researchError ? (
                /* 13.8: Error State (404, 403, Network Error) */
                <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center gap-4">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                  <div className="flex flex-col gap-1 max-w-md">
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      Dossier Unavailable
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {getErrorMessage(researchError)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="h-8 text-xs cursor-pointer gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retry</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push("/")}
                      className="h-8 text-xs cursor-pointer gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>New Inquiry</span>
                    </Button>
                  </div>
                </div>
              ) : !research ? (
                /* Empty / Not Found */
                <div className="flex flex-col items-center justify-center p-16 text-center text-muted-foreground gap-3">
                  <FileQuestion className="h-10 w-10 opacity-30" />
                  <p className="text-sm font-medium">
                    Research dossier not found.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/")}
                    className="h-8 text-xs cursor-pointer mt-2"
                  >
                    Start a New Inquiry
                  </Button>
                </div>
              ) : research.status === "completed" && research.report ? (
                /* 13.4: Completed Report View */
                <>
                  <div className="mb-4 flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/")}
                      className="h-8 gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Home</span>
                    </Button>
                  </div>
                  <ResearchReportView item={research} />
                </>
              ) : (
                /* 13.3: Active Progress & Failed View */
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/")}
                      className="h-8 gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Home</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/")}
                      className="h-8 gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>New Inquiry</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => rerunMutation.mutate(research.query)}
                      disabled={rerunMutation.isPending}
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${
                          rerunMutation.isPending ? "animate-spin" : ""
                        }`}
                      />
                      <span>Re-run Pipeline</span>
                    </Button>
                  </div>

                  <ResearchProgress item={research} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
