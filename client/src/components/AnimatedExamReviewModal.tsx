import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertCircle, Target } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  explanation?: string;
}

interface AnimatedExamReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  questions: Question[];
}

export default function AnimatedExamReviewModal({ 
  isOpen, 
  onClose, 
  examTitle, 
  questions 
}: AnimatedExamReviewModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = currentQuestion.userAnswer === currentQuestion.correctAnswer;
  const isAttempted = currentQuestion.userAnswer && currentQuestion.userAnswer.trim() !== '';

  // Reset state when modal opens/closes or question changes
  useEffect(() => {
    if (isOpen) {
      setShowAnswer(false);
      setIsAnimating(false);
    }
  }, [isOpen, currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowAnswer(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setShowAnswer(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleReplayQuestion = () => {
    setShowAnswer(false);
    setTimeout(() => {
      setShowAnswer(true);
    }, 1000);
  };

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Dark blurred background overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{examTitle}</h2>
                <p className="text-indigo-100 mt-2 text-lg">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-3 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Question content - scrollable */}
          <div className="p-8 overflow-y-auto max-h-[calc(95vh-250px)]">
            {/* Question text */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h3>
            </motion.div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const optionLetter = getOptionLetter(index);
                const isUserAnswer = option === currentQuestion.userAnswer;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                
                let optionStyle = "border-2 border-gray-200 bg-white";
                let textStyle = "text-gray-700";
                let icon = null;

                if (showAnswer) {
                  if (isUserAnswer && isCorrectAnswer) {
                    optionStyle = "border-2 border-green-500 bg-green-50 shadow-lg";
                    textStyle = "text-green-700 font-semibold";
                    icon = <CheckCircle className="w-6 h-6 text-green-600" />;
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    optionStyle = "border-2 border-red-500 bg-red-50 shadow-lg";
                    textStyle = "text-red-700 font-semibold";
                    icon = <XCircle className="w-6 h-6 text-red-600" />;
                  } else if (isCorrectAnswer) {
                    optionStyle = "border-2 border-green-300 bg-green-25 shadow-md";
                    textStyle = "text-green-600";
                  }
                } else if (isUserAnswer) {
                  // Show user's selection before revealing answer
                  optionStyle = "border-2 border-blue-400 bg-blue-50 shadow-md";
                  textStyle = "text-blue-700 font-medium";
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-5 rounded-xl transition-all duration-300 ${optionStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            showAnswer ? (
                              isUserAnswer && isCorrectAnswer ? 'bg-green-500 text-white' :
                              isUserAnswer ? 'bg-red-500 text-white' :
                              isCorrectAnswer ? 'bg-green-300 text-green-700' :
                              'bg-gray-200 text-gray-600'
                            ) : isUserAnswer ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                          animate={isUserAnswer && showAnswer ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {optionLetter}
                        </motion.div>
                        <span className={`text-lg ${textStyle}`}>{option}</span>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: showAnswer ? 1 : 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {icon}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Answer summary - only show after reveal */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  {/* User's answer */}
                  <motion.div 
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center text-lg">
                      <Target className="w-5 h-5 mr-2" />
                      Your Answer
                    </h4>
                    <div className="text-blue-700">
                      {isAttempted ? (
                        <span className="font-semibold text-lg">{currentQuestion.userAnswer}</span>
                      ) : (
                        <span className="italic text-gray-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Not attempted
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Correct answer */}
                  <motion.div 
                    className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-bold text-green-800 mb-3 flex items-center text-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Correct Answer
                    </h4>
                    <div className="text-green-700 font-semibold text-lg">
                      {currentQuestion.correctAnswer}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation */}
            <AnimatePresence>
              {showAnswer && currentQuestion.explanation && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg"
                >
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Explanation
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation footer */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6"
          >
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isAnimating}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentQuestionIndex === 0 || isAnimating
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 shadow-md'
                }`}
              >
                <span>Previous</span>
              </motion.button>

              <div className="flex space-x-3">
                {questions.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? 'bg-indigo-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReplayQuestion}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors shadow-md"
                >
                  Replay
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1 || isAnimating}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentQuestionIndex === questions.length - 1 || isAnimating
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 shadow-md'
                  }`}
                >
                  <span>Next</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
