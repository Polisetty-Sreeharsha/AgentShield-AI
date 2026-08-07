export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            AgentShield AI Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            AI Spending Governance & Policy Management
          </p>
        </div>

        <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg font-semibold">
          + Create Policy
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-900 rounded-xl p-6">
          <h2 className="text-gray-400">Policies</h2>
          <p className="text-4xl font-bold mt-2">12</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h2 className="text-gray-400">Pending Requests</h2>
          <p className="text-4xl font-bold mt-2 text-yellow-400">5</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h2 className="text-gray-400">Approved Today</h2>
          <p className="text-4xl font-bold mt-2 text-green-400">21</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h2 className="text-gray-400">Rejected</h2>
          <p className="text-4xl font-bold mt-2 text-red-400">2</p>
        </div>

      </div>

      {/* Recent AI Requests */}
      <div className="bg-slate-900 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-5">
          Recent AI Requests
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th>AI Agent</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-700">
              <td className="py-4">Research Agent</td>
              <td>OpenAI API</td>
              <td>$15</td>
              <td className="text-yellow-400">Pending</td>
            </tr>

            <tr className="border-t border-slate-700">
              <td className="py-4">Travel Agent</td>
              <td>Flight API</td>
              <td>$120</td>
              <td className="text-green-400">Approved</td>
            </tr>

            <tr className="border-t border-slate-700">
              <td className="py-4">Marketing Agent</td>
              <td>Ads API</td>
              <td>$85</td>
              <td className="text-red-400">Rejected</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Blockchain */}
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Blockchain Audit
        </h2>

        <p className="text-gray-400">
          Latest Transaction Hash:
        </p>

        <p className="mt-2 text-cyan-400 break-all">
          ALG-0x8AF21B98372F5A9D22A1D9C7E
        </p>

        <p className="mt-3 text-green-400">
          ✔ Successfully stored on Algorand
        </p>
      </div>
    </main>
  );
}