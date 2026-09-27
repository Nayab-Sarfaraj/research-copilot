"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { documentApi, getErrorMessage } from "@/lib/api-client";
import { DocumentResponse } from "@/types/research";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Database,
  ArrowRight,
} from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<DocumentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentApi.uploadDocument(file),
    onSuccess: (data) => {
      setResult(data);
      setError(null);
    },
    onError: (err) => {
      setError(getErrorMessage(err));
      setResult(null);
    },
  });

  if (!isOpen) return null;

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setResult(null);

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported for vector knowledge base indexing.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    if (!isAuthenticated) {
      setError("Please sign in first to upload and manage your knowledge base documents.");
      openAuthModal();
      return;
    }

    uploadMutation.mutate(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={() => {
            handleReset();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Database className="h-4 w-4" />
            </div>
            <span className="font-serif text-base font-semibold">
              Domain Knowledge Base
            </span>
          </div>
          <h2 className="text-xl font-serif font-medium text-foreground">
            Index Technical Documentation
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload domain whitepapers, RFCs, or architecture specs (PDF). The pipeline chunks text into 1,000-character segments and computes 384-dimensional vector embeddings for cosine retrieval.
          </p>
        </div>

        {/* Upload State Views */}
        {result ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">
              Document Successfully Indexed
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              <strong className="text-foreground">{result.filename}</strong> has been vectorized into{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                {result.saved_chunk_count} chunks
              </strong>{" "}
              and stored in pgvector.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs cursor-pointer"
              >
                Upload Another PDF
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="h-8 text-xs cursor-pointer gap-1.5"
              >
                <span>Done</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">Upload Error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-foreground bg-muted/40"
                  : selectedFile
                  ? "border-border bg-card"
                  : "border-border/70 hover:border-foreground/40 hover:bg-muted/20"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              {selectedFile ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[220px]">
                      {selectedFile.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-foreground">
                      Click to browse or drop your PDF here
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Maximum 10 uploads/hour · Up to 50MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                {uploadMutation.isPending && (
                  <span className="flex items-center gap-2 text-foreground font-mono">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                    <span>Chunking & computing embeddings...</span>
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="h-8 text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Vectorizing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      <span>Index PDF</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
