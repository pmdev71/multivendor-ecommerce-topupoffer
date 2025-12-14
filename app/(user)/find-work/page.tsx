"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Search, MapPin, DollarSign, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

const jobs = [
  {
    id: 1,
    title: "Web Developer Needed",
    company: "Tech Solutions Inc",
    location: "Remote",
    price: "$50/hr",
    duration: "2 weeks",
    rating: 4.8,
    description: "Looking for an experienced web developer to build a modern React application.",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    price: "$45/hr",
    duration: "1 month",
    rating: 4.9,
    description: "Create beautiful and intuitive user interfaces for our mobile app.",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    price: "$60/hr",
    duration: "3 months",
    rating: 4.7,
    description: "Join our team to build the next generation of web applications.",
  },
  {
    id: 4,
    title: "Content Writer",
    company: "Media Corp",
    location: "Remote",
    price: "$30/hr",
    duration: "Ongoing",
    rating: 4.6,
    description: "Write engaging blog posts and articles for our company website.",
  },
];

export default function FindWorkPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Find Work
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Browse available jobs and find the perfect opportunity for you.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {job.rating}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.duration}</span>
                  </div>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}

