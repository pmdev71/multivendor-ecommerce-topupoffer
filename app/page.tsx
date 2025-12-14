"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card";
import { Table } from "@/components/table";
import { Modal } from "@/components/modal";
import { Chart } from "@/components/chart";
import { Button } from "@/components/button";
import { Stepper } from "@/components/stepper";
import { MultiSelect } from "@/components/multi-select";
import { BottomNav } from "@/components/bottom-nav";
import { CountrySelect, countries } from "@/components/country-select";
import { PhoneInput, countriesWithDialCodes } from "@/components/phone-input";
import { ItemSelector, SelectableItem } from "@/components/item-selector";
import { QuestionBuilder } from "@/components/question-builder";
import { ToastContainer, useToast } from "@/components/toast";
import {
  Code,
  Palette,
  Database,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Heart,
  Camera,
  Music,
  Book,
  Gamepad2,
} from "lucide-react";

// Sample data for charts
const lineChartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 390 },
  { name: "Jun", value: 450 },
];

const barChartData = [
  { name: "Q1", value: 1200 },
  { name: "Q2", value: 1900 },
  { name: "Q3", value: 3000 },
  { name: "Q4", value: 2780 },
];

const pieChartData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
  { name: "Other", value: 100 },
];

// Sample table data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const tableData: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Moderator",
    status: "Active",
  },
];

const tableColumns = [
  { key: "name" as const, header: "Name" },
  { key: "email" as const, header: "Email" },
  { key: "role" as const, header: "Role" },
  {
    key: "status" as const,
    header: "Status",
    render: (value: string | number, row: User) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          value === "Active"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        {String(value)}
      </span>
    ),
  },
];

// Sample items for ItemSelector
const availableItems: SelectableItem[] = [
  {
    id: "1",
    label: "Web Development",
    description: "Build modern web applications with React, Next.js, and more",
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: "2",
    label: "UI/UX Design",
    description: "Create beautiful and intuitive user interfaces",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: "3",
    label: "Database Management",
    description: "Design and optimize database systems",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "4",
    label: "Mobile Development",
    description: "Build native and cross-platform mobile apps",
    icon: <Smartphone className="w-5 h-5" />,
    subItems: [
      {
        id: "mobile-ios",
        label: "iOS Development",
        description: "Build apps for iPhone and iPad using Swift",
      },
      {
        id: "mobile-android",
        label: "Android Development",
        description: "Create apps for Android devices using Kotlin or Java",
      },
      {
        id: "mobile-cross",
        label: "Cross-Platform",
        description: "Build apps that work on both iOS and Android",
      },
    ],
  },
  {
    id: "5",
    label: "Web Hosting",
    description: "Deploy and manage web applications",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: "6",
    label: "Security",
    description: "Implement security best practices and protocols",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "7",
    label: "Performance Optimization",
    description: "Speed up your applications and improve efficiency",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "8",
    label: "Health & Fitness",
    description: "Track your health and fitness goals",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: "9",
    label: "Photography",
    description: "Capture and edit stunning photos",
    icon: <Camera className="w-5 h-5" />,
    subItems: [
      {
        id: "photo-portrait",
        label: "Portrait Photography",
        description: "Professional portrait and headshot photography",
      },
      {
        id: "photo-landscape",
        label: "Landscape Photography",
        description: "Capture beautiful natural and urban landscapes",
      },
      {
        id: "photo-event",
        label: "Event Photography",
        description: "Cover weddings, parties, and corporate events",
      },
    ],
  },
  {
    id: "10",
    label: "Music Production",
    description: "Create and produce music tracks",
    icon: <Music className="w-5 h-5" />,
  },
  {
    id: "11",
    label: "Content Writing",
    description: "Write engaging articles and blog posts",
    icon: <Book className="w-5 h-5" />,
    subItems: [
      {
        id: "writing-blog",
        label: "Blog Writing",
        description: "Create engaging blog posts and articles",
      },
      {
        id: "writing-tech",
        label: "Technical Writing",
        description: "Write documentation and technical guides",
      },
      {
        id: "writing-copy",
        label: "Copywriting",
        description: "Create compelling marketing and advertising copy",
      },
    ],
  },
  {
    id: "12",
    label: "Game Development",
    description: "Design and develop interactive games",
    icon: <Gamepad2 className="w-5 h-5" />,
    subItems: [
      {
        id: "game-pc",
        label: "PC Game",
        description: "Develop games for Windows, Mac, and Linux",
      },
      {
        id: "game-mobile",
        label: "Mobile Game",
        description: "Create games for iOS and Android devices",
      },
      {
        id: "game-console",
        label: "Console Game",
        description: "Develop games for PlayStation, Xbox, and Nintendo",
      },
      {
        id: "game-web",
        label: "Web Game",
        description: "Build browser-based games using HTML5 and WebGL",
      },
    ],
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("US");
  const [selectedItems, setSelectedItems] = useState<SelectableItem[]>([]);
  const toast = useToast();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8 md:pb-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Modern UI Template
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            A beautiful, responsive UI template built with Next.js, Tailwind
            CSS, and Framer Motion. Featuring dark mode, animations, and modern
            components.
          </p>
        </section>

        {/* Stepper Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <Stepper
                steps={[
                  {
                    title: "Get Started",
                    description: "Create your account and set up your profile",
                    content: (
                      <div className="text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                          1
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white sm:hidden">
                          Get Started
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Sign up for free and create your account in just a few
                          simple steps. No credit card required.
                        </p>
                      </div>
                    ),
                  },
                  {
                    title: "Explore Features",
                    description: "Discover all the powerful features we offer",
                    content: (
                      <div className="text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-4xl font-bold">
                          2
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white sm:hidden">
                          Explore Features
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Browse through our extensive feature set including job
                          posting, work tracking, payments, and more.
                        </p>
                      </div>
                    ),
                  },
                  {
                    title: "Start Working",
                    description:
                      "Begin your journey and start completing tasks",
                    content: (
                      <div className="text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-4xl font-bold">
                          3
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white sm:hidden">
                          Start Working
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Find jobs that match your skills, complete tasks, and
                          get paid securely through our platform.
                        </p>
                      </div>
                    ),
                  },
                  {
                    title: "Earn & Grow",
                    description:
                      "Build your reputation and increase your earnings",
                    content: (
                      <div className="text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                          4
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white sm:hidden">
                          Earn & Grow
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          As you complete more jobs, build your reputation, and
                          grow your network, you&apos;ll unlock more
                          opportunities and higher earnings.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </section>

        {/* Multi-Select Dropdown Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Multi-Select Dropdown
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Skills</CardTitle>
                <CardDescription>
                  Choose multiple skills that match your expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiSelect
                  options={[
                    { value: "react", label: "React" },
                    { value: "nextjs", label: "Next.js" },
                    { value: "typescript", label: "TypeScript" },
                    { value: "tailwind", label: "Tailwind CSS" },
                    { value: "nodejs", label: "Node.js" },
                    { value: "python", label: "Python" },
                    { value: "javascript", label: "JavaScript" },
                    { value: "vue", label: "Vue.js" },
                    { value: "angular", label: "Angular" },
                    { value: "php", label: "PHP" },
                    { value: "java", label: "Java" },
                    { value: "csharp", label: "C#" },
                  ]}
                  selectedValues={selectedSkills}
                  onChange={setSelectedSkills}
                  placeholder="Select skills..."
                  searchPlaceholder="Search skills..."
                  maxDisplayed={2}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Categories</CardTitle>
                <CardDescription>Filter jobs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <MultiSelect
                  options={[
                    { value: "web-dev", label: "Web Development" },
                    { value: "mobile-dev", label: "Mobile Development" },
                    { value: "design", label: "UI/UX Design" },
                    { value: "marketing", label: "Digital Marketing" },
                    { value: "writing", label: "Content Writing" },
                    { value: "data", label: "Data Analysis" },
                    { value: "seo", label: "SEO" },
                    { value: "video", label: "Video Editing" },
                    { value: "graphics", label: "Graphic Design" },
                    { value: "consulting", label: "Consulting" },
                  ]}
                  selectedValues={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                  searchPlaceholder="Search categories..."
                  maxDisplayed={2}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Country Select Dropdown Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Country Selector
          </h2>
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Country</CardTitle>
                <CardDescription>
                  Choose your country from the dropdown below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CountrySelect
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="Select a country..."
                  searchPlaceholder="Search countries..."
                />
                {selectedCountry && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected country:{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {
                          countries.find((c) => c.code === selectedCountry)
                            ?.name
                        }
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Phone Number Input Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Phone Number Input
          </h2>
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Phone Number</CardTitle>
                <CardDescription>
                  Select country code and enter your phone number
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhoneInput
                  value={phoneNumber}
                  countryCode={phoneCountryCode}
                  onChange={(number, code) => {
                    setPhoneNumber(number);
                    setPhoneCountryCode(code);
                  }}
                  placeholder="Enter phone number"
                />
                {(phoneNumber || phoneCountryCode) && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Full number:{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {
                          countriesWithDialCodes.find(
                            (c) => c.code === phoneCountryCode
                          )?.dialCode
                        }{" "}
                        {phoneNumber}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Item Selector Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Item Selector
          </h2>
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Interests</CardTitle>
                <CardDescription>
                  Choose items from the list below. Selected items will appear
                  as badges that you can remove anytime.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemSelector
                  items={availableItems}
                  selectedItems={selectedItems}
                  onSelect={(item) => {
                    setSelectedItems([...selectedItems, item]);
                  }}
                  onRemove={(itemId) => {
                    setSelectedItems(
                      selectedItems.filter((item) => item.id !== itemId)
                    );
                  }}
                  title=""
                  description=""
                  maxSelected={8}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Question Builder Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Question Builder
          </h2>
          <div>
            <Card className="p-4 sm:p-6">
              <QuestionBuilder
                onChange={(questions) => {
                  console.log("Questions updated:", questions);
                }}
              />
            </Card>
          </div>
        </section>

        {/* Toast Messages Demo Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Toast Messages
          </h2>
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Toast Notification Demo</CardTitle>
                <CardDescription>
                  Click the buttons below to see different types of toast
                  messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      toast.success("Operation completed successfully!")
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Show Success Toast
                  </Button>
                  <Button
                    onClick={() =>
                      toast.warning(
                        "Please check your input before proceeding."
                      )
                    }
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Show Warning Toast
                  </Button>
                  <Button
                    onClick={() =>
                      toast.error("Something went wrong. Please try again.")
                    }
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Show Error Toast
                  </Button>
                  <Button
                    onClick={() =>
                      toast.info("Here's some helpful information for you.")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Show Info Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Cards
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card Title 1</CardTitle>
                <CardDescription>
                  This is a description for card 1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Card content goes here. This card demonstrates the card
                  component with hover effects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Title 2</CardTitle>
                <CardDescription>
                  This is a description for card 2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Another card example showing the responsive grid layout and
                  animations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Title 3</CardTitle>
                <CardDescription>
                  This is a description for card 3
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The third card in the grid, fully responsive and
                  mobile-friendly.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Charts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Line Chart</CardTitle>
                <CardDescription>Sales over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="line" data={lineChartData} dataKey="value" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                <CardDescription>Quarterly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="bar" data={barChartData} dataKey="value" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Area Chart</CardTitle>
                <CardDescription>Growth trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="area" data={lineChartData} dataKey="value" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pie Chart</CardTitle>
                <CardDescription>Device distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="pie" data={pieChartData} dataKey="value" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Table Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Table
          </h2>
          <Card>
            <CardContent className="p-0">
              <Table data={tableData} columns={tableColumns} />
            </CardContent>
          </Card>
        </section>

        {/* Modal Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Modal
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </div>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                This is a modal component with smooth animations. You can use it
                to display forms, confirmations, or any other content.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Confirm</Button>
              </div>
            </div>
          </Modal>
        </section>
      </main>

      <Footer />

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
