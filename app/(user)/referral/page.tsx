"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Users, Copy, CheckCircle2, Gift, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface Referral {
  id: string;
  name: string;
  email: string;
  status: "Pending" | "Active" | "Completed";
  joinDate: string;
  earnings: number;
}

const referrals: Referral[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "Active",
    joinDate: "2024-01-15",
    earnings: 150.0,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    status: "Active",
    joinDate: "2024-01-20",
    earnings: 75.0,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@example.com",
    status: "Pending",
    joinDate: "2024-01-25",
    earnings: 0.0,
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    status: "Completed",
    joinDate: "2024-01-10",
    earnings: 300.0,
  },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "REF123456";
  const referralLink = `https://modernui.com/signup?ref=${referralCode}`;
  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((ref) => ref.status === "Active").length;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Referral Program
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Invite friends and earn rewards when they join and complete tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-indigo-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Referrals
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {totalReferrals}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 p-3 dark:from-blue-900/40 dark:to-indigo-800/40 shadow-sm">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50/80 to-green-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Referrals
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {activeReferrals}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 p-3 dark:from-emerald-900/40 dark:to-green-800/40 shadow-sm">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-violet-50/80 to-violet-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-100 to-violet-200 p-3 dark:from-purple-900/40 dark:to-violet-800/40 shadow-sm">
                  <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Link Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with friends and earn rewards when they sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Referral Code
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-sm sm:text-base focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full sm:w-auto sm:shrink-0 flex items-center justify-center gap-2 px-4 py-2.5"
                >
                  {copied ? (
                    <>
                      <div className="rounded bg-emerald-100 p-1 dark:bg-emerald-900/30 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <div className="rounded bg-blue-100 p-1 dark:bg-blue-900/30 shrink-0">
                        <Copy className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Copy Code</span>
                      <span className="text-sm font-medium sm:hidden">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Referral Link
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-xs sm:text-sm focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white break-all"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full sm:w-auto sm:shrink-0 flex items-center justify-center gap-2 px-4 py-2.5"
                >
                  {copied ? (
                    <>
                      <div className="rounded bg-emerald-100 p-1 dark:bg-emerald-900/30 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <div className="rounded bg-blue-100 p-1 dark:bg-blue-900/30 shrink-0">
                        <Copy className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">Copy Link</span>
                      <span className="text-sm font-medium sm:hidden">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            Track your referrals and their earnings status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="px-3 sm:px-0">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Join Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                  {referrals.map((referral, index) => (
                    <motion.tr
                      key={referral.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                    >
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {referral.name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {referral.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                            referral.status
                          )}`}
                        >
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {referral.joinDate}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        ${referral.earnings.toFixed(2)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mt-6 border-2 border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50/80 to-blue-50 dark:border-gray-800 dark:bg-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Learn how the referral program works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-800/40 w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Share Your Link
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Copy your referral link and share it with friends and colleagues
              </p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/40 dark:to-green-800/40 w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                They Sign Up
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your friends sign up using your referral link and get started
              </p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-gradient-to-br from-purple-100 to-violet-200 dark:from-purple-900/40 dark:to-violet-800/40 w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                You Earn Rewards
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earn rewards when your referrals complete their first job
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

