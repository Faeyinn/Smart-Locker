"use client";

import { useState, useEffect } from "react";
import { Locker, getLockers, bookLocker } from "@/lib/data";
import { LockerCard } from "./LockerCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function LockerGrid() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const reloadLockers = async () => {
    setLoading(true);
    const data = await getLockers();
    setLockers([...data]);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const data = await getLockers();
      setLockers([...data]);
      setLoading(false);
    };
    init();
  }, []);

  const handleLockerClick = (locker: Locker) => {
    setSelectedLocker(locker);
  };

  const confirmBooking = async () => {
    if (!selectedLocker || !user) return;

    setBookingLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = await bookLocker(user.id, selectedLocker.id);
    setBookingLoading(false);

    if (result.success) {
      router.push("/ticket");
    } else {
      alert(result.error);
      setSelectedLocker(null);
      reloadLockers();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 pb-24">
        {lockers.map((locker) => (
          <LockerCard
            key={locker.id}
            locker={locker}
            onClick={handleLockerClick}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      <AlertDialog
        open={!!selectedLocker}
        onOpenChange={(open) => !open && setSelectedLocker(null)}
      >
        <AlertDialogContent className="w-[90%] sm:max-w-md rounded-2xl">
          <AlertDialogHeader className="text-center sm:text-center">
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-center sm:text-center">
              Are you sure you want to book{" "}
              <span className="font-bold text-foreground">
                Locker {selectedLocker?.number}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:justify-center">
            <AlertDialogCancel
              className="flex-1 mt-0"
              disabled={bookingLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmBooking();
              }}
              disabled={bookingLoading}
              className="flex-1 bg-black text-white dark:bg-white dark:text-black"
            >
              {bookingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
