"use client";
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className="text-center max-w-md w-full bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
            <div className="w-16 h-16 bg-zinc-900 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-zinc-400 mb-8">
              An unexpected error occurred. We&apos;ve been notified and are working to fix it.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-wider text-xs py-3.5 px-6 rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
