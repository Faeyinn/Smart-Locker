import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-white dark:bg-black">
      <div className="max-w-md space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl">
          Smart
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-800 dark:from-neutral-400 dark:to-white">
            Locker
          </span>
          .
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Secure, fast, and intelligent storage solution. Book your locker in
          seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/login">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-neutral-400">
        &copy; 2025 SmartLocker IoT Project
      </div>
    </div>
  );
}
