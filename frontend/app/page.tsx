"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalSpent = logs
    .filter((l) => l.approved)
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">AgentShield AI</h1>
          <p className="text-slate-400">Autonomous AI Agent Payment Policy & Settlement Shield</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/policies"
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg border border-slate-700"
          >
            Manage Policies
          </Link>
          <Link
            href="/simulator"
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2 rounded-lg"
          >
            AI Simulator
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-white">{logs.length}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Approved Spending</div>
          <div className="text-3xl font-bold text-emerald-400">${totalSpent}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-1">Settlement Network</div>
          <div className="text-3xl font-bold text-cyan-400">Algorand / x402</div>
        </div>
      </div>

      {/* Real-time Audit Log Table */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl font-bold mb-4 text-slate-200">Live Audit & Settlement Feed</h2>
        {logs.length === 0 ? (
          <div className="text-slate-500 py-4">No transactions logged yet. Run requests in the AI Simulator.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="p-3">Time</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Algorand Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-3 text-slate-400 text-sm">{log.timestamp}</td>
                    <td className="p-3 font-medium text-slate-200">{log.agent}</td>
                    <td className="p-3 text-slate-300">{log.service}</td>
                    <td className="p-3 text-slate-200">${log.amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          log.approved
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-red-950 text-red-400 border border-red-800"
                        }`}
                      >
                        {log.approved ? "APPROVED" : "REJECTED"}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-cyan-400">
                      {log.txHash ? log.txHash : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}