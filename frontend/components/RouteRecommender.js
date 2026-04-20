"use client";

import Card from "@/components/admin/Card";

export default function RouteRecommender({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-bold text-white mb-2">Smart Routing</h3>
        <p className="text-sm text-gray-400">No active routes generated for this event yet.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 border-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🗺️</span> Recommended Routes
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold uppercase tracking-widest">Live AI</span>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((route, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">{route.title}</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{route.eta} mins</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-2">
              {route.path.map((node, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-md ${
                    i === 0 ? "bg-blue-500/20 text-blue-300" : 
                    i === route.path.length - 1 ? "bg-green-500/20 text-green-300" : 
                    "bg-slate-700/50 text-slate-300"
                  }`}>
                    {node}
                  </span>
                  {i < route.path.length - 1 && <span className="text-gray-500">→</span>}
                </div>
              ))}
            </div>
            
            {route.accessible && (
              <p className="text-xs text-violet-300 mt-2 font-medium">♿ Accessible Route</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
