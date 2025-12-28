"use client";

import {
  Locker,
  bookLocker,
  controlLocker,
  cancelBooking,
  completeBooking,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { Box, Lock, LockOpen, Loader2, X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface UserLockerCardProps {
  locker: Locker;
  onUpdate?: () => void;
}

export function UserLockerCard({ locker, onUpdate }: UserLockerCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isAvailable = locker.status === "available";
  const isReserved = locker.status === "reserved";
  // Treat reserved as booked since we removed QR validation
  const isBooked = locker.status === "booked" || locker.status === "reserved";
  const isOwnedByUser = user && locker.currentUserId === user.id;
  const isLocked = locker.isLocked !== false; // Default to locked if undefined

  const handleBookLocker = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await bookLocker(user.id, locker.id);
      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Loker siap digunakan.",
        });
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!locker.activeBookingId) return;
    setLoading(true);
    try {
      const result = await cancelBooking(locker.id, locker.activeBookingId);
      if (result.success) {
        toast({
          title: "Booking Cancelled",
          description: "Booking telah dibatalkan.",
        });
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleControlLocker = async (action: "open" | "close") => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await controlLocker(locker.id, action, user.id);
      if (result.success) {
        toast({
          title: "Success",
          description: `Locker ${action === "open" ? "opened" : "closed"}`,
        });
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to control locker",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteUsage = async () => {
    if (!locker.activeBookingId) return;
    setLoading(true);
    try {
      const result = await completeBooking(locker.activeBookingId);
      if (result) {
        toast({
          title: "Selesai",
          description: "Terima kasih telah menggunakan layanan ini.",
        });
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: "Gagal menyelesaikan sesi",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950",
          !isAvailable && !isOwnedByUser && "opacity-60",
          (isReserved || isBooked) &&
            isOwnedByUser &&
            "ring-2 ring-neutral-900 dark:ring-neutral-100"
        )}
      >
        {/* Status Bar */}
        <div
          className={cn(
            "h-1.5 w-full transition-colors",
            isAvailable
              ? "bg-neutral-900 dark:bg-neutral-100"
              : isReserved
              ? "bg-neutral-500"
              : isBooked && isOwnedByUser
              ? "bg-black dark:bg-white"
              : "bg-neutral-300 dark:bg-neutral-700"
          )}
        />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  LOKER #{locker.number.toString().padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Unit {locker.number}
              </h3>
            </div>
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                isAvailable
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : isBooked && isOwnedByUser && isLocked
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black" // Secure locked
                  : isBooked && isOwnedByUser && !isLocked
                  ? "bg-white border border-neutral-200 text-neutral-900 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-100" // Unlocked
                  : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
              )}
            >
              {isAvailable ? (
                <Box className="w-5 h-5" />
              ) : isBooked && isOwnedByUser ? (
                isLocked ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <LockOpen className="w-5 h-5" />
                )
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center justify-between py-2 border-t border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Status
            </span>
            <Badge
              variant="outline"
              className={cn(
                "font-semibold border text-neutral-900 dark:text-neutral-100",
                isAvailable && "bg-neutral-100 border-neutral-200",
                isReserved &&
                  isOwnedByUser &&
                  "bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700",
                isBooked &&
                  isOwnedByUser &&
                  "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-black dark:border-neutral-100",
                !isAvailable &&
                  !isOwnedByUser &&
                  "bg-neutral-100 text-neutral-500"
              )}
            >
              {isAvailable
                ? "Tersedia"
                : !isOwnedByUser
                ? "Terpakai"
                : isBooked
                ? isLocked
                  ? "Terkunci"
                  : "Terbuka"
                : "Terpakai"}
            </Badge>
          </div>

          {/* Action Area */}
          <div className="space-y-3">
            {isAvailable && (
              <Button
                onClick={handleBookLocker}
                disabled={loading}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <Box className="w-4 h-4 mr-2" />
                    Gunakan Locker
                  </>
                )}
              </Button>
            )}

            {isBooked && isOwnedByUser && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleControlLocker("open")}
                    disabled={loading || !isLocked}
                    variant="outline"
                    className={cn("flex-1 h-12", !isLocked && "opacity-50")}
                  >
                    {loading && !isLocked ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LockOpen className="w-4 h-4 mr-2" />
                    )}
                    Buka
                  </Button>
                  <Button
                    onClick={() => handleControlLocker("close")}
                    disabled={loading || isLocked}
                    variant="outline"
                    className={cn("flex-1 h-12", isLocked && "opacity-50")}
                  >
                    {loading && isLocked ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Tutup
                  </Button>
                </div>
                <Button
                  onClick={handleCompleteUsage}
                  disabled={loading}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-950/30 dark:border-red-900"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Selesai
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
