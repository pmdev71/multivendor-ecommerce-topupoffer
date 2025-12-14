"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  PlusCircle,
  Briefcase,
  FolderKanban,
  Wallet,
  ArrowUpCircle,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/providers/theme-provider";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Find Work", href: "/find-work" },
  { icon: PlusCircle, label: "Create Job", href: "/create-job" },
  { icon: Briefcase, label: "My Jobs", href: "/my-jobs" },
  { icon: FolderKanban, label: "My Work", href: "/my-work" },
  { icon: Wallet, label: "Deposit", href: "/deposit" },
  { icon: ArrowUpCircle, label: "Withdraw", href: "/withdraw" },
  { icon: UserPlus, label: "Referral", href: "/referral" },
  { icon: Bell, label: "Notification", href: "/notification" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({
  isMobileOpen = false,
  onMobileClose,
  onCollapseChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={handleClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-screen bg-white shadow-lg transition-transform duration-300 dark:bg-gray-900
          ${isMobileOpen ? "translate-x-0" : "translate-x-full"} 
          md:translate-x-0 md:fixed md:top-0 md:left-0 md:h-screen md:z-30 md:shrink-0
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
            {!isCollapsed && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                Dashboard
              </motion.h2>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCollapseToggle}
                className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:block"
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={handleClick}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={handleClick}
                      className={`
                        group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                        }`}
                      />
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-2 dark:border-gray-800">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-gray-500" />
              ) : (
                <Sun className="h-5 w-5 text-gray-500" />
              )}
              {!isCollapsed && (
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              )}
            </motion.button>

            {/* Logout */}
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <LogOut className="h-5 w-5 text-gray-500" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
