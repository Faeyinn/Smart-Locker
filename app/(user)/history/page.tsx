"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserHistory, Booking } from "@/lib/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      getUserHistory(user.id).then(setHistory);
    }
  }, [user]);

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-neutral-500">Your past locker usages.</p>
      </div>

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
                  {item.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Locker #{item.lockerId}</h3>
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
    </div>
  );
}
