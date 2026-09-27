"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Lock, Mail, User as UserIcon, X, Loader2, Sparkles } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(email, password, name.trim() || undefined);
      } else {
        await login(email, password);
      }
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-semibold">
              Research Copilot
            </span>
          </div>
          <h2 className="text-xl font-serif font-medium text-foreground">
            {isRegister ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isRegister
              ? "Register to start conducting grounded technical research."
              : "Sign in to access your dossiers, reports, and knowledge base."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Name</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Alex Vance"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@organization.com"
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            {isRegister && (
              <span className="text-[10px] text-muted-foreground">
                Minimum 6 characters
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full h-9 text-xs font-medium cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{isRegister ? "Creating account..." : "Signing in..."}</span>
              </span>
            ) : isRegister ? (
              "Register"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary cursor-pointer"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary cursor-pointer"
              >
                Create one
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
