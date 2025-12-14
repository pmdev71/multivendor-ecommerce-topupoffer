"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Table } from "@/components/table";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Work {
  id: string;
  job: string;
  client: string;
  status: string;
  amount: number;
  deadline: string;
}

const myWork: Work[] = [
  { id: "1", job: "Web Development Project", client: "Tech Solutions", status: "In Progress", amount: 1200, deadline: "2024-02-01" },
  { id: "2", job: "Logo Design", client: "Design Studio", status: "Completed", amount: 500, deadline: "2024-01-20" },
  { id: "3", job: "Content Writing", client: "Media Corp", status: "Pending", amount: 300, deadline: "2024-02-15" },
  { id: "4", job: "Mobile App UI", client: "StartupXYZ", status: "In Progress", amount: 1500, deadline: "2024-02-10" },
];

const workColumns = [
  { key: "job" as const, header: "Job" },
  { key: "client" as const, header: "Client" },
  {
    key: "status" as const,
    header: "Status",
    render: (value: string | number) => {
      const status = String(value);
      const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
        "In Progress": {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Clock className="h-3 w-3 mr-1" />,
        },
        Completed: {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        },
        Pending: {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: <XCircle className="h-3 w-3 mr-1" />,
        },
      };
      const config = statusConfig[status] || { color: "", icon: null };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${config.color}`}
        >
          {config.icon}
          {status}
        </span>
      );
    },
  },
  {
    key: "amount" as const,
    header: "Amount",
    render: (value: string | number) => `$${Number(value).toFixed(2)}`,
  },
  { key: "deadline" as const, header: "Deadline" },
];

export default function MyWorkPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          My Work
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Track all your active and completed work projects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Projects</CardTitle>
          <CardDescription>Manage your ongoing and completed projects</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="px-3 sm:px-0">
              <Table data={myWork} columns={workColumns} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

