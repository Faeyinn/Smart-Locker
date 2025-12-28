"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Smartphone,
  Zap,
  Clock,
  CheckCircle2,
  Box,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function FeaturesPage() {
  const features = [
    {
      icon: Shield,
      title: "Top-Tier Security",
      description:
        "Advanced encryption and physical security measures ensure your belongings are always safe and protected. Our multi-layer security system includes biometric access, encrypted communication, and 24/7 monitoring.",
      gradient: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Smartphone,
      title: "Mobile Control",
      description:
        "Book, unlock, and manage your locker directly from your smartphone. No keys needed, just your phone. Available on iOS and Android with seamless synchronization across devices.",
      gradient: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description:
        "Zero waiting time. Scan your QR code or use the app to access your locker instantly, anytime. Our smart system recognizes you in seconds.",
      gradient: "from-yellow-500/10 to-yellow-600/5",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Access your stored items whenever you need them, day or night. No time restrictions, no office hours - your locker is always available.",
      gradient: "from-green-500/10 to-green-600/5",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: CheckCircle2,
      title: "Real-time Monitoring",
      description:
        "Live status updates and logs for administrators to ensure system integrity and security. Get instant notifications for all locker activities.",
      gradient: "from-red-500/10 to-red-600/5",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: Box,
      title: "Flexible Sizing",
      description:
        "Various locker sizes available to accommodate everything from documents to large bags. Choose the perfect size for your needs.",
      gradient: "from-indigo-500/10 to-indigo-600/5",
      iconColor: "text-indigo-600 dark:text-indigo-400",
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
                  Features
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Powerful Features for
                <br />
                <span className="text-primary">Modern Storage</span>
              </h1>
              <p className="mx-auto text-muted-foreground text-lg md:text-xl">
                Discover all the features that make SmartLocker the perfect
                solution for your storage needs.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="600"
                >
                  <Card className="group border-2 hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
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
                  Ready to Experience These Features?
                </h2>
                <p className="text-primary-foreground/80 md:text-xl">
                  Join thousands of users who trust SmartLocker for their daily
                  storage needs.
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

