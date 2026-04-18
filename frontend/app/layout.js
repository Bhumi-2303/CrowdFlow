import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "CrowdFlow — Live Venue Intelligence",
  description:
    "AI-powered real-time crowd density, wait times, and route recommendations for sports venues.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0f1e]">{children}</body>
    </html>
  );
}
