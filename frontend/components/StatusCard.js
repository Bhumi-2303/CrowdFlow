"use client";

import MapView from "./MapView";

// ─────────────────────────────────────────────────────────────
// Density color system
// low → emerald-400 | medium → amber-400 | high → rose-500
// ─────────────────────────────────────────────────────────────
const DENSITY = {
  low: {
    glow: "glow-low",
    borderDk: "border-emerald-400/40",
    borderLt: "border-emerald-500/30",
    bgDk: "bg-emerald-400/10",
    bgLt: "bg-emerald-50",
    textColor: "text-emerald-400",
    barColor: "bg-emerald-400",
    badgeDk: "bg-emerald-400/20 text-emerald-300",
    badgeLt: "bg-emerald-100 text-emerald-700",
    dotColor: "bg-emerald-400",
    statusLabel: "Nominal",
    densityLabel: "LOW",
    hex: "#34d399",
  },
  medium: {
    glow: "glow-medium",
    borderDk: "border-amber-400/40",
    borderLt: "border-amber-400/30",
    bgDk: "bg-amber-400/10",
    bgLt: "bg-amber-50",
    textColor: "text-amber-400",
    barColor: "bg-amber-400",
    badgeDk: "bg-amber-400/20 text-amber-300",
    badgeLt: "bg-amber-100 text-amber-700",
    dotColor: "bg-amber-400",
    statusLabel: "Elevated",
    densityLabel: "MEDIUM",
    hex: "#fbbf24",
  },
  high: {
    glow: "glow-high",
    borderDk: "border-rose-500/50",
    borderLt: "border-rose-400/40",
    bgDk: "bg-rose-500/10",
    bgLt: "bg-rose-50",
    textColor: "text-rose-400",
    barColor: "bg-rose-500",
    badgeDk: "bg-rose-500/20 text-rose-300",
    badgeLt: "bg-rose-100 text-rose-700",
    dotColor: "bg-rose-500",
    statusLabel: "Critical",
    densityLabel: "HIGH",
    hex: "#f87171",
  },
};

const LEVEL_COLORS = {
  low: { borderDk: "border-emerald-500/40", bgDk: "bg-emerald-500/10", badgeDk: "bg-emerald-500/20 text-emerald-300", badgeLt: "bg-emerald-100 text-emerald-700", textColor: "text-emerald-400" },
  medium: { borderDk: "border-amber-500/40", bgDk: "bg-amber-500/10", badgeDk: "bg-amber-500/20 text-amber-300", badgeLt: "bg-amber-100 text-amber-700", textColor: "text-amber-400" },
  high: { borderDk: "border-rose-500/40", bgDk: "bg-rose-500/10", badgeDk: "bg-rose-500/20 text-rose-300", badgeLt: "bg-rose-100 text-rose-700", textColor: "text-rose-400" },
  normal: { borderDk: "border-sky-500/40", bgDk: "bg-sky-500/10", badgeDk: "bg-sky-500/20 text-sky-300", badgeLt: "bg-sky-100 text-sky-700", textColor: "text-sky-400" },
  cool: { borderDk: "border-cyan-500/40", bgDk: "bg-cyan-500/10", badgeDk: "bg-cyan-500/20 text-cyan-300", badgeLt: "bg-cyan-100 text-cyan-700", textColor: "text-cyan-400" },
  hot: { borderDk: "border-orange-500/40", bgDk: "bg-orange-500/10", badgeDk: "bg-orange-500/20 text-orange-300", badgeLt: "bg-orange-100 text-orange-700", textColor: "text-orange-400" },
};

function getDensity(level) { return DENSITY[level] ?? DENSITY.medium; }
function getLevel(level) { return LEVEL_COLORS[level] ?? LEVEL_COLORS.medium; }

// ─────────────────────────────────────────────────────────────
// Sub-components — all theme-aware via `isDark` prop
// ─────────────────────────────────────────────────────────────

/** Generic level pill badge */
function Badge({ label, level, isDark }) {
  const c = getLevel(level);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide
      ${isDark ? c.badgeDk : c.badgeLt}`}>
      {label}
    </span>
  );
}

/** Density-specific pill badge */
function DensityBadge({ level, isDark }) {
  const d = getDensity(level);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-widest
      ${isDark ? d.badgeDk : d.badgeLt}`}>
      {d.densityLabel}
    </span>
  );
}

/** Animated dot + label status indicator */
function StatusBadge({ level, isDark }) {
  const d = getDensity(level);
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className={`dot-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${d.dotColor}`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${d.dotColor}`} />
      </span>
      <span className={`text-xs font-semibold uppercase tracking-wider ${d.textColor}`}>
        {d.statusLabel}
      </span>
    </div>
  );
}

/** Three-level typography: label / value / sub */
function StatBlock({ icon, label, value, sub, isDark }) {
  const labelCls = isDark ? "text-slate-400" : "text-slate-500";
  const valueCls = isDark ? "text-white" : "text-slate-900";
  const subCls = isDark ? "text-slate-400" : "text-slate-500";
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-sm uppercase tracking-wider flex items-center gap-1.5 ${labelCls}`}>
        <span>{icon}</span>{label}
      </span>
      <span className={`text-2xl font-bold ${valueCls}`}>{value}</span>
      {sub && <span className={`text-xs ${subCls}`}>{sub}</span>}
    </div>
  );
}

/** Section card wrapper — glassmorphism */
function GlassCard({ children, className = "", isDark, extraBorder = "" }) {
  const glass = isDark ? "glass-dark" : "glass-light";
  const border = extraBorder || (isDark ? "border-white/10" : "border-white/80");
  return (
    <div className={`rounded-2xl ${glass} border ${border} p-5 card-hover transition-all duration-300 ease-in-out hover:scale-[1.02] animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

/** Section heading */
function SectionLabel({ children, isDark }) {
  const cls = isDark ? "text-slate-400" : "text-slate-500";
  return (
    <p className={`text-sm font-semibold uppercase tracking-wider mb-3 ${cls}`}>
      {children}
    </p>
  );
}

/** Predictive Intelligence Card */
function PredictionCard({ prediction, isDark }) {
  if (!prediction) return null;
  const { value, level, recommendation, time_horizon } = prediction;
  const isHigh = level === "high";

  // If high: red glowing card, bold warning text
  const extraCls = isHigh ? `alert-pulse ${isDark ? "border-rose-500/60 bg-rose-500/10" : "border-rose-400 bg-rose-50"}` : "";
  const textCls = isHigh ? "text-rose-500 font-extrabold" : (isDark ? "text-slate-300" : "text-slate-700");

  return (
    <GlassCard isDark={isDark} className={`flex flex-col gap-3 ${extraCls}`}>
      <div className="flex items-center justify-between">
        <SectionLabel isDark={isDark}>🔮 Predicted Crowd ({time_horizon})</SectionLabel>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter ${isDark ? "bg-violet-500/20 text-violet-400" : "bg-violet-100 text-violet-600"}`}>
          AI Prediction
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            {Math.round(value * 100)}%
          </span>
          <Badge label={level} level={level} isDark={isDark} />
        </div>

        <div className="flex-1 border-l border-slate-700/30 pl-6">
          <p className={`text-sm leading-snug ${textCls}`}>
            {recommendation}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

/** Individual Zone card */
function ZoneCard({ zone, isDark }) {
  const { name, crowd_density, waiting_time, prediction } = zone;
  const isHighest = crowd_density.value >= 0.8;
  const border = isHighest && !isDark ? "border-rose-300" : (isHighest && isDark ? "border-rose-500/50" : "");
  const shadow = isHighest ? (isDark ? "shadow-[0_0_15px_rgba(244,63,94,0.2)]" : "shadow-md") : "";

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-400 hover:scale-[1.02] cursor-default animate-fade-in
      ${isDark ? "bg-slate-800/40 border-white/5 hover:bg-slate-800/60" : "bg-white border-slate-200 hover:shadow-lg"}
      ${border} ${shadow}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            {name}
            {isHighest && <span className="ml-2 text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Peak</span>}
          </h4>
          <p className={`text-[10px] font-medium uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>Real-time Monitoring</p>
        </div>
        <StatusBadge level={crowd_density.level} isDark={isDark} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}>Wait Time</span>
          <span className={`text-xl font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{waiting_time.minutes} min</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? "text-slate-500" : "text-slate-400"}`}>Predicted</span>
          <Badge label={prediction.level} level={prediction.level} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function StatusCard({ data, theme = "dark" }) {
  if (!data) return null;

  const {
    crowd_density,
    waiting_time,
    route,
    alerts,
    ai_insights,
    prediction,
    zones,
    metadata,
    location,
    timestamp,
  } = data;

  const isDark = theme === "dark";
  const d = getDensity(crowd_density.level);
  const riskLevel = getLevel(ai_insights?.risk_level ?? "medium");
  const time = new Date(timestamp * 1000).toLocaleTimeString();

  const highAlerts = alerts.filter((a) => a.severity === "high");
  const otherAlerts = alerts.filter((a) => a.severity !== "high");

  // Text tokens
  const primaryText = isDark ? "text-white" : "text-slate-900";
  const secondaryText = isDark ? "text-slate-400" : "text-slate-500";
  const monoText = isDark ? "text-slate-600" : "text-slate-400";
  const trackBg = isDark ? "bg-slate-900" : "bg-slate-200";
  const routeStopBg = isDark
    ? "bg-slate-700/80 text-slate-300 hover:bg-slate-600"
    : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">

      {/* ── Live indicator row ─────────────────────────────────── */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className={`text-sm ${secondaryText}`}>Live · updated {time}</span>
        </div>
        <span className={`text-xs font-mono ${monoText}`}>
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </span>
      </div>

      {/* ── GRID START ────────────────────────────────────────────
          Full-width: Crowd Density
          2-col below: Waiting Time | Route Info
          2-col below: Weather | Traffic
      ────────────────────────────────────────────────────────── */}

      {/* ── GROUP 1 · Crowd Density (full width, gradient bg) ───── */}
      <div
        className={`rounded-2xl border p-6 card-hover transition-all duration-300 ease-in-out hover:scale-[1.01] animate-fade-in
          ${isDark ? d.borderDk : d.borderLt}
          ${isDark ? d.bgDk : d.bgLt}
          ${d.glow}
          bg-gradient-to-br from-violet-500/10 to-blue-500/10`}
      >
        {/* Card header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className={`text-lg font-semibold mb-0.5 ${primaryText}`}>Crowd Density</p>
            <p className={`text-sm ${secondaryText}`}>Real-time occupancy level</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge level={crowd_density.level} isDark={isDark} />
            <DensityBadge level={crowd_density.level} isDark={isDark} />
          </div>
        </div>

        {/* Density bar */}
        <div className="mb-6">
          <div className={`flex justify-between text-xs mb-1.5 ${secondaryText}`}>
            <span>0%</span><span>100%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${trackBg}`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-in-out ${d.barColor}`}
              style={{ width: `${crowd_density.value * 100}%` }}
            />
          </div>
        </div>

        {/* 3-col stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatBlock icon="📊" label="Density" value={`${Math.round(crowd_density.value * 100)}%`} isDark={isDark} />
          <StatBlock icon="⏱️" label="Wait" value={`${waiting_time.minutes} min`} isDark={isDark} />
          <StatBlock icon="🛤️" label="Est. Time" value={`${route.estimated_time} min`} sub={route.is_accessible ? "♿ Accessible" : ""} isDark={isDark} />
        </div>
      </div>

      {/* ── Predictive Intelligence ─────────────────────────────── */}
      <PredictionCard prediction={prediction} isDark={isDark} />

      {/* ── GROUP 2 · Waiting Time + Route Info (2-col) ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Waiting Time */}
        <GlassCard isDark={isDark}>
          <SectionLabel isDark={isDark}>⏳ Waiting Time</SectionLabel>
          <div className="flex items-end gap-2 mb-4">
            <span className={`text-2xl font-bold ${primaryText}`}>{waiting_time.minutes} min</span>
            <span className={`text-sm mb-0.5 ${secondaryText}`}>estimated wait</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${trackBg}`}>
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-700 ease-in-out"
              style={{ width: `${Math.min((waiting_time.minutes / 30) * 100, 100)}%` }}
            />
          </div>
        </GlassCard>

        {/* Route Info */}
        <GlassCard isDark={isDark}>
          <SectionLabel isDark={isDark}>🛤️ Route Info</SectionLabel>
          <div className="flex items-end gap-2 mb-4">
            <span className={`text-2xl font-bold ${primaryText}`}>{route.estimated_time} min</span>
            <span className={`text-sm mb-0.5 ${secondaryText}`}>ETA</span>
          </div>
          {route.is_accessible && (
            <span className="inline-block bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full font-semibold">
              ♿ Accessible Route
            </span>
          )}
        </GlassCard>

      </div>

      {/* ── GROUP 3 · Weather + Traffic (2-col) ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard isDark={isDark}>
          <SectionLabel isDark={isDark}>🌤 Weather</SectionLabel>
          <Badge label={metadata.weather} level={metadata.weather} isDark={isDark} />
        </GlassCard>
        <GlassCard isDark={isDark}>
          <SectionLabel isDark={isDark}>🚦 Traffic</SectionLabel>
          <Badge label={metadata.traffic} level={metadata.traffic} isDark={isDark} />
        </GlassCard>
      </div>

      {/* ── Recommended Route ─────────────────────────────────────── */}
      <GlassCard isDark={isDark}>
        <SectionLabel isDark={isDark}>📍 Recommended Route</SectionLabel>
        <div className="flex items-center gap-1.5 flex-wrap">
          {route.path.map((stop, i) => (
            <div key={stop} className="flex items-center gap-1.5">
              <span className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out cursor-default ${routeStopBg}`}>
                {stop}
              </span>
              {i < route.path.length - 1 && (
                <span className={`text-xs ${secondaryText}`}>→</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Map Visualization ─────────────────────────────────────── */}
      <div className={`rounded-2xl overflow-hidden border card-hover animate-fade-in ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <MapView
          lat={location.lat}
          lng={location.lng}
          density={crowd_density.value}
          zones={zones}
        />
      </div>

      {/* ── Zone Intelligence ─────────────────────────────────────── */}
      {zones && zones.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <SectionLabel isDark={isDark}>📍 Zone Intelligence</SectionLabel>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-600" : "text-slate-300"}`}>
              {zones.length} Active Zones
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone, i) => (
              <ZoneCard key={i} zone={zone} isDark={isDark} />
            ))}
          </div>
        </div>
      )}

      {/* ── GROUP 4 · AI Insights (full width) ───────────────────── */}
      {ai_insights && (
        <div
          className={`rounded-2xl border p-6 card-hover transition-all duration-300 ease-in-out hover:scale-[1.01] animate-fade-in
            bg-gradient-to-br from-violet-500/10 to-blue-500/10
            ${isDark ? `${riskLevel.borderDk} ${riskLevel.bgDk}` : "border-slate-200 bg-white/90"}`}
        >
          <div className="flex items-start justify-between mb-4">
            <p className={`text-lg font-semibold ${primaryText}`}>🤖 AI Insights</p>
            <Badge label={`Risk: ${ai_insights.risk_level}`} level={ai_insights.risk_level} isDark={isDark} />
          </div>
          <p className={`text-sm mb-4 italic leading-relaxed ${secondaryText}`}>
            &ldquo;{ai_insights.alert_message}&rdquo;
          </p>
          <ul className="space-y-2">
            {ai_insights.recommendations.map((rec, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <span className={`mt-0.5 text-xs ${riskLevel.textColor}`}>▸</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Active Alerts ─────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <p className={`text-sm font-semibold uppercase tracking-wider ${secondaryText}`}>
            🚨 Active Alerts
          </p>

          {/* High-severity: red glow pulse */}
          {highAlerts.map((alert, i) => (
            <div
              key={`high-${i}`}
              className="rounded-2xl border border-rose-500/60 bg-rose-500/10 p-5 alert-pulse transition-all duration-300 ease-in-out hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="relative flex h-3 w-3">
                    <span className="dot-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge label="HIGH" level="high" isDark={isDark} />
                    <span className={`text-xs uppercase tracking-wider ${secondaryText}`}>Critical Severity</span>
                  </div>
                  <p className="text-sm font-semibold text-rose-200">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Other alerts: standard glass card */}
          {otherAlerts.map((alert, i) => (
            <GlassCard key={`other-${i}`} isDark={isDark}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge label={alert.severity} level={alert.severity} isDark={isDark} />
                  </div>
                  <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{alert.message}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

    </div>
  );
}
{/* ───────────── ZONE INTELLIGENCE ───────────── */ }
{
  data?.zones && data.zones.length > 0 && (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-white mb-4">
        Zone Intelligence
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.zones.map((zone, index) => {
          const level = zone.crowd_density.level;

          const color =
            level === "low"
              ? "border-green-400"
              : level === "medium"
                ? "border-yellow-400"
                : "border-red-400";

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${color} bg-[#111827] hover:scale-[1.02] transition-all`}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {zone.name}
              </h3>

              <p className="text-sm text-slate-400">
                Density:{" "}
                <span className="font-semibold text-white">
                  {zone.crowd_density.level}
                </span>
              </p>

              <p className="text-sm text-slate-400">
                Wait Time:{" "}
                <span className="font-semibold text-white">
                  {zone.waiting_time.minutes} min
                </span>
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Prediction:{" "}
                <span className="font-semibold text-white">
                  {zone.prediction.level}
                </span>
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {zone.prediction.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  )
}