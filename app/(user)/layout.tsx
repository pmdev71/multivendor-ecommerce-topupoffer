"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { Menu, Bell, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/providers/theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 min-w-0 overflow-x-hidden transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Bar */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80 transition-all duration-300 ${
            sidebarCollapsed ? "md:left-20" : "md:left-64"
          } ${
            sidebarCollapsed
              ? "md:w-[calc(100%-5rem)]"
              : "md:w-[calc(100%-16rem)]"
          }`}
        >
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
            {/* Left Side - Logo and Text (Mobile) / Logo (Desktop) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Logo/Site Name - Visible on all screens */}
              <div className="flex items-center">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  ModernUI
                </h1>
              </div>
            </div>

            {/* Right Side - Theme Toggle, Bell, Profile, Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Theme Toggle - Hidden on mobile, visible on desktop */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="hidden md:flex rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </motion.button>

              {/* Notification Bell - Visible on all screens */}
              <div className="relative">
                <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500"></span>
                </button>
              </div>

              {/* Profile Avatar - Visible on all screens */}
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
              </button>

              {/* Menu Button - Only visible on mobile */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <motion.div
                  animate={{ rotate: sidebarOpen ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 w-full max-w-full p-3 sm:p-4 md:p-6 overflow-x-hidden pt-20 sm:pt-20 md:pt-24">
            {children}
          </main>
          {/* Footer */}
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

