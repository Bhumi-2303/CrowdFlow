"use client";

import MapView from "./MapView";

// ─────────────────────────────────────────────────────────────
// Density-based color system
// LOW → green (#22c55e) | MEDIUM → yellow (#eab308) | HIGH → red (#ef4444)
// ─────────────────────────────────────────────────────────────
const DENSITY_THEME = {
  low: {
    hex:        "#22c55e",
    glow:       "glow-low",
    border:     "border-[#22c55e]/40",
    bg:         "bg-[#22c55e]/10",
    text:       "text-[#22c55e]",
    badge:      "bg-[#22c55e]/20 text-[#22c55e]",
    barBg:      "bg-[#22c55e]",
    dotColor:   "bg-[#22c55e]",
    label:      "LOW",
  },
  medium: {
    hex:        "#eab308",
    glow:       "glow-medium",
    border:     "border-[#eab308]/40",
    bg:         "bg-[#eab308]/10",
    text:       "text-[#eab308]",
    badge:      "bg-[#eab308]/20 text-[#eab308]",
    barBg:      "bg-[#eab308]",
    dotColor:   "bg-[#eab308]",
    label:      "MEDIUM",
  },
  high: {
    hex:        "#ef4444",
    glow:       "glow-high",
    border:     "border-[#ef4444]/40",
    bg:         "bg-[#ef4444]/10",
    text:       "text-[#ef4444]",
    badge:      "bg-[#ef4444]/20 text-[#ef4444]",
    barBg:      "bg-[#ef4444]",
    dotColor:   "bg-[#ef4444]",
    label:      "HIGH",
  },
};

/** Map generic level strings to Tailwind tokens (weather, traffic, risk) */
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

function densityTheme(level = "medium") {
  return DENSITY_THEME[level] ?? DENSITY_THEME.medium;
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

/** Colored pill badge */
function Badge({ label, level }) {
  const c = levelColors(level);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${c.badge}`}>
      {label}
    </span>
  );
}

/** Density-themed pill badge */
function DensityBadge({ level }) {
  const t = densityTheme(level);
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-widest ${t.badge}`}
    >
      {t.label}
    </span>
  );
}

/** System Status Badge — top-right dot indicator */
function StatusBadge({ level }) {
  const t = densityTheme(level);
  const labels = { low: "Nominal", medium: "Elevated", high: "Critical" };
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`dot-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${t.dotColor}`}
        />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${t.dotColor}`} />
      </span>
      <span className={`text-xs font-semibold uppercase tracking-wider ${t.text}`}>
        {labels[level] ?? level}
      </span>
    </div>
  );
}

/** Stat block with label / value / sub-label hierarchy */
function StatBlock({ icon, label, value, sub }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <span>{icon}</span>{label}
      </span>
      <span className="text-xl font-semibold text-white">{value}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

/** Section heading */
function SectionLabel({ children }) {
  return (
    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

/** Group card wrapper with hover lift */
function GroupCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 card-hover ${className}`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function StatusCard({ data }) {
  if (!data) return null;

  const {
    crowd_density,
    waiting_time,
    route,
    alerts,
    ai_insights,
    metadata,
    location,
    timestamp,
  } = data;

  const dt        = densityTheme(crowd_density.level);
  const riskColors = levelColors(ai_insights?.risk_level ?? "medium");
  const time       = new Date(timestamp * 1000).toLocaleTimeString();

  // Filter high-severity alerts for special treatment
  const highAlerts   = alerts.filter((a) => a.severity === "high");
  const otherAlerts  = alerts.filter((a) => a.severity !== "high");

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">

      {/* ── Header bar ───────────────────────────────────────── */}
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

      {/* ── GROUP 1 · Crowd Density ───────────────────────────── */}
      <div
        className={`rounded-2xl border p-5 card-hover transition-all duration-300 ease-in-out
          ${dt.bg} ${dt.border} ${dt.glow}`}
      >
        {/* Card header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-lg font-bold text-white mb-0.5">Crowd Density</p>
            <p className="text-sm text-slate-400">Real-time occupancy level</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {/* System Status Badge */}
            <StatusBadge level={crowd_density.level} />
            <DensityBadge level={crowd_density.level} />
          </div>
        </div>

        {/* Density bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>0%</span><span>100%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-900 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-in-out ${dt.barBg}`}
              style={{ width: `${crowd_density.value * 100}%` }}
            />
          </div>
        </div>

        {/* Stats grid — 3 cols */}
        <div className="grid grid-cols-3 gap-4">
          <StatBlock
            icon="📊"
            label="Density"
            value={`${Math.round(crowd_density.value * 100)}%`}
          />
          <StatBlock
            icon="⏱️"
            label="Wait"
            value={`${waiting_time.minutes} min`}
          />
          <StatBlock
            icon="🛤️"
            label="Est. Time"
            value={`${route.estimated_time} min`}
            sub={route.is_accessible ? "♿ Accessible" : ""}
          />
        </div>
      </div>

      {/* ── GROUP 2 · Waiting Time + Route Info (responsive 2-col) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Waiting Time card */}
        <GroupCard>
          <SectionLabel>⏳ Waiting Time</SectionLabel>
          <div className="flex items-end gap-2">
            <span className="text-xl font-semibold text-white">
              {waiting_time.minutes} min
            </span>
            <span className="text-sm text-slate-400 mb-0.5">estimated wait</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-700 ease-in-out"
              style={{ width: `${Math.min((waiting_time.minutes / 30) * 100, 100)}%` }}
            />
          </div>
        </GroupCard>

        {/* Route Info card */}
        <GroupCard>
          <SectionLabel>🛤️ Route Info</SectionLabel>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-xl font-semibold text-white">
              {route.estimated_time} min
            </span>
            <span className="text-sm text-slate-400 mb-0.5">ETA</span>
          </div>
          {route.is_accessible && (
            <span className="inline-block bg-violet-500/20 text-violet-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              ♿ Accessible Route
            </span>
          )}
        </GroupCard>

      </div>

      {/* ── GROUP 3 · Conditions (Weather + Traffic) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GroupCard>
          <SectionLabel>🌤 Weather</SectionLabel>
          <Badge label={metadata.weather} level={metadata.weather} />
        </GroupCard>
        <GroupCard>
          <SectionLabel>🚦 Traffic</SectionLabel>
          <Badge label={metadata.traffic} level={metadata.traffic} />
        </GroupCard>
      </div>

      {/* ── Recommended Route path ────────────────────────────── */}
      <GroupCard>
        <SectionLabel>📍 Recommended Route</SectionLabel>
        <div className="flex items-center gap-1 flex-wrap">
          {route.path.map((stop, i) => (
            <div key={stop} className="flex items-center gap-1">
              <span className="bg-slate-700/80 text-slate-300 text-xs px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-slate-600">
                {stop}
              </span>
              {i < route.path.length - 1 && (
                <span className="text-slate-600 text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </GroupCard>

      {/* ── Map Visualization ─────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-slate-700/50 card-hover">
        <MapView
          lat={location.lat}
          lng={location.lng}
          density={crowd_density.value}
        />
      </div>

      {/* ── GROUP 4 · AI Insights ─────────────────────────────── */}
      {ai_insights && (
        <div
          className={`rounded-2xl border p-5 card-hover transition-all duration-300 ease-in-out
            ${riskColors.bg} ${riskColors.border}`}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-lg font-bold text-white">🤖 AI Insights</p>
            <Badge label={`Risk: ${ai_insights.risk_level}`} level={ai_insights.risk_level} />
          </div>
          <p className="text-sm text-slate-300 mb-4 italic leading-relaxed">
            &ldquo;{ai_insights.alert_message}&rdquo;
          </p>
          <ul className="space-y-2">
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
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            🚨 Active Alerts
          </p>

          {/* High-severity alerts — pulsing red border */}
          {highAlerts.map((alert, i) => (
            <div
              key={`high-${i}`}
              className="rounded-2xl border border-[#ef4444]/60 bg-[#ef4444]/10 p-4 alert-pulse transition-all duration-300 ease-in-out hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="relative flex h-2.5 w-2.5 mt-1">
                    <span className="dot-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={alert.severity} level="high" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">High Severity</span>
                  </div>
                  <p className="text-sm font-semibold text-red-200">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Other alerts — standard style */}
          {otherAlerts.map((alert, i) => (
            <div
              key={`other-${i}`}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-4 card-hover transition-all duration-300 ease-in-out hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={alert.severity} level={alert.severity} />
                  </div>
                  <p className="text-sm text-slate-300">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
