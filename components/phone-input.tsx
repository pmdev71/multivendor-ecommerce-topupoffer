"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

export interface CountryPhone {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const countriesWithDialCodes: CountryPhone[] = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dialCode: "+31" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", dialCode: "+32" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", dialCode: "+41" },
  { code: "AT", name: "Austria", flag: "🇦🇹", dialCode: "+43" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", dialCode: "+46" },
  { code: "NO", name: "Norway", flag: "🇳🇴", dialCode: "+47" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", dialCode: "+45" },
  { code: "FI", name: "Finland", flag: "🇫🇮", dialCode: "+358" },
  { code: "PL", name: "Poland", flag: "🇵🇱", dialCode: "+48" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", dialCode: "+353" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "GR", name: "Greece", flag: "🇬🇷", dialCode: "+30" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", dialCode: "+420" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", dialCode: "+36" },
  { code: "RO", name: "Romania", flag: "🇷🇴", dialCode: "+40" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", dialCode: "+359" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", dialCode: "+385" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dialCode: "+54" },
  { code: "CL", name: "Chile", flag: "🇨🇱", dialCode: "+56" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", dialCode: "+57" },
  { code: "PE", name: "Peru", flag: "🇵🇪", dialCode: "+51" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dialCode: "+20" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dialCode: "+254" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", dialCode: "+971" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966" },
  { code: "IL", name: "Israel", flag: "🇮🇱", dialCode: "+972" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", dialCode: "+90" },
  { code: "RU", name: "Russia", flag: "🇷🇺", dialCode: "+7" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", dialCode: "+64" },
];

interface PhoneInputProps {
  value?: string;
  countryCode?: string;
  onChange?: (phoneNumber: string, countryCode: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value = "",
  countryCode = "US",
  onChange,
  placeholder = "Enter phone number",
  className = "",
  disabled = false,
}: PhoneInputProps) {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected country
  const selectedCountry = countriesWithDialCodes.find(
    (country) => country.code === selectedCountryCode
  ) || countriesWithDialCodes[0];

  // Filter countries based on search query
  const filteredCountries = countriesWithDialCodes.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Only numbers
    setPhoneNumber(inputValue);
    if (onChange) {
      onChange(inputValue, selectedCountryCode);
    }
  };

  // Handle country selection
  const handleCountrySelect = (code: string) => {
    setSelectedCountryCode(code);
    setIsCountryOpen(false);
    setSearchQuery("");
    if (onChange) {
      onChange(phoneNumber, code);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync with external value changes
  useEffect(() => {
    setPhoneNumber(value);
  }, [value]);

  useEffect(() => {
    setSelectedCountryCode(countryCode);
  }, [countryCode]);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div className="flex items-stretch gap-0">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsCountryOpen(!isCountryOpen)}
            disabled={disabled}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3 border border-r-0 rounded-l-lg
              bg-white border-gray-300 min-w-[80px] sm:min-w-[100px]
              hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10
              dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500
              transition-colors duration-200
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span className="text-lg sm:text-xl shrink-0">{selectedCountry.flag}</span>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                isCountryOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-r-lg
            bg-white text-gray-900 text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            transition-colors duration-200
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      </div>

      {/* Country Dropdown - Positioned relative to the container */}
      <AnimatePresence>
        {isCountryOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 sm:left-auto sm:right-auto mt-2 w-full sm:w-80 max-w-[calc(100vw-1rem)] sm:max-w-none bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-80 flex flex-col"
          >
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search country or code..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                {/* Countries List */}
                <div className="overflow-y-auto max-h-60">
                  {filteredCountries.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No countries found
                    </div>
                  ) : (
                    <ul className="p-1">
                      {filteredCountries.map((country) => {
                        const isSelected = selectedCountryCode === country.code;
                        return (
                          <li key={country.code}>
                            <button
                              type="button"
                              onClick={() => handleCountrySelect(country.code)}
                              className={`
                                w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md
                                transition-colors duration-150
                                ${
                                  isSelected
                                    ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                }
                                cursor-pointer
                              `}
                            >
                              <span className="text-2xl shrink-0">{country.flag}</span>
                              <span className="flex-1 text-left">{country.name}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                                {country.dialCode}
                              </span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"
                                />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </div>
  );
}

