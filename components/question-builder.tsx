"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, Type, Users, Shuffle, Edit2, Check, X } from "lucide-react";
import { Card } from "@/components/card";

export interface Question {
  id: string;
  questionText: string;
  answerType: "text" | "image";
  questionType: "everyone" | "random";
}

interface QuestionBuilderProps {
  questions?: Question[];
  onChange?: (questions: Question[]) => void;
  title?: string;
  description?: string;
}

export function QuestionBuilder({
  questions: initialQuestions = [],
  onChange,
  title = "Question Builder",
  description = "Add multiple questions with different answer and question types",
}: QuestionBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempQuestion, setTempQuestion] = useState<Question | null>(null);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}-${Math.random()}`,
      questionText: "",
      answerType: "text",
      questionType: "everyone",
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange?.(updatedQuestions);
    // Automatically open edit mode for new question
    setEditingId(newQuestion.id);
    setTempQuestion(newQuestion);
  };

  const handleRemoveQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    onChange?.(updatedQuestions);
  };

  const handleUpdateQuestion = (id: string, field: keyof Question, value: string) => {
    if (tempQuestion && tempQuestion.id === id) {
      setTempQuestion({ ...tempQuestion, [field]: value });
    }
  };

  const handleStartEdit = (question: Question) => {
    setEditingId(question.id);
    setTempQuestion({ ...question });
  };

  const handleSaveEdit = () => {
    if (tempQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === tempQuestion.id ? tempQuestion : q
      );
      setQuestions(updatedQuestions);
      onChange?.(updatedQuestions);
      setEditingId(null);
      setTempQuestion(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempQuestion(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Question</span>
        </motion.button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No questions added yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click "Add Question" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {questions.map((question, index) => {
              const isEditing = editingId === question.id;
              const displayQuestion = isEditing && tempQuestion ? tempQuestion : question;

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {isEditing ? (
                    // Edit Mode
                    <Card className="border-2 border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 p-4 sm:p-6">
                      <div className="p-0">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Question {index + 1} - Editing
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400 transition-colors"
                              aria-label="Save question"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
                              aria-label="Cancel editing"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Question Text Input */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Question Text
                          </label>
                          <input
                            type="text"
                            value={displayQuestion.questionText}
                            onChange={(e) =>
                              handleUpdateQuestion(displayQuestion.id, "questionText", e.target.value)
                            }
                            placeholder="Enter your question here..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            autoFocus
                          />
                        </div>

                        {/* Answer Type and Question Type Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Answer Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Answer Type
                            </label>
                            <div className="relative">
                              <select
                                value={displayQuestion.answerType}
                                onChange={(e) =>
                                  handleUpdateQuestion(
                                    displayQuestion.id,
                                    "answerType",
                                    e.target.value as "text" | "image"
                                  )
                                }
                                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none cursor-pointer"
                              >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {displayQuestion.answerType === "text" ? (
                                  <Type className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            {displayQuestion.answerType === "text" && (
                              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Type className="w-3 h-3" />
                                Users will answer with text input
                              </p>
                            )}
                            {displayQuestion.answerType === "image" && (
                              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                Users will answer by uploading an image
                              </p>
                            )}
                          </div>

                          {/* Question Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Question Type
                            </label>
                            <div className="relative">
                              <select
                                value={displayQuestion.questionType}
                                onChange={(e) =>
                                  handleUpdateQuestion(
                                    displayQuestion.id,
                                    "questionType",
                                    e.target.value as "everyone" | "random"
                                  )
                                }
                                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none cursor-pointer"
                              >
                                <option value="everyone">Everyone</option>
                                <option value="random">Random</option>
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {displayQuestion.questionType === "everyone" ? (
                                  <Users className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <Shuffle className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            {displayQuestion.questionType === "everyone" && (
                              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                All users will see this question
                              </p>
                            )}
                            {displayQuestion.questionType === "random" && (
                              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Shuffle className="w-3 h-3" />
                                Question shown randomly to users
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    // List View Mode
                    <Card className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors p-3 sm:p-4">
                      <div className="p-0">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-sm">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {question.questionText || "Untitled Question"}
                              </p>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  {question.answerType === "text" ? (
                                    <>
                                      <Type className="w-3 h-3" />
                                      Text
                                    </>
                                  ) : (
                                    <>
                                      <ImageIcon className="w-3 h-3" />
                                      Image
                                    </>
                                  )}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  {question.questionType === "everyone" ? (
                                    <>
                                      <Users className="w-3 h-3" />
                                      Everyone
                                    </>
                                  ) : (
                                    <>
                                      <Shuffle className="w-3 h-3" />
                                      Random
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStartEdit(question)}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400 transition-colors"
                              aria-label="Edit question"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveQuestion(question.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 transition-colors"
                              aria-label="Remove question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Summary */}
      {questions.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                Questions Summary
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Total: {questions.length} question{questions.length !== 1 ? "s" : ""} • 
                Text answers: {questions.filter((q) => q.answerType === "text").length} • 
                Image answers: {questions.filter((q) => q.answerType === "image").length} • 
                Everyone: {questions.filter((q) => q.questionType === "everyone").length} • 
                Random: {questions.filter((q) => q.questionType === "random").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

