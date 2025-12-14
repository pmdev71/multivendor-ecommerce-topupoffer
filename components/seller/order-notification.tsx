'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/socket-client';
import {
  ShoppingCart,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderNotification {
  orderId: string;
  orderNumber: string;
  customerId: string;
  productId: string;
  totalAmount: number;
  message: string;
  timestamp: Date | string;
  createdAt: Date;
}

export default function OrderNotificationComponent() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const { socket, isConnected } = useSocket(token);
  const [pendingOrders, setPendingOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Get token from localStorage
    const getToken = () => {
      if (typeof window === 'undefined') return null;
      
      // Try localStorage first
      let storedToken = localStorage.getItem('token');
      
      // If not found, try cookies
      if (!storedToken && typeof document !== 'undefined') {
        const cookieToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];
        storedToken = cookieToken || null;
      }
      
      return storedToken;
    };
    
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      console.log('🔑 Order Notification: Token found, initializing socket...');
    } else {
      console.warn('⚠️ Order Notification: No token found. Seller might not be logged in.');
    }
  }, []);

  useEffect(() => {
    if (!token) {
      console.log('⚠️ Order Notification: No token available');
      return;
    }

    if (!socket) {
      console.log('⚠️ Order Notification: Socket not initialized yet');
      return;
    }

    if (!isConnected) {
      console.log('⚠️ Order Notification: Socket not connected yet', { 
        socketId: socket.id,
        connected: socket.connected 
      });
      return;
    }

    console.log('✅ Order Notification: Socket connected, listening for orders...', {
      socketId: socket.id,
      connected: socket.connected,
    });

    // Listen for new orders
    const handleNewOrder = (data: OrderNotification) => {
      console.log('📦 New order received:', data);
      const notification: OrderNotification = {
        ...data,
        timestamp: data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp),
        createdAt: new Date(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setPendingOrders((prev) => new Set(prev).add(data.orderId));

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order Received', {
          body: `Order ${data.orderNumber} - ${formatPrice(data.totalAmount)}`,
          icon: '/favicon.ico',
        });
      }
    };

    socket.on('order:new', handleNewOrder);

    // Listen for order status changes (accept/reject)
    socket.on('order:status_changed', (data: { orderId: string; status: string }) => {
      if (data.status === 'assigned' || data.status === 'cancelled') {
        // Remove from pending orders
        setPendingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.orderId);
          return newSet;
        });
        // Remove notifications for this order
        setNotifications((prev) => prev.filter((n) => n.orderId !== data.orderId));
        localStorage.removeItem(`order_reminder_${data.orderId}`);
      }
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (socket) {
        socket.off('order:new');
        socket.off('order:status_changed');
      }
    };
  }, [socket, isConnected, token]);

  // Check for pending orders and show reminders
  useEffect(() => {
    if (notifications.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      notifications.forEach((notification) => {
        const timeDiff = now.getTime() - notification.createdAt.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        // If order is pending for more than 3 minutes
        if (minutesDiff >= 3 && pendingOrders.has(notification.orderId)) {
          // Check if it's been 1 minute since last reminder (or first reminder)
          const lastReminder = localStorage.getItem(`order_reminder_${notification.orderId}`);
          const lastReminderTime = lastReminder ? parseInt(lastReminder) : notification.createdAt.getTime();
          const reminderDiff = now.getTime() - lastReminderTime;
          const reminderMinutesDiff = reminderDiff / (1000 * 60);

          if (reminderMinutesDiff >= 1) {
            // Show reminder notification
            const reminderNotification: OrderNotification = {
              ...notification,
              orderId: `${notification.orderId}-reminder-${Date.now()}`, // Unique ID for reminder
              message: `⚠️ Reminder: Order ${notification.orderNumber} is still pending!`,
              timestamp: new Date(),
              createdAt: new Date(),
            };
            setNotifications((prev) => [reminderNotification, ...prev]);
            localStorage.setItem(`order_reminder_${notification.orderId}`, now.getTime().toString());

            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Order Reminder', {
                body: `Order ${notification.orderNumber} is still pending. Please accept or reject it.`,
                icon: '/favicon.ico',
              });
            }
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notifications, pendingOrders]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/seller/orders?orderId=${orderId}`);
    removeNotification(orderId);
    setPendingOrders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
    localStorage.removeItem(`order_reminder_${orderId}`);
  };

  const removeNotification = (orderId: string) => {
    // Remove both regular and reminder notifications for this order
    setNotifications((prev) => prev.filter((n) => {
      const baseOrderId = n.orderId.split('-reminder-')[0];
      return baseOrderId !== orderId;
    }));
  };

  // Debug info (only show in development)
  const showDebugInfo = process.env.NODE_ENV === 'development' && !isConnected;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {/* Debug Info */}
      {showDebugInfo && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-2 mb-2 text-xs">
          <p>Socket: {socket ? '✅' : '❌'}</p>
          <p>Connected: {isConnected ? '✅' : '❌'}</p>
          <p>Token: {token ? '✅' : '❌'}</p>
        </div>
      )}

      <AnimatePresence>
        {notifications.map((notification, index) => {
          const isReminder = notification.message.includes('Reminder');
          const timestamp = notification.timestamp instanceof Date 
            ? notification.timestamp 
            : new Date(notification.timestamp);
          return (
            <motion.div
              key={`${notification.orderId}-${index}-${timestamp.getTime()}`}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`border rounded-xl p-4 shadow-lg ${
                isReminder
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isReminder
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}
                >
                  {isReminder ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold mb-1 ${
                      isReminder
                        ? 'text-yellow-900 dark:text-yellow-100'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {isReminder ? 'Order Reminder' : 'New Order Received'}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Order:</span> {notification.orderNumber}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span>{' '}
                      {formatPrice(notification.totalAmount)}
                    </p>
                    {isReminder && (
                      <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                        This order has been pending for more than 3 minutes
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleViewOrder(notification.orderId)}
                      className={`flex-1 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-1 ${
                        isReminder
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      View Order
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeNotification(notification.orderId)}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

