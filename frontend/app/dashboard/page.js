"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardRouter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoleAndRedirect = () => {
      const role = localStorage.getItem("userRole");
      
      if (!role) {
        router.push("/login");
        return;
      }

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard/user");
      }
    };

    // Use a tiny timeout to ensure smooth hydration and visual transition
    const timeout = setTimeout(checkRoleAndRedirect, 100);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Routing to your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
