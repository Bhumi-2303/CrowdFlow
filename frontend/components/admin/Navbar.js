"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/");
  };

  return (
    <header className="h-16 glass-dark border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center">
        {/* Breadcrumb or Title placeholder if needed */}
      </div>
      <div className="flex items-center space-x-5">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <span className="text-xl">🔔</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full dot-ping"></span>
        </button>
        <div className="h-8 border-l border-white/10"></div>
        <button className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-white/10">
            A
          </div>
          <span>Admin User</span>
        </button>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors ml-4"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
