'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket-client';
import {
  MessageSquare,
  X,
  Package,
  Phone,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface NeedNotification {
  needId: string;
  needNumber?: string;
  productId: string;
  productName?: string;
  operator: string;
  mobileNumber: string;
  quantity: number;
  message: string;
  timestamp: Date;
}

export default function NeedNotificationComponent() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NeedNotification[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const { socket, isConnected } = useSocket(token);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new need requests
    socket.on('need:new', (data: NeedNotification) => {
      console.log('📬 New need request received:', data);
      setNotifications((prev) => [data, ...prev]);

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Need Request', {
          body: `${data.operator} - ${data.mobileNumber} | Qty: ${data.quantity}`,
          icon: '/favicon.ico',
        });
      }
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('need:new');
    };
  }, [socket, isConnected]);

  const handleViewNeed = (needId: string) => {
    router.push(`/seller/needs?needId=${needId}`);
    removeNotification(needId);
  };

  const removeNotification = (needId: string) => {
    setNotifications((prev) => prev.filter((n) => n.needId !== needId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.needId}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  New Need Request
                </h3>
                {notification.needNumber && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                    {notification.needNumber}
                  </p>
                )}
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {notification.productName && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{notification.productName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>{notification.operator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{notification.mobileNumber} | Qty: {notification.quantity}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleViewNeed(notification.needId)}
                    className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    View & Offer
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeNotification(notification.needId)}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

