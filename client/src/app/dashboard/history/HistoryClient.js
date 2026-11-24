"use client";

import React, { useState, useMemo } from "react";
import Icon from "@/components/common/Icon";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/hooks/useToast";
import {
  Invoice01Icon,
  Wallet01Icon,
  Search01Icon,
  Download01Icon,
  FilterIcon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";

export default function HistoryClient({ donations = [], username = "streamer" }) {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGateway, setSelectedGateway] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = donations.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
    const count = donations.length;
    const avg = count > 0 ? Math.round(total / count) : 0;
    const max = count > 0 ? Math.max(...donations.map((d) => parseFloat(d.amount) || 0)) : 0;
    return { total, count, avg, max };
  }, [donations]);

  // Filtered donations
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const name = (d.supporter_name || d.supporterName || "").toLowerCase();
      const message = (d.message || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || message.includes(query);
      const matchesGateway =
        selectedGateway === "all" ||
        (d.gateway || "").toLowerCase() === selectedGateway.toLowerCase();
      const matchesStatus =
        selectedStatus === "all" ||
        (d.status || "").toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesGateway && matchesStatus;
    });
  }, [donations, searchQuery, selectedGateway, selectedStatus]);

  const exportCSV = () => {
    if (filteredDonations.length === 0) {
      addToast("No transactions to export.", "info");
      return;
    }
    const csvHeader = "ID,Supporter,Amount,Gateway,Status,Message,Date\n";
    const csvRows = filteredDonations
      .map(
        (d) =>
          `"${d.id || ""}","${d.supporter_name || d.supporterName || "Anonymous"}","${d.amount || 0}","${d.gateway || "eSewa"}","${d.status || "verified"}","${(d.message || "").replace(/"/g, '""')}","${d.created_at || d.createdAt || ""}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `superchat-history-${username}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast("CSV export generated successfully!", "success");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1550px] mx-auto text-[#1D1D20] dark:text-[#F4F5F8]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAF1] dark:border-[#222736]">
        <div>
          <p className="text-xs text-[#FF4D0A] uppercase tracking-wider font-bold mb-1">
            Dashboard / Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#1D1D20] dark:text-[#F4F5F8]">
            Donation &amp; Superchat History
          </h1>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 bg-white dark:bg-[#131620] hover:bg-slate-50 dark:hover:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] text-[#1D1D20] dark:text-[#F4F5F8] text-xs font-semibold rounded-xl transition-colors shadow-2xs"
        >
          <Icon icon={Download01Icon} size={14} />
          <span>Export Transactions</span>
          <span className="text-[#FF4D0A] font-mono font-bold text-[11px]">CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Donations"
          prefix="रू"
          value={metrics.total.toLocaleString()}
          subtext="Lifetime earnings"
          icon={Wallet01Icon}
          iconColor="text-[#FF4D0A]"
          iconBg="bg-orange-50 dark:bg-orange-500/10"
        />
        <StatCard
          label="Total Superchats"
          value={metrics.count.toLocaleString()}
          subtext="Completed payouts"
          icon={Invoice01Icon}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        />
        <StatCard
          label="Average Amount"
          prefix="रू"
          value={metrics.avg.toLocaleString()}
          subtext="Per donation"
          icon={Invoice01Icon}
          iconColor="text-sky-600 dark:text-sky-400"
          iconBg="bg-sky-50 dark:bg-sky-500/10"
        />
        <StatCard
          label="Top Superchat"
          prefix="रू"
          value={metrics.max.toLocaleString()}
          subtext="Highest single donation"
          icon={Wallet01Icon}
          iconColor="text-violet-600 dark:text-violet-400"
          iconBg="bg-violet-50 dark:bg-violet-500/10"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Icon
            icon={Search01Icon}
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777B87] dark:text-[#949AA8]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supporter or message..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-[#181C28] border border-[#E5EAF1] dark:border-[#222736] focus:border-[#FF4D0A] rounded-xl text-xs text-[#1D1D20] dark:text-[#F4F5F8] placeholder-[#777B87] outline-none"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gateway Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#181C28] px-3 py-1.5 rounded-xl border border-[#E5EAF1] dark:border-[#222736] text-xs">
            <span className="text-[#777B87] dark:text-[#949AA8] font-medium">Gateway:</span>
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="bg-transparent text-[#1D1D20] dark:text-[#F4F5F8] font-semibold outline-none cursor-pointer"
            >
              <option value="all">All Gateways</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#181C28] px-3 py-1.5 rounded-xl border border-[#E5EAF1] dark:border-[#222736] text-xs">
            <span className="text-[#777B87] dark:text-[#949AA8] font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-[#1D1D20] dark:text-[#F4F5F8] font-semibold outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <span className="text-xs text-[#777B87] dark:text-[#949AA8] font-mono px-1">
            {filteredDonations.length} record{filteredDonations.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-[#131620] border border-[#E5EAF1] dark:border-[#222736] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF1] dark:border-[#222736] bg-slate-50/70 dark:bg-[#181C28]">
                {["Date", "Supporter", "Amount", "Gateway", "Status", "Message"].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3 text-xs text-[#777B87] dark:text-[#949AA8] uppercase tracking-wider font-bold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#222736] text-xs">
              {filteredDonations.length > 0 ? (
                filteredDonations.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#181C28]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[#777B87] dark:text-[#949AA8] font-mono whitespace-nowrap">
                      {new Date(d.created_at || d.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#1D1D20] dark:text-[#F4F5F8] whitespace-nowrap">
                      {d.supporter_name || d.supporterName || "Anonymous"}
                    </td>
                    <td className="px-5 py-3.5 font-bold font-mono text-[#FF4D0A] whitespace-nowrap">
                      रू {parseFloat(d.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-semibold uppercase text-[#1D1D20] dark:text-[#F4F5F8] whitespace-nowrap">
                      {d.gateway || "eSewa"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={d.status || "verified"} />
                    </td>
                    <td className="px-5 py-3.5 text-[#777B87] dark:text-[#949AA8] italic max-w-sm truncate">
                      {d.message ? `"${d.message}"` : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-xs text-[#777B87] dark:text-[#949AA8]"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#181C28] flex items-center justify-center text-[#777B87]">
                        <Icon icon={Invoice01Icon} size={20} />
                      </div>
                      <p className="font-semibold text-sm text-[#1D1D20] dark:text-[#F4F5F8]">
                        No transactions found
                      </p>
                      <p className="text-xs max-w-xs text-[#777B87] dark:text-[#949AA8]">
                        {searchQuery || selectedGateway !== "all" || selectedStatus !== "all"
                          ? "Try adjusting your search query or filters to find what you are looking for."
                          : "Donation transactions from your live stream will appear here automatically."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

