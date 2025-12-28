"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getActiveBooking, completeBooking, Booking, getLockerById, Locker } from "@/lib/data";
import { QRCodeDisplay } from "@/components/booking/QRCodeDisplay";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TicketPage() {
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [locker, setLocker] = useState<Locker | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBooking = async () => {
      if (!user) return;
      setBooking(null);
      setLocker(null);
      const active = await getActiveBooking(user.id);
      if (active) {
        setBooking(active);
        // Load locker info
        const lockerData = await getLockerById(active.lockerId);
        if (lockerData) {
          setLocker(lockerData);
        }
      }
      setLoading(false);
    };

    if (user) {
      loadBooking();
    }
  }, [user]);

  const handleScanConfirm = async () => {
    if (!booking) return;
    await completeBooking(booking.id);
    router.push("/history");
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold">No Active Ticket</h2>
        <p className="text-neutral-500 max-w-xs">
          You don&apos;t have any active booking. Go to dashboard to book a
          locker.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Book Locker</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 flex flex-col items-center">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Your Ticket</h1>
        <p className="text-neutral-500">Scan this QR code at the locker.</p>
      </div>

      <Card className="w-full max-w-sm border-black/10 shadow-xl overflow-hidden">
        <div className="h-2 bg-black w-full" />
        <CardHeader className="text-center pb-2">
          <CardTitle>Locker Access</CardTitle>
          <CardDescription>
            {locker ? `Locker #${locker.number}` : "Booking ID: " + booking.id.slice(0, 8)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6 space-y-6">
          <QRCodeDisplay value={booking.qrCode} />
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">
              Booking ID
            </p>
            <p className="text-lg font-mono font-bold tracking-wider mt-1 break-all px-2">
              {booking.qrCode}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full" size="lg">
                Simulate Scan (Finish)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="text-center sm:text-center">
                <AlertDialogTitle>Scan QR Code?</AlertDialogTitle>
                <AlertDialogDescription className="text-center sm:text-center">
                  This action will simulate scanning the QR code, opening your
                  locker, and ending your session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleScanConfirm}>
                  Confirm & Open
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
