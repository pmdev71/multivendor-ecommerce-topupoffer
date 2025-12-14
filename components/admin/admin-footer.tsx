'use client';

import { motion } from 'framer-motion';

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Multi-Vendor Marketplace. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

