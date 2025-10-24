'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(102,217,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(102,217,239,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="max-w-2xl w-full relative z-10 text-center space-y-8">
        {/* 404 Error Code */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold font-mono text-primary/20 select-none">
            404
          </h1>
          <div className="h-1 w-32 bg-primary/30 mx-auto rounded-full" />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold font-mono">
            <span className="text-[hsl(var(--monokai-orange))]">Page</span>{' '}
            <span className="text-foreground">Not Found</span>
          </h2>
          <p className="text-base text-muted-foreground font-mono max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for seems to be{' '}
            <span className="text-[hsl(var(--monokai-green))]">hidden</span> from view.
            <br />
            Unlike our adversarial text, this one doesn&apos;t exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/"
            className="group flex items-center gap-2 px-6 py-3 bg-primary text-background font-mono text-sm font-bold rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/playground"
            className="group flex items-center gap-2 px-6 py-3 bg-card border border-border font-mono text-sm font-semibold rounded-lg hover:bg-card/70 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="w-4 h-4" />
            <span>Go to Playground</span>
          </Link>
        </div>

        {/* Additional Info Card */}
        <div className="mt-12 p-6 bg-card/20 border border-border/50 rounded-lg">
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--monokai-yellow))]/10 border border-[hsl(var(--monokai-yellow))]/20 flex items-center justify-center flex-shrink-0">
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--monokai-yellow))]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold font-mono text-[hsl(var(--monokai-yellow))]">
                Lost your way?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                If you believe this page should exist, please check the URL for typos or navigate back to the homepage to start fresh.
                For support, contact us at{' '}
                <a
                  href="mailto:adversarialvision@owaisshariff.com"
                  className="text-primary hover:text-[hsl(var(--monokai-cyan))] underline"
                >
                  adversarialvision@owaisshariff.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
