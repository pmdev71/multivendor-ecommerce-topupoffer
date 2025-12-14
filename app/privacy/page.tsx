"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl mb-2">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                1. Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Welcome to ModernUI. We are committed to protecting your privacy and ensuring you
                have a positive experience on our website and in using our products and services.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2. Information We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                We may collect information about you in a variety of ways. The information we may
                collect on the site includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Personal data such as your name, email address, and phone number</li>
                <li>Account information when you create an account</li>
                <li>Usage data including how you interact with our website</li>
                <li>Device information such as IP address, browser type, and operating system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you for customer service and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use administrative, technical, and physical security measures to help protect
                your personal information. While we have taken reasonable steps to secure the
                personal information you provide to us, please be aware that despite our efforts, no
                security measures are perfect or impenetrable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                5. Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal
                information, including the right to access, update, or delete the personal
                information we have on you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us at{" "}
                <a
                  href="/contact"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  our contact page
                </a>
                .
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}

