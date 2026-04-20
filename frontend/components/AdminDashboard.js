"use client";

import Card from "@/components/admin/Card";

export default function AdminDashboard({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className={stat.isAlert ? "border-red-500/20 bg-red-500/5" : ""}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <h3 className={`text-3xl font-bold mt-2 ${stat.isAlert ? "text-red-400" : "text-white"}`}>
                  {stat.value}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">{stat.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Live Traffic Flow</h2>
          <div className="h-64 flex items-center justify-center border border-white/5 rounded-lg bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <p className="text-gray-500 z-10">[ Analytics Chart Placeholder ]</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-red-400 mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">High Density Detected</p>
                  <p className="text-xs text-gray-500 mt-1">Zone {i + 1} • 10 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
