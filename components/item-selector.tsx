"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { Modal } from "@/components/modal";

export interface SubItem {
  id: string;
  label: string;
  description?: string;
}

export interface SelectableItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  subItems?: SubItem[];
  selectedSubItemId?: string;
}

interface ItemSelectorProps {
  items: SelectableItem[];
  selectedItems: SelectableItem[];
  onSelect: (item: SelectableItem) => void;
  onRemove: (itemId: string) => void;
  title?: string;
  description?: string;
  maxSelected?: number;
}

export function ItemSelector({
  items,
  selectedItems,
  onSelect,
  onRemove,
  title = "Select Items",
  description = "Click on items to add them to your selection",
  maxSelected,
}: ItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subItemModalOpen, setSubItemModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<SelectableItem | null>(null);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableItems = filteredItems.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id)
  );

  const isItemSelected = (itemId: string) =>
    selectedItems.some((item) => item.id === itemId);

  const canSelectMore = maxSelected
    ? selectedItems.length < maxSelected
    : true;

  const handleItemClick = (item: SelectableItem) => {
    if (!isItemSelected(item.id) && canSelectMore) {
      // If item has sub-items, show modal to select sub-item
      if (item.subItems && item.subItems.length > 0) {
        setPendingItem(item);
        setSubItemModalOpen(true);
      } else {
        // If no sub-items, select directly
        onSelect(item);
      }
    }
  };

  const handleSubItemSelect = (subItem: SubItem) => {
    if (pendingItem) {
      const itemWithSubItem: SelectableItem = {
        ...pendingItem,
        selectedSubItemId: subItem.id,
      };
      onSelect(itemWithSubItem);
      setSubItemModalOpen(false);
      setPendingItem(null);
    }
  };

  const getSelectedSubItemLabel = (item: SelectableItem) => {
    if (!item.selectedSubItemId || !item.subItems) return null;
    const subItem = item.subItems.find((si) => si.id === item.selectedSubItemId);
    return subItem?.label;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Items ({selectedItems.length}
            {maxSelected && ` / ${maxSelected}`})
          </h4>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  {item.icon && (
                    <span className="text-base">{item.icon}</span>
                  )}
                  <span>
                    {item.label}
                    {item.selectedSubItemId && (
                      <span className="ml-1.5 text-xs opacity-90">
                        ({getSelectedSubItemLabel(item)})
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={`Remove ${item.label}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Sub-Item Selection Modal */}
      <Modal
        isOpen={subItemModalOpen}
        onClose={() => {
          setSubItemModalOpen(false);
          setPendingItem(null);
        }}
        title={pendingItem ? `Select ${pendingItem.label} Type` : "Select Sub-Item"}
        size="md"
      >
        {pendingItem && pendingItem.subItems && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose one option from the list below:
            </p>
            <div className="space-y-2">
              {pendingItem.subItems.map((subItem) => (
                <motion.button
                  key={subItem.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubItemSelect(subItem)}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-gray-700 text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {subItem.label}
                      </h4>
                      {subItem.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Available Items List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Available Items ({availableItems.length})
        </h4>
        {availableItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "No items found matching your search"
              : "All items have been selected"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {availableItems.map((item) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  disabled={!canSelectMore}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    canSelectMore
                      ? "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-gray-700 cursor-pointer"
                      : "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.icon && (
                      <div className="flex-shrink-0 mt-0.5 text-gray-600 dark:text-gray-400">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </h5>
                        {item.subItems && item.subItems.length > 0 && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                            {item.subItems.length} options
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {!canSelectMore && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded">
                        Max limit reached
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

