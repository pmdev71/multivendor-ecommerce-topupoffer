"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/button";

interface Step {
  title: string;
  description: string;
  content: ReactNode;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className = "" }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Step Indicators */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => goToStep(index)}
                  className={`
                    flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all duration-300
                    ${
                      index < currentStep
                        ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                        : index === currentStep
                          ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/50 dark:border-blue-500 dark:bg-blue-500"
                          : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                    }
                  `}
                >
                  {index < currentStep ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    <span className="text-sm sm:text-base font-semibold">{index + 1}</span>
                  )}
                </button>
                {/* Step Title (Mobile) */}
                <span className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400 sm:hidden">
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-1 h-0.5 w-8 sm:w-16 transition-all duration-300
                    ${index < currentStep ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Title and Description (Desktop) */}
      <div className="mb-6 hidden text-center sm:block">
        <motion.h3
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {steps[currentStep].title}
        </motion.h3>
        <motion.p
          key={`desc-${currentStep}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-gray-600 dark:text-gray-400"
        >
          {steps[currentStep].description}
        </motion.p>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[200px] sm:min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Step Indicators (Desktop) */}
        <div className="hidden gap-1 sm:flex">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`
                h-2 w-2 rounded-full transition-all duration-300
                ${
                  index === currentStep
                    ? "w-8 bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }
              `}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

