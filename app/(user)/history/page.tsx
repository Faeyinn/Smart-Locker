"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserHistory, Booking, getLockerById, Locker } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Calendar, Loader2 } from "lucide-react";

interface BookingWithLocker extends Booking {
  lockerNumber?: number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<BookingWithLocker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const bookings = await getUserHistory(user.id);
        // Enrich with locker numbers
        const enrichedBookings = await Promise.all(
          bookings.map(async (booking) => {
            const locker = await getLockerById(booking.lockerId);
            return {
              ...booking,
              lockerNumber: locker?.number,
            };
          })
        );
        setHistory(enrichedBookings);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-neutral-500">Your past locker usages.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid gap-4">
          {history.length === 0 && (
            <p className="text-neutral-500 text-center py-10">
              No history found.
            </p>
          )}
          {history.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="p-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-neutral-400">
                    {item.id.slice(0, 8)}...
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">
                    Locker {item.lockerNumber ? `#${item.lockerNumber}` : `#${item.lockerId.slice(0, 6)}`}
                  </h3>
                </div>
                <div className="flex items-center text-sm text-neutral-500 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
