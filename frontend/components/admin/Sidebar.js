"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Events", href: "/admin/events", icon: "🎉" },
    { name: "Venues", href: "/admin/venues", icon: "🏢" },
    { name: "Zones", href: "/admin/zones", icon: "📍" },
    { name: "Monitoring", href: "/admin/monitoring", icon: "👁️" },
  ];

  return (
    <aside className="w-64 glass-dark border-r border-white/10 h-screen sticky top-0 flex flex-col py-6">
      <div className="mb-8 px-6">
        <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          CrowdFlow
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-6 py-4 border-t border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            ✓
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-200">System Normal</span>
            <span className="text-xs text-gray-500">All services up</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
