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
  QrCode,
  Lock,
  Search,
  UserPlus,
  Calendar,
  BarChart3,
  Bell,
  Settings,
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
        <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16" data-aos="fade-up">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Features
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose SmartLocker?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Built with security and convenience in mind, our system provides
                everything you need to manage storage efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Shield,
                  title: "Top-Tier Security",
                  description:
                    "Advanced encryption and physical security measures ensure your belongings are always safe and protected.",
                  gradient: "from-blue-500/10 to-blue-600/5",
                  iconColor: "text-blue-600 dark:text-blue-400",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Control",
                  description:
                    "Book, unlock, and manage your locker directly from your smartphone. No keys needed, just your phone.",
                  gradient: "from-purple-500/10 to-purple-600/5",
                  iconColor: "text-purple-600 dark:text-purple-400",
                },
                {
                  icon: Zap,
                  title: "Instant Access",
                  description:
                    "Zero waiting time. Scan your QR code or use the app to access your locker instantly, anytime.",
                  gradient: "from-yellow-500/10 to-yellow-600/5",
                  iconColor: "text-yellow-600 dark:text-yellow-400",
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description:
                    "Access your stored items whenever you need them, day or night. No time restrictions.",
                  gradient: "from-green-500/10 to-green-600/5",
                  iconColor: "text-green-600 dark:text-green-400",
                },
                {
                  icon: CheckCircle2,
                  title: "Real-time Monitoring",
                  description:
                    "Live status updates and logs for administrators to ensure system integrity and security.",
                  gradient: "from-red-500/10 to-red-600/5",
                  iconColor: "text-red-600 dark:text-red-400",
                },
                {
                  icon: Box,
                  title: "Flexible Sizing",
                  description:
                    "Various locker sizes available to accommodate everything from documents to large bags.",
                  gradient: "from-indigo-500/10 to-indigo-600/5",
                  iconColor: "text-indigo-600 dark:text-indigo-400",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-duration="600"
                >
                  <Card className="group border-2 hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
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

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="text-center space-y-4 mb-16" data-aos="fade-up">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Process
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Get started with SmartLocker in just a few simple steps. It's quick, easy, and secure.
              </p>
            </div>

            {/* Steps for Users */}
            <div className="mb-20" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold text-center mb-12 text-muted-foreground">
                For Users
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[
                  {
                    step: "01",
                    icon: UserPlus,
                    title: "Create Account",
                    description: "Sign up for free and verify your account. It takes less than a minute to get started.",
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    step: "02",
                    icon: Search,
                    title: "Find Available Locker",
                    description: "Browse through available lockers in your location. Filter by size and location.",
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    step: "03",
                    icon: Calendar,
                    title: "Book Your Locker",
                    description: "Select your preferred locker and booking duration. Confirm your reservation.",
                    color: "from-green-500 to-green-600",
                  },
                  {
                    step: "04",
                    icon: QrCode,
                    title: "Access with QR Code",
                    description: "Scan the QR code or use the app to unlock your locker. Store and retrieve items anytime.",
                    color: "from-orange-500 to-orange-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                    data-aos-duration="600"
                    className="relative"
                  >
                    {/* Connection Line (Desktop Only) */}
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -z-10">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/50"></div>
                      </div>
                    )}
                    
                    <Card className="group border-2 hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 text-center">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col items-center space-y-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className="w-8 h-8" />
                          </div>
                          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{item.step}</span>
                          </div>
                          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                            {item.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps for Admins */}
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-bold text-center mb-12 text-muted-foreground">
                For Administrators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[
                  {
                    icon: Settings,
                    title: "System Configuration",
                    description: "Set up locker locations, sizes, and system parameters. Configure access rules and security settings.",
                    gradient: "from-blue-500/20 to-blue-600/10",
                    iconColor: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    icon: BarChart3,
                    title: "Monitor & Analytics",
                    description: "Track usage statistics, monitor locker status in real-time, and generate comprehensive reports.",
                    gradient: "from-purple-500/20 to-purple-600/10",
                    iconColor: "text-purple-600 dark:text-purple-400",
                  },
                  {
                    icon: Bell,
                    title: "Manage Users",
                    description: "Handle user registrations, manage bookings, resolve issues, and maintain system security.",
                    gradient: "from-green-500/20 to-green-600/10",
                    iconColor: "text-green-600 dark:text-green-400",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                    data-aos-duration="600"
                  >
                    <Card className="group border-2 hover:border-primary/50 transition-all duration-300 h-full bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                      <CardHeader className="pb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                        </div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Flow Diagram */}
            <div className="mt-20" data-aos="zoom-in" data-aos-delay="300">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-8 md:p-12">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Register</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Search className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Find Locker</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Book</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Access</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Secure</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
