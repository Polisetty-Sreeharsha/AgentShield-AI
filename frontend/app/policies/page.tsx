"use client";
import { useState } from "react";
import Link from "next/link";

export default function PoliciesPage() {
  const [name, setName] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [service, setService] = useState("OpenAI API");
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    if (!name || !maxAmount) return;
    try {
      const res = await fetch("http://localhost:5000/api/payment/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, maxAmount: Number(maxAmount), service })
      });
      if (res.ok) {
        setStatus("Policy saved successfully!");
        setName("");
        setMaxAmount("");
      }
    } catch (err) {
      setStatus("Error saving policy");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">Spending Policies</h1>
        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl max-w-3xl border border-slate-800">
        {status && <div className="mb-4 p-3 bg-cyan-950 border border-cyan-500 text-cyan-300 rounded">{status}</div>}

        <div className="mb-5">
          <label className="block mb-2 text-slate-300">Policy Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            placeholder="OpenAI Budget"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-slate-300">Maximum Amount ($)</label>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            placeholder="100"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-slate-300">Allowed Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
          >
            <option>OpenAI API</option>
            <option>Flight API</option>
            <option>AWS</option>
            <option>Google Cloud</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-cyan-500 hover:bg-cyan-600 font-semibold px-6 py-3 rounded-lg text-slate-950 transition"
        >
          Save Policy
        </button>
      </div>
    </main>
  );
}