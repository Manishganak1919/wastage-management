"use client";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebar, setSidebar] = useState(false);
  const [totalEarning, setTotalEarning] = useState(0);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/**header */}
          <Header
            onMenuClick={() => setSidebar(!sidebar)}
            totalEarnings={totalEarning}
          />
          <div className="flex flex-1">
            <Sidebar open={sidebar} />
            <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
