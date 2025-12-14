"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Building2, Wallet, CreditCard } from "lucide-react";

const withdrawMethods = [
  { id: "bank", name: "Bank Account", icon: Building2 },
  { id: "wallet", name: "Digital Wallet", icon: Wallet },
  { id: "card", name: "Debit Card", icon: CreditCard },
];

export default function WithdrawPage() {
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const balance = 2450.00;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Withdraw Funds
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Transfer your earnings to your bank account or wallet.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Withdraw Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
              <CardDescription>Select withdrawal method and amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Withdrawal Method *
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {withdrawMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedMethod === method.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                          }`}
                        >
                          <Icon className={`h-6 w-6 mb-2 mx-auto ${selectedMethod === method.id ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`} />
                          <p className={`text-xs font-medium text-center ${selectedMethod === method.id ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                            {method.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Withdrawal Amount *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={balance}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Available: ${balance.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Details *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account number or wallet address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <Button className="w-full" size="lg" disabled={!amount || Number(amount) > balance}>
                  Request Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Balance</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${balance.toFixed(2)}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Withdrawals</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">$0.00</p>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available</p>
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

