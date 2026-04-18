"use client";

import MapView from "./MapView";

/** Map density/traffic/risk levels to Tailwind color tokens */
const LEVEL_COLORS = {
  low:    { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
  medium: { bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-400",   badge: "bg-amber-500/20  text-amber-300"  },
  high:   { bg: "bg-rose-500/15",    border: "border-rose-500/40",    text: "text-rose-400",    badge: "bg-rose-500/20   text-rose-300"    },
  normal: { bg: "bg-sky-500/15",     border: "border-sky-500/40",     text: "text-sky-400",     badge: "bg-sky-500/20    text-sky-300"     },
  cool:   { bg: "bg-cyan-500/15",    border: "border-cyan-500/40",    text: "text-cyan-400",    badge: "bg-cyan-500/20   text-cyan-300"    },
  hot:    { bg: "bg-orange-500/15",  border: "border-orange-500/40",  text: "text-orange-400",  badge: "bg-orange-500/20 text-orange-300"  },
};

function levelColors(level = "medium") {
  return LEVEL_COLORS[level] ?? LEVEL_COLORS.medium;
}

function Badge({ label, level }) {
  const c = levelColors(level);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${c.badge}`}>
      {label}
    </span>
  );
}

function StatBlock({ icon, label, value, sub }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <span>{icon}</span>{label}
      </span>
      <span className="text-2xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

export default function StatusCard({ data }) {
  if (!data) return null;

  const { crowd_density, waiting_time, route, alerts, ai_insights, metadata, location, timestamp } = data;
  const densityColors = levelColors(crowd_density.level);
  const riskColors    = levelColors(ai_insights?.risk_level ?? "medium");
  const time          = new Date(timestamp * 1000).toLocaleTimeString();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-sm text-slate-400">Live · updated {time}</span>
        </div>
        <span className="text-xs text-slate-600 font-mono">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </span>
      </div>

      {/* ── Crowd Density ─────────────────────────────────────── */}
      <div className={`rounded-2xl border p-5 ${densityColors.bg} ${densityColors.border}`}>
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Crowd Density</p>
          <Badge label={crowd_density.level} level={crowd_density.level} />
        </div>

        {/* Density bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>0%</span><span>100%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${densityColors.text.replace("text-", "bg-")}`}
              style={{ width: `${crowd_density.value * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatBlock icon="📊" label="Density" value={`${Math.round(crowd_density.value * 100)}%`} />
          <StatBlock icon="⏱️" label="Wait" value={`${waiting_time.minutes} min`} />
          <StatBlock icon="🛤️" label="ETA" value={`${route.estimated_time} min`} sub={route.is_accessible ? "♿ Accessible" : ""} />
        </div>
      </div>

      {/* ── Conditions Row ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 flex flex-col gap-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider">🌤 Weather</p>
          <Badge label={metadata.weather} level={metadata.weather} />
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 flex flex-col gap-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider">🚦 Traffic</p>
          <Badge label={metadata.traffic} level={metadata.traffic} />
        </div>
      </div>

      {/* ── Route Path ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">📍 Recommended Route</p>
        <div className="flex items-center gap-1 flex-wrap">
          {route.path.map((stop, i) => (
            <div key={stop} className="flex items-center gap-1">
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{stop}</span>
              {i < route.path.length - 1 && <span className="text-slate-600 text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Map Visualization ─────────────────────────────────── */}
      <MapView
        lat={location.lat}
        lng={location.lng}
        density={crowd_density.value}
      />

      {/* ── AI Insights ───────────────────────────────────────── */}
      {ai_insights && (
        <div className={`rounded-2xl border p-5 ${riskColors.bg} ${riskColors.border}`}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">🤖 AI Insights</p>
            <Badge label={`Risk: ${ai_insights.risk_level}`} level={ai_insights.risk_level} />
          </div>
          <p className="text-sm text-slate-300 mb-3 italic">"{ai_insights.alert_message}"</p>
          <ul className="space-y-1.5">
            {ai_insights.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className={`mt-0.5 text-xs ${riskColors.text}`}>▸</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Active Alerts ─────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">🚨 Active Alerts</p>
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-rose-300">
              <Badge label={alert.severity} level="high" />
              <span className="mt-0.5">{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
