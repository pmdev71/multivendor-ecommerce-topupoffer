"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { CreditCard, Wallet, Building2, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard },
  { id: "bank", name: "Bank Transfer", icon: Building2 },
  { id: "wallet", name: "Digital Wallet", icon: Wallet },
  { id: "mobile", name: "Mobile Payment", icon: Smartphone },
];

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [amount, setAmount] = useState("");

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Deposit Funds
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Add funds to your account to start hiring freelancers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Deposit Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.button
                      key={method.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${selectedMethod === method.id ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`} />
                      <p className={`text-sm font-medium ${selectedMethod === method.id ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                        {method.name}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <Button className="w-full" size="lg">
                  Deposit ${amount || "0.00"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Balance</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">$0.00</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Available for payments
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

