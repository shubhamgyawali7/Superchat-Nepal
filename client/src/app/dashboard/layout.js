import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D13] text-[#1D1D20] dark:text-[#F4F5F8] font-sans selection:bg-orange-100 dark:selection:bg-orange-950/50 selection:text-orange-900 dark:selection:text-orange-200 transition-colors duration-150">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#F5F7FA] dark:bg-[#0B0D13]">
          {children}
        </main>
      </div>
    </div>
  );
}
