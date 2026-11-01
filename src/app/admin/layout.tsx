import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Console | TheGamerX",
  description: "Manage homepage sections, hero slides, and website content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {children}
    </div>
  );
}

