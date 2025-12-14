"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl mb-2">Terms of Service</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By accessing and using ModernUI, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2. Use License
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Permission is granted to temporarily access the materials on ModernUI for personal,
                non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3. User Accounts
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                When you create an account with us, you must provide information that is accurate,
                complete, and current at all times. You are responsible for safeguarding the
                password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4. Prohibited Uses
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                You may not use our service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                5. Content
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our service allows you to post, link, store, share and otherwise make available
                certain information, text, graphics, or other material. You are responsible for the
                content that you post on or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6. Termination
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may terminate or suspend your account and bar access to the service immediately,
                without prior notice or liability, under our sole discretion, for any reason
                whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                7. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
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

