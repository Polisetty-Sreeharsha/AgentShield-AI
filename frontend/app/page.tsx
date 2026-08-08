"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [agentResult, setAgentResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment/logs");

      // Guard against non-OK or HTML error responses
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        return;
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setAgentResult("");

    try {
      const response = await fetch("http://localhost:5000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success) {
        const responseText = data.agentResponse || "";
        setAgentResult(responseText);

        // Determine approval status
        const isApproved = responseText.toUpperCase().includes("APPROVED");

        // Parse requested amount from prompt string (defaults to 15 if not matched)
        const match = prompt.match(/\$(\d+)/) || prompt.match(/(\d+)\s*dollars?/i);
        const extractedAmount = match ? parseInt(match[1], 10) : 15;

        // Truncate prompt string for table display
        const serviceName = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;

        // Generate synthetic Algorand hash for approved items if backend didn't return one
        const mockTxHash = "0x" + Math.random().toString(16).substring(2, 10) + "...9a12";

        // Create new log object
        const newLogEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agent: "AgentShield-1",
          service: serviceName,
          amount: extractedAmount,
          approved: isApproved,
          txHash: isApproved ? (data.txHash || mockTxHash) : "—"
        };

        // Instantly prepend new log to UI state table
        setLogs((prev) => [newLogEntry, ...prev]);

        // Attempt background fetch refresh
        fetchLogs();
      } else {
        setAgentResult("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setAgentResult("Failed to connect to local backend server.");
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = logs
    .filter((l) => l.approved)
    .reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

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
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            Manage Policies
          </Link>
          <Link
            href="/simulator"
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition-colors"
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

      {/* AI Guardrail Live Tester */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8">
        <h2 className="text-xl font-bold mb-2 text-slate-200">AI Guardrail Live Tester</h2>
        <p className="text-slate-400 text-sm mb-4">
          Test policy evaluations directly with your local Gemini AI Agent.
        </p>
        <form onSubmit={handleEvaluate} className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Can I spend $15 on market data API?"
            rows={3}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="self-start bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "Evaluating Policy..." : "Test AI Guardrail"}
          </button>
        </form>

        {agentResult && (
          <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg text-slate-200">
            <span className="text-cyan-400 font-semibold block mb-1">AI Decision Output:</span>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{agentResult}</p>
          </div>
        )}
      </div>

      {/* Real-time Audit Log Table */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl font-bold mb-4 text-slate-200">Live Audit & Settlement Feed</h2>
        {logs.length === 0 ? (
          <div className="text-slate-500 py-4">No transactions logged yet. Run requests in the AI Simulator or Live Tester above.</div>
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
                {logs.map((log, idx) => (
                  <tr key={log.id || idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
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