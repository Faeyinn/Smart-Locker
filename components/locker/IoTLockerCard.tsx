"use client";

import { Locker, toggleLockerLock } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Lock, LockOpen, Power, RefreshCw, History } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IoTLockerCardProps {
  locker: Locker;
  onUpdate?: () => void;
}

export function IoTLockerCard({ locker, onUpdate }: IoTLockerCardProps) {
  const [loading, setLoading] = useState(false);
  const isLocked = locker.isLocked !== false;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = !isLocked;
      const result = await toggleLockerLock(locker.id, newState);

      if (result.success) {
        toast.success(
          `Locker ${locker.number} ${newState ? "Locked" : "Unlocked"}`
        );
        onUpdate?.();
      } else {
        toast.error("Failed to toggle locker");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Status Bar Header */}
      <div
        className={cn(
          "h-2 w-full transition-colors duration-500",
          isLocked
            ? "bg-neutral-900 dark:bg-neutral-100"
            : "bg-neutral-300 dark:bg-neutral-700"
        )}
      />

      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Unit ID: {locker.id.slice(0, 6)}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 h-5">
                IoT-V2
              </Badge>
            </div>
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-2">
              Locker {locker.number.toString().padStart(2, "0")}
            </h3>
          </div>
          <div
            className={cn(
              "p-3 rounded-xl transition-all duration-300 shadow-sm",
              isLocked
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            )}
          >
            {isLocked ? (
              <Lock className="w-6 h-6" />
            ) : (
              <LockOpen className="w-6 h-6" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-medium text-muted-foreground">
              Current Status
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "relative flex h-2.5 w-2.5",
                  !isLocked && "animate-pulse"
                )}
              >
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isLocked ? "bg-black dark:bg-white" : "bg-neutral-400"
                  )}
                ></span>
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    isLocked
                      ? "bg-neutral-900 dark:bg-neutral-100"
                      : "bg-neutral-500"
                  )}
                ></span>
              </span>
              <span
                className={cn(
                  "font-bold text-lg",
                  isLocked
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500"
                )}
              >
                {isLocked ? "Secure" : "Unlocked"}
              </span>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
              <History className="w-3 h-3" /> Last Activity
            </span>
            <span className="text-sm font-medium tabular-nums">Just now</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6">
        <Button
          size="lg"
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            "w-full h-12 text-base font-semibold transition-all duration-300 relative overflow-hidden group/btn",
            isLocked
              ? "bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-lg shadow-neutral-900/20"
              : "bg-neutral-500 hover:bg-neutral-600 text-white shadow-lg shadow-neutral-500/20"
          )}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Power className="w-5 h-5" />
            )}
            {loading
              ? "Processing Request..."
              : isLocked
              ? "Unlock Device"
              : "Lock Device"}
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
}
