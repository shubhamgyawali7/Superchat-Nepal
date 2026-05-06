"use client";
import React from 'react';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="bg-slate-900 border border-red-500/30 p-10 rounded-3xl max-w-md shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-white font-bold">!</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Payment Failed</h1>
        <p className="text-slate-400 mb-8">
          The transaction could not be completed. No money was deducted from your account.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-900/20"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}