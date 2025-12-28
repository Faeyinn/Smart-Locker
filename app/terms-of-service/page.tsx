"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using SmartLocker, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
      ],
    },
    {
      title: "Use License",
      content: [
        "Permission is granted to temporarily use SmartLocker for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials",
        "• Use the materials for any commercial purpose or for any public display",
        "• Attempt to reverse engineer any software contained in SmartLocker",
        "• Remove any copyright or other proprietary notations from the materials",
      ],
    },
    {
      title: "User Accounts",
      content: [
        "To access certain features of our service, you must register for an account. You agree to:",
        "• Provide accurate, current, and complete information during registration",
        "• Maintain and promptly update your account information",
        "• Maintain the security of your password and identification",
        "• Accept all responsibility for activities that occur under your account",
        "• Notify us immediately of any unauthorized use of your account",
      ],
    },
    {
      title: "Locker Usage",
      content: [
        "Users agree to:",
        "• Use lockers only for lawful purposes",
        "• Not store prohibited items (hazardous materials, illegal substances, etc.)",
        "• Respect locker capacity limits",
        "• Remove items by the end of the rental period",
        "• Report any issues or damages immediately",
      ],
    },
    {
      title: "Payment Terms",
      content: [
        "Payment for locker rentals is required in advance. All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing with 30 days notice.",
      ],
    },
    {
      title: "Prohibited Uses",
      content: [
        "You may not use our service:",
        "• In any way that violates any applicable law or regulation",
        "• To transmit any malicious code or viruses",
        "• To interfere with or disrupt the service",
        "• To impersonate or attempt to impersonate another user",
        "• In any manner that could damage, disable, or impair the service",
      ],
    },
    {
      title: "Intellectual Property",
      content: [
        "The service and its original content, features, and functionality are owned by SmartLocker and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.",
      ],
    },
    {
      title: "Limitation of Liability",
      content: [
        "In no event shall SmartLocker, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.",
      ],
    },
    {
      title: "Termination",
      content: [
        "We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the service will immediately cease.",
      ],
    },
    {
      title: "Changes to Terms",
      content: [
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

          <div className="container px-4 md:px-6 mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
              data-aos="fade-right"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="text-center space-y-6 max-w-3xl mx-auto" data-aos="fade-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Terms of Service
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Terms of <span className="text-primary">Service</span>
              </h1>
              <p className="mx-auto text-muted-foreground text-lg md:text-xl">
                Last Updated: {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="space-y-8">
              <Card className="border-2" data-aos="fade-up">
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    Please read these Terms of Service carefully before using
                    SmartLocker. By using our service, you agree to be bound by
                    these terms.
                  </p>

                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="mb-8"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                      <div className="space-y-2 text-muted-foreground">
                        {section.content.map((item, itemIndex) => (
                          <p key={itemIndex} className="leading-relaxed">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-12 pt-8 border-t">
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you have any questions about these Terms of Service,
                      please contact us at{" "}
                      <Link
                        href="/contact"
                        className="text-primary hover:underline"
                      >
                        support@smartlocker.com
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

