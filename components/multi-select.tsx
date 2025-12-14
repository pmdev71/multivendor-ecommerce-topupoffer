"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Search, Check, CheckSquare, Square } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  maxDisplayed?: number;
  showSelectAll?: boolean;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  className = "",
  maxDisplayed = 3,
  showSelectAll = true,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if all visible options are selected
  const allSelected = filteredOptions.length > 0 && filteredOptions.every((option) => selectedValues.includes(option.value));

  // Handle option toggle
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map((opt) => opt.value);
      onChange(selectedValues.filter((v) => !filteredValues.includes(v)));
    } else {
      // Select all filtered options
      const filteredValues = filteredOptions
        .filter((opt) => !opt.disabled)
        .map((opt) => opt.value);
      const newValues = [...new Set([...selectedValues, ...filteredValues])];
      onChange(newValues);
    }
  };

  // Handle remove selected item
  const removeSelected = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected labels
  const selectedLabels = selectedValues
    .map((value) => options.find((opt) => opt.value === value)?.label)
    .filter(Boolean) as string[];

  // Get display text
  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length <= maxDisplayed) {
      return selectedLabels.join(", ");
    }
    return `${selectedLabels.slice(0, maxDisplayed).join(", ")} +${selectedValues.length - maxDisplayed} more`;
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-3 text-left
          bg-white border border-gray-300 rounded-lg shadow-sm
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500
          transition-colors duration-200
        `}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedValues.length > 0 ? (
              <>
                {selectedValues.slice(0, maxDisplayed).map((value) => {
                  const label = options.find((opt) => opt.value === value)?.label;
                  return (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-sm bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={(e) => removeSelected(value, e)}
                        className="hover:bg-blue-200 rounded-full p-0.5 dark:hover:bg-blue-900/50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                {selectedValues.length > maxDisplayed && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    +{selectedValues.length - maxDisplayed} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-80 flex flex-col"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Select All Button */}
            {showSelectAll && filteredOptions.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
              >
                {allSelected ? (
                  <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
                <span>{allSelected ? "Deselect All" : "Select All"}</span>
              </button>
            )}

            {/* Options List */}
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              ) : (
                <ul className="p-1">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          onClick={() => !option.disabled && toggleOption(option.value)}
                          disabled={option.disabled}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md
                            transition-colors duration-150
                            ${
                              isSelected
                                ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            }
                            ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                          `}
                        >
                          <div className="flex items-center justify-center w-5 h-5 shrink-0">
                            {isSelected ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center dark:bg-blue-500"
                              >
                                <Check className="h-3 w-3 text-white" />
                              </motion.div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded dark:border-gray-600" />
                            )}
                          </div>
                          <span className="flex-1 text-left">{option.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Selected Count Footer */}
            {selectedValues.length > 0 && (
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {selectedValues.length} item{selectedValues.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

