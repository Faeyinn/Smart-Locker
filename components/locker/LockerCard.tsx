"use client";

import { Locker } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Box, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LockerCardProps {
  locker: Locker;
  onClick: (locker: Locker) => void;
}

export function LockerCard({ locker, onClick }: LockerCardProps) {
  const isAvailable = locker.status === "available";

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => isAvailable && onClick(locker)}
      disabled={!isAvailable}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-colors duration-200 aspect-square",
        isAvailable
          ? "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 cursor-pointer hover:border-black dark:hover:border-white"
          : "bg-neutral-100 dark:bg-neutral-900 border-transparent cursor-not-allowed opacity-60"
      )}
    >
      <div
        className={cn(
          "mb-3 p-3 rounded-full",
          isAvailable
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-neutral-200 text-neutral-400"
        )}
      >
        {isAvailable ? (
          <Box className="w-6 h-6" />
        ) : (
          <Lock className="w-6 h-6" />
        )}
      </div>
      <span className="text-lg font-bold">Locker {locker.number}</span>
      <span
        className={cn(
          "text-xs font-medium uppercase mt-1",
          isAvailable ? "text-green-600" : "text-neutral-400"
        )}
      >
        {locker.status}
      </span>
    </motion.button>
  );
}
