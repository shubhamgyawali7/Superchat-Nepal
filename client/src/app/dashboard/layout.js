import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F0F2F6] text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900 p-2 sm:p-4 md:p-6 lg:p-7 flex items-stretch">
      <div className="w-full max-w-[1680px] mx-auto bg-white rounded-[28px] md:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-200/70 overflow-hidden flex flex-col md:flex-row relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative bg-[#F8F9FC]">
          {children}
        </main>
      </div>
    </div>
  );
}
