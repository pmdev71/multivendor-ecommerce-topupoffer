"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 10000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Initialize start time when toast becomes visible
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const updateProgress = () => {
      if (startTimeRef.current === null) return;

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = duration - elapsed;
      const newProgress = Math.max(0, (remaining / duration) * 100);

      setProgress(newProgress);

      if (remaining <= 0) {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    // Update progress every 50ms for smooth animation
    intervalRef.current = setInterval(updateProgress, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, toast.id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeout(() => onClose(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      icon: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      icon: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/30",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
  };

  const colorScheme = colors[toast.type];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          />

          {/* Toast Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative flex flex-col items-start gap-4 p-6 rounded-xl border ${colorScheme.bg} ${colorScheme.border} shadow-2xl min-w-[320px] max-w-md pointer-events-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Icon and Close */}
              <div className="flex items-start justify-between w-full gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full ${colorScheme.iconBg} flex items-center justify-center ${colorScheme.icon}`}
                  >
                    {icons[toast.type]}
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p
                      className={`text-base font-semibold ${colorScheme.text}`}
                    >
                      {toast.message}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className={`flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${colorScheme.text} transition-colors`}
                  aria-label="Close toast"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${colorScheme.icon.replace(
                    "text-",
                    "bg-"
                  )} rounded-full`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
              </div>

              {/* Countdown Text */}
              <div className="w-full text-center">
                <p className={`text-xs ${colorScheme.text} opacity-70`}>
                  Auto-closing in{" "}
                  {Math.ceil((progress / 100) * (duration / 1000))}s
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  // Only show the most recent toast
  const latestToast = toasts[toasts.length - 1];

  return (
    <ToastItem key={latestToast.id} toast={latestToast} onClose={onClose} />
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration: duration || 10000 };
    // Replace existing toasts with the new one (only show one at a time)
    setToasts([newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) =>
    showToast(message, "success", duration);
  const warning = (message: string, duration?: number) =>
    showToast(message, "warning", duration);
  const error = (message: string, duration?: number) =>
    showToast(message, "error", duration);
  const info = (message: string, duration?: number) =>
    showToast(message, "info", duration);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    warning,
    error,
    info,
  };
}
