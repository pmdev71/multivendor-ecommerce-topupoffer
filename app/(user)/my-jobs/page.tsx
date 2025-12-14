"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Table } from "@/components/table";
import { Button } from "@/components/button";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  status: string;
  applicants: number;
  budget: string;
  posted: string;
}

const myJobs: Job[] = [
  { id: "1", title: "Web Developer Needed", status: "Active", applicants: 12, budget: "$500-$1000", posted: "2024-01-15" },
  { id: "2", title: "UI/UX Designer", status: "Active", applicants: 8, budget: "$800-$1500", posted: "2024-01-14" },
  { id: "3", title: "Content Writer", status: "Pending", applicants: 0, budget: "$300-$500", posted: "2024-01-13" },
  { id: "4", title: "Full Stack Developer", status: "Completed", applicants: 25, budget: "$2000-$3000", posted: "2024-01-10" },
];

const jobColumns = [
  { key: "title" as const, header: "Job Title" },
  {
    key: "status" as const,
    header: "Status",
    render: (value: string | number) => {
      const status = String(value);
      const statusColors: Record<string, string> = {
        Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            statusColors[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    key: "applicants" as const,
    header: "Applicants",
    render: (value: string | number) => `${value} applicants`,
  },
  { key: "budget" as const, header: "Budget" },
  { key: "posted" as const, header: "Posted" },
  {
    key: "id" as const,
    header: "Actions",
    render: (value: string | number) => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <Eye className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
          <Edit className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

export default function MyJobsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              My Jobs
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Manage your job postings and track applicants.
            </p>
          </div>
          <Button>Create New Job</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>All your posted jobs and their status</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="px-3 sm:px-0">
              <Table data={myJobs} columns={jobColumns} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

