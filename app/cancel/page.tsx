"use client";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-yellow-400 font-bold">
          ← Back to Store
        </a>

        <h1 className="text-5xl font-black text-yellow-400 mt-8 mb-4">
          TRIFEBEATS ADMIN
        </h1>

        <p className="text-gray-400 mb-10">
          Admin dashboard is loading cleanly.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6">
            <p className="text-gray-400">Beats Uploaded</p>
            <h2 className="text-4xl font-black text-yellow-400 mt-2">4</h2>
          </div>

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6">
            <p className="text-gray-400">Orders</p>
            <h2 className="text-4xl font-black text-yellow-400 mt-2">0</h2>
          </div>

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6">
            <p className="text-gray-400">Revenue</p>
            <h2 className="text-4xl font-black text-yellow-400 mt-2">$0</h2>
          </div>
        </div>
      </div>
    </main>
  );
}