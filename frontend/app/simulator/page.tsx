"use client";
import { useState } from "react";
import Link from "next/link";

export default function SimulatorPage() {
  const [agent, setAgent] = useState("Research Agent");
  const [service, setService] = useState("OpenAI API");
  const [amount, setAmount] = useState("15");
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, service, amount: Number(amount) })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">AI Agent Payment Simulator</h1>
        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-slate-200">Trigger AI Payment Request</h2>

          <div className="mb-4">
            <label className="block mb-2 text-slate-400">AI Agent Name</label>
            <input
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-slate-400">Target Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            >
              <option>OpenAI API</option>
              <option>Flight API</option>
              <option>AWS</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-slate-400">Requested Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            />
          </div>

          <button
            onClick={handleSimulate}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg"
          >
            Execute Payment Request
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4 text-slate-200">Execution Output</h2>
          {result ? (
            <div className={`p-4 rounded-lg border ${result.approved ? "bg-emerald-950/40 border-emerald-500" : "bg-red-950/40 border-red-500"}`}>
              <div className="text-lg font-bold mb-2">{result.approved ? "✅ APPROVED" : "❌ REJECTED"}</div>
              <p className="text-slate-300 mb-2"><strong>Reason:</strong> {result.message}</p>
              <p className="text-slate-300 mb-2"><strong>Agent:</strong> {result.agent}</p>
              <p className="text-slate-300 mb-2"><strong>Service:</strong> {result.service}</p>
              <p className="text-slate-300 mb-2"><strong>Amount:</strong> ${result.amount}</p>
              {result.txHash && (
                <div className="mt-4 p-2 bg-slate-950 rounded text-xs text-cyan-400 font-mono">
                  Algorand Tx: {result.txHash}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 italic">Run a request to evaluate policy rules...</div>
          )}
        </div>
      </div>
    </main>
  );
}