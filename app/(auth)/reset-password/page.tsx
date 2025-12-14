"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">("email");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [dummyOtp] = useState("123456"); // Dummy OTP for demonstration
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending OTP (dummy OTP: 123456)
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      setCountdown(60); // Start 60-second countdown
    }, 1000);
  };

  const handleResendOtp = () => {
    setStep("email");
    setOtpDigits(["", "", "", "", "", ""]);
    setCountdown(0); // Reset countdown when going back to email step
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (value && index === 5 && newOtpDigits.every(digit => digit !== "")) {
      const otpValue = newOtpDigits.join("");
      if (otpValue === dummyOtp) {
        handleVerifyOtp();
      }
    }
  };

  // Handle backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtpDigits = [...otpDigits];
    
    for (let i = 0; i < 6; i++) {
      newOtpDigits[i] = pastedData[i] || "";
    }
    
    setOtpDigits(newOtpDigits);
    
    // Focus last input or next empty input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    otpInputRefs.current[lastIndex]?.focus();

    // Auto-submit if all digits are filled
    if (pastedData.length === 6) {
      if (pastedData === dummyOtp) {
        setTimeout(() => handleVerifyOtp(), 100);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otpDigits.join("");
    
    if (otpValue.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    if (otpValue !== dummyOtp) {
      alert("Invalid OTP. Please enter the correct OTP.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setStep("password");
    }, 500);
  };

  // Reset OTP when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && step === "otp") {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1000);
  };

  // Success View
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl">Password Reset Successful!</CardTitle>
                  <CardDescription className="mt-2">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Link href="/login">
                    <Button className="w-full">
                      Back to Sign In
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Step 1: Email Input
  if (step === "email") {
    return (
      <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl sm:text-3xl">Reset Password</CardTitle>
                  <CardDescription className="mt-2">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remember your password? </span>
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Sign in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Step 2: OTP Verification
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950 flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl sm:text-3xl">Verify OTP</CardTitle>
                  <CardDescription className="mt-2">
                    We've sent a 6-digit OTP to <span className="font-medium text-gray-900 dark:text-white">{email}</span>. Please enter it below.
                  </CardDescription>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>Dummy OTP for testing:</strong> {dummyOtp}
                    </p>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                        Enter 6-digit OTP
                      </label>
                      <div className="flex justify-center gap-2 sm:gap-3">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              otpInputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={handleOtpPaste}
                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all"
                            placeholder="0"
                          />
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                        Enter the 6-digit code sent to your email
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otpDigits.some(digit => !digit)}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <div className="text-center">
                      {countdown > 0 ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Resend OTP in <span className="font-semibold text-blue-600 dark:text-blue-400">{countdown}</span> seconds
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Step 3: New Password Setup
  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl">Set New Password</CardTitle>
                <CardDescription className="mt-2">
                  Enter your new password below. Make sure it's strong and secure.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || password.length < 8 || confirmPassword.length < 8}
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Remember your password? </span>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
