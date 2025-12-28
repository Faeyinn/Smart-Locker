"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Cookie } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function CookiePolicyPage() {
  const sections = [
    {
      title: "What Are Cookies",
      content: [
        "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.",
      ],
    },
    {
      title: "How We Use Cookies",
      content: [
        "SmartLocker uses cookies to:",
        "• Remember your preferences and settings",
        "• Authenticate your identity and maintain your session",
        "• Analyze how our service is used to improve performance",
        "• Provide personalized content and features",
        "• Ensure security and prevent fraud",
      ],
    },
    {
      title: "Types of Cookies We Use",
      content: [
        "We use the following types of cookies:",
        "",
        "Essential Cookies: These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.",
        "",
        "Performance Cookies: These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
        "",
        "Functionality Cookies: These cookies allow the website to remember choices you make and provide enhanced, personalized features.",
        "",
        "Targeting Cookies: These cookies may be set through our site by our advertising partners to build a profile of your interests.",
      ],
    },
    {
      title: "Third-Party Cookies",
      content: [
        "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements, and so on. These third-party cookies are subject to the respective privacy policies of these external services.",
      ],
    },
    {
      title: "Managing Cookies",
      content: [
        "You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can impact your user experience and parts of our service may no longer be fully accessible.",
        "",
        "Most browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. You can also delete cookies that have already been set.",
        "",
        "To learn more about how to manage cookies, visit:",
        "• Chrome: chrome://settings/cookies",
        "• Firefox: about:preferences#privacy",
        "• Safari: Preferences > Privacy",
        "• Edge: edge://settings/cookies",
      ],
    },
    {
      title: "Cookie Consent",
      content: [
        "By continuing to use our service, you consent to our use of cookies as described in this policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or discontinue use of our service.",
      ],
    },
    {
      title: "Updates to This Policy",
      content: [
        "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page.",
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
                <Cookie className="w-8 h-8 text-primary" />
              </div>
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Cookie Policy
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Cookie <span className="text-primary">Policy</span>
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
                    This Cookie Policy explains how SmartLocker uses cookies and
                    similar technologies when you use our service. It explains
                    what these technologies are and why we use them.
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
                      If you have any questions about our use of cookies, please
                      contact us at{" "}
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

