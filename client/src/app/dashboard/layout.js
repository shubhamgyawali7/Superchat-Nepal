import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
