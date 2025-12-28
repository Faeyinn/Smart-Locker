"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Users,
  Lightbulb,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To revolutionize personal storage by providing secure, accessible, and intelligent locker solutions that empower individuals and organizations.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously innovate to bring cutting-edge technology to everyday storage needs, making life more convenient and secure.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description:
        "Our users are at the heart of everything we do. We design our solutions with their needs, security, and convenience in mind.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our service, from security to user experience, ensuring the highest quality standards.",
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
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  About Us
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                About <span className="text-primary">SmartLocker</span>
              </h1>
              <p className="mx-auto text-muted-foreground text-lg md:text-xl">
                We're transforming the way people think about personal storage
                with innovative technology and unwavering commitment to security.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto space-y-8" data-aos="fade-up">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  SmartLocker was born from a simple observation: traditional
                  storage solutions are outdated, inconvenient, and often
                  insecure. We envisioned a future where accessing your stored
                  items would be as simple as unlocking your phone.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Founded by a team of engineers and security experts, we set
                  out to create a smart locker system that combines cutting-edge
                  IoT technology with robust security measures. Our platform
                  serves individuals, businesses, and educational institutions,
                  providing flexible storage solutions that adapt to modern
                  lifestyles.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Today, SmartLocker is trusted by thousands of users who rely
                  on our system for secure, convenient storage. We continue to
                  innovate and expand, always keeping our users' needs at the
                  forefront of our development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16" data-aos="fade-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Values
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="600"
                >
                  <Card className="group border-2 hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div
              data-aos="zoom-in"
              className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center space-y-6 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Join Us on This Journey
                </h2>
                <p className="text-primary-foreground/80 md:text-xl">
                  Experience the future of storage with SmartLocker
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto text-primary font-bold"
                    >
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/25 hover:border-primary-foreground/80 bg-primary-foreground/10 font-semibold"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

