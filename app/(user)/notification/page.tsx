"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/card";
import { Bell, CheckCircle2, Clock, XCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Job Application Accepted",
    message: "Your application for Web Developer position has been accepted.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Message",
    message: "You have a new message from Tech Solutions Inc.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Payment Pending",
    message: "Your withdrawal request is pending review.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Project Completed",
    message: "Your project Web Development has been marked as completed.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "error",
    title: "Application Rejected",
    message: "Your application for UI Designer position was not selected.",
    time: "3 days ago",
    read: true,
  },
];

const typeIcons = {
  success: CheckCircle2,
  info: Info,
  warning: Clock,
  error: XCircle,
};

const typeColors = {
  success: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  info: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
  error: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
};

const cardBgColors = {
  success: "border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50/80 to-emerald-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900",
  info: "border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-indigo-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900",
  warning: "border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 via-amber-50/80 to-amber-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900",
  error: "border-2 border-red-200 bg-gradient-to-br from-red-50 via-rose-50/80 to-rose-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900",
};

export default function NotificationPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Stay updated with all your account activities and updates.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const Icon = typeIcons[notification.type];
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`${cardBgColors[notification.type]} ${notification.read ? "opacity-75" : ""}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${typeColors[notification.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No notifications yet</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

