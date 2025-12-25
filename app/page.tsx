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
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Shield,
  Smartphone,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

          <div className="container px-4 md:px-6 mx-auto text-center space-y-6">
            <h1
              data-aos="zoom-in"
              data-aos-delay="100"
              className="text-4xl pt-6 md:text-6xl lg:text-7xl font-extrabold tracking-tight"
            >
              Secure Storage, <br className="hidden md:inline" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Reinvented.
              </span>
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl"
            >
              Experience the next generation of smart lockers. Secure, fast, and
              fully automated storage solutions for modern workspaces and
              campuses.
            </p>
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              {user ? (
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base px-8 h-12"
                  >
                    Dashboard <LayoutDashboard className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base px-8 h-12"
                  >
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 h-12"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why SmartLocker?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Built with security and convenience in mind, our system provides
                everything you need to manage storage efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Top-Tier Security",
                  description:
                    "Advanced encryption and physical security measures ensure your belongings are always safe.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Control",
                  description:
                    "Book, unlock, and manage your locker directly from your smartphone. No keys needed.",
                },
                {
                  icon: Zap,
                  title: "Instant Access",
                  description:
                    "Zero waiting time. Scan your QR code or use the app to access your locker instantly.",
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description:
                    "Access your stored items whenever you need them, day or night.",
                },
                {
                  icon: CheckCircle2,
                  title: "Real-time Monitoring",
                  description:
                    "Live status updates and logs for administrators to ensure system integrity.",
                },
                {
                  icon: Box,
                  title: "Flexible Sizing",
                  description:
                    "Various locker sizes available to accommodate everything from documents to large bags.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
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
                  Ready to secure your stuff?
                </h2>
                <p className="text-primary-foreground/80 md:text-xl">
                  Join thousands of users who trust SmartLocker for their daily
                  storage needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  {user ? (
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                    >
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full sm:w-auto text-primary font-bold"
                      >
                        Dashboard <LayoutDashboard className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full sm:w-auto text-primary font-bold"
                      >
                        Create Free Account
                      </Button>
                    </Link>
                  )}
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
