import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#070a13] text-foreground font-sans selection:bg-orange-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle ambient lighting */}
        <div className="fixed top-0 right-1/4 w-96 h-96 rounded-full bg-orange-600/5 blur-[140px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-600/5 blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
