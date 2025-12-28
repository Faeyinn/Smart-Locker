"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "We collect information that you provide directly to us, including:",
        "• Personal identification information (name, email address, phone number)",
        "• Account credentials and authentication information",
        "• Usage data and locker access logs",
        "• Device information and IP addresses",
        "• Payment information (processed securely through third-party providers)",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "We use the information we collect to:",
        "• Provide, maintain, and improve our services",
        "• Process transactions and send related information",
        "• Send technical notices, updates, and support messages",
        "• Respond to your comments, questions, and requests",
        "• Monitor and analyze trends, usage, and activities",
        "• Detect, prevent, and address technical issues",
      ],
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties. We may share your information only:",
        "• With your explicit consent",
        "• To comply with legal obligations",
        "• To protect our rights and safety",
        "• With service providers who assist in operating our platform (under strict confidentiality agreements)",
      ],
    },
    {
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information:",
        "• Encryption of data in transit and at rest",
        "• Regular security assessments and updates",
        "• Access controls and authentication mechanisms",
        "• Secure data storage and backup procedures",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "You have the right to:",
        "• Access your personal information",
        "• Correct inaccurate data",
        "• Request deletion of your data",
        "• Object to processing of your data",
        "• Data portability",
        "• Withdraw consent at any time",
      ],
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar tracking technologies to track activity on our service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
      ],
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date.",
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
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Privacy Policy
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Privacy <span className="text-primary">Policy</span>
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
                    At SmartLocker, we are committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your information when you use our service.
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
                      If you have any questions about this Privacy Policy,
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

