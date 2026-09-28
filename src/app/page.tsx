"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { researchApi, getErrorMessage } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ResearchEmptyState } from "@/components/research/research-empty-state";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Database,
  Globe,
  FileText,
  Sparkles,
  GitBranch,
  Layers,
  CheckCircle2,
  Lock,
  Upload,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    openAuthModal,
    logout,
  } = useAuth();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [researchToDelete, setResearchToDelete] = useState<number | null>(null);

  // 13.7: Fetch REAL research history from backend GET /research
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["research-list"],
    queryFn: () => researchApi.getResearchList(1, 50),
    enabled: isAuthenticated,
  });

  // 13.2: Create Research mutation (POST /research)
  const createMutation = useMutation({
    mutationFn: (query: string) => researchApi.createResearch(query),
    onSuccess: (newResearch) => {
      setSubmitError(null);
      queryClient.invalidateQueries({ queryKey: ["research-list"] });
      router.push(`/research/${newResearch.id}`);
    },
    onError: (err) => {
      setSubmitError(getErrorMessage(err));
    },
  });

  // Delete research mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => researchApi.deleteResearch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-list"] });
    },
  });

  const handleCreateResearch = (query: string) => {
    setSubmitError(null);
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(query)}`);
      return;
    }
    createMutation.mutate(query);
  };

  const handleDeleteResearch = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setResearchToDelete(id);
  };

  const researches = historyData?.items || [];

  // ==========================================
  // VIEW 1: AUTHENTICATED WORKSPACE
  // ==========================================
  if (isAuthenticated) {
    return (
      <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
        <AppHeader
          onNewResearch={() => setIsMobileSidebarOpen(false)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          totalResearches={historyData?.total ?? researches.length}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Real History Sidebar */}
          <AppSidebar
            researches={researches}
            selectedId={null}
            onSelect={(id) => {
              router.push(`/research/${id}`);
              setIsMobileSidebarOpen(false);
            }}
            onDelete={handleDeleteResearch}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isLoading={isHistoryLoading}
          />

          {/* Main Inquiry Workspace */}
          <main className="flex flex-1 min-h-0 min-w-0 flex-col bg-background overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-5 sm:px-8 sm:py-8 lg:p-12">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-border/70 pb-4">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-foreground">
                      Domain Knowledge Base
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Index PDF documents for research retrieval.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDocumentUploadOpen(true)}
                    className="shrink-0 gap-1.5 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload PDF</span>
                  </Button>
                </div>
                <ResearchEmptyState
                  onSubmit={handleCreateResearch}
                  isLoading={createMutation.isPending}
                  error={submitError}
                />
              </div>
            </div>
          </main>
        </div>
        <ConfirmDialog
          open={researchToDelete !== null}
          onOpenChange={(open) => {
            if (!open) setResearchToDelete(null);
          }}
          title="Delete research dossier?"
          description="This will permanently delete this research dossier and its report. This action cannot be undone."
          confirmLabel="Delete dossier"
          onConfirm={() => {
            if (researchToDelete !== null) {
              deleteMutation.mutate(researchToDelete);
            }
          }}
        />
        <DocumentUploadModal
          isOpen={isDocumentUploadOpen}
          onClose={() => setIsDocumentUploadOpen(false)}
        />
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PRODUCT LANDING PAGE (VISITORS)
  // ==========================================
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground font-sans">
      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-xs">
            <Compass className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Research Copilot
            </span>
            <span className="hidden sm:inline rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/70">
              v1.0 Stage 13
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="h-8 gap-1.5 rounded-lg px-3.5 text-xs font-medium cursor-pointer shadow-xs"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center max-w-5xl mx-auto overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-96 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-xs font-mono text-muted-foreground shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>LangGraph + pgvector + Tavily Engine</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.08] max-w-4xl">
          Autonomous technical research from your PDFs and the live web.
        </h1>

        <p className="mt-6 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Queue complex engineering inquiries. Our multi-agent LangGraph
          pipeline deconstructs requirements, queries your private vector
          database, pulls live benchmarks via Tavily, and writes structured
          dossiers with verified citations.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/signup">
            <Button
              size="lg"
              className="h-10 gap-2 rounded-xl px-5 text-xs font-medium shadow-md cursor-pointer"
            >
              <span>Start Investigating</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="h-10 rounded-xl px-5 text-xs font-medium shadow-2xs cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Live Interactive Query Teaser Box */}
        <div className="mt-14 w-full max-w-2xl text-left">
          <ResearchEmptyState
            onSubmit={handleCreateResearch}
            isLoading={false}
            error={null}
          />
        </div>
      </section>

      {/* Architecture & Pipeline Section */}
      <section className="border-t border-border/70 bg-muted/20 py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
              Under The Hood
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
              Multi-Agent Research Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Deterministic state machine powered by LangGraph, Inngest durable
              step execution, and PostgreSQL pgvector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                01
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Planner Node
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deconstructs natural language queries into distinct search
                vectors and investigative angles.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                02
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Dual Retrieval
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Queries local pgvector 384-dim document embeddings and Tavily
                advanced web search in parallel.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                03
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Writer Node
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Groq qwen-27b synthesizes findings into an executive summary,
                markdown content, and deduplicated citations.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-2xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                04
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Durable Output
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reports and citations are persisted to Postgres with eager
                loading and live polling states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-6 bg-card">
            <Database className="h-5 w-5 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Domain Knowledge Base
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload PDF whitepapers, architecture specs, and RFCs. Extracted
              with PyMuPDF, chunked, and embedded into pgvector.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-6 bg-card">
            <ShieldCheck className="h-5 w-5 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              User Isolation & Auth
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stateless 24-hour JWT tokens with bcrypt password hashing. All
              research queries, reports, and PDFs are strictly scoped per user.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-6 bg-card">
            <Zap className="h-5 w-5 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Sliding-Window Rate Limits
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In-memory rate limiting prevents abuse (5 research queries/minute,
              10 PDF uploads/hour) with HTTP 429 Retry-After headers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 py-8 px-4 sm:px-8 text-center text-xs text-muted-foreground font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <span>Research Copilot · Autonomous Technical Intelligence</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-foreground">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-foreground">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
