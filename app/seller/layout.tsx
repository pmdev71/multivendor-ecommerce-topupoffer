"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  LogOut,
  Menu,
  X,
  Bell,
  Store,
  TrendingUp,
} from "lucide-react";
import NeedNotificationComponent from "@/components/seller/need-notification";
import OrderNotificationComponent from "@/components/seller/order-notification";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [storeChecked, setStoreChecked] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    image?: string;
    storeName?: string;
  } | null>(null);
  const pathname = usePathname();

  const fetchUserInfo = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.success && data.user) {
        setUserInfo({
          name: data.user.name || "Seller",
          email: data.user.email || "",
          image: data.user.image,
          storeName: data.user.seller?.storeName,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleLogout = async () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Clear token from cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Disconnect socket if connected
    if (typeof window !== "undefined") {
      try {
        const { disconnectSocket } = await import("@/lib/socket-client");
        disconnectSocket();
      } catch (error) {
        console.error("Failed to disconnect socket:", error);
      }
    }

    // Redirect to login
    window.location.href = "/login";
  };

  const checkStoreStatus = async () => {
    try {
      const res = await fetch("/api/seller/store");
      const data = await res.json();

      if (!data.success || !data.seller) {
        // No store found, redirect to create store
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/create-store")
        ) {
          window.location.href = "/seller/create-store";
        }
        return;
      }

      if (!data.seller.storeName) {
        // Store name not set, redirect to create store
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/create-store")
        ) {
          window.location.href = "/seller/create-store";
        }
        return;
      }

      if (!data.seller.isApproved) {
        // Store not approved, redirect to waiting page
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/waiting-approval")
        ) {
          window.location.href = "/seller/waiting-approval";
        }
        return;
      }

      setStoreChecked(true);
    } catch (error) {
      console.error("Store status check error:", error);
      setStoreChecked(true); // Allow access on error
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      }
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    // Fetch user info
    fetchUserInfo();

    // Check store status (skip for create-store and waiting-approval pages)
    const currentPath = window.location.pathname;
    if (
      !currentPath.includes("/create-store") &&
      !currentPath.includes("/waiting-approval")
    ) {
      checkStoreStatus();
    } else {
      setStoreChecked(true);
    }

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Allow create-store and waiting-approval pages without layout check
  const isSpecialPage =
    pathname?.includes("/create-store") ||
    pathname?.includes("/waiting-approval");

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-12 w-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // For create-store and waiting-approval pages, render without layout
  if (isSpecialPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
    { icon: ShoppingCart, label: "Orders", href: "/seller/orders" },
    { icon: Package, label: "Products", href: "/seller/products" },
    { icon: MessageSquare, label: "Need Requests", href: "/seller/needs" },
    { icon: DollarSign, label: "Earnings", href: "/seller/earnings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : sidebarOpen ? 0 : -280,
        }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/seller/dashboard" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Seller Hub
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            {userInfo?.image ? (
              <img
                src={userInfo.image}
                alt={userInfo.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "S"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userInfo?.storeName || userInfo?.name || "Seller Account"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userInfo?.email || "seller@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              <Link
                href="/seller/earnings"
                className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">৳0</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Need Request Notifications */}
        <NeedNotificationComponent />
        {/* Order Notifications */}
        <OrderNotificationComponent />

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 Seller Hub. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
