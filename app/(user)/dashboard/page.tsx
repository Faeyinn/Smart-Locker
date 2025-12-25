"use client";

import { useEffect, useState } from "react";
import { Locker, getLockers, seedLockers } from "@/lib/data";
import { IoTLockerCard } from "@/components/locker/IoTLockerCard";
import {
  Loader2,
  RefreshCcw,
  Server,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleInitialize = async () => {
    setIsSeeding(true);
    try {
      await seedLockers();
      await fetchLockers();
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchLockers = async () => {
    try {
      setLoading(true);
      const data = await getLockers();
      setLockers(data.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const activeDevices = lockers.length;
  const lockedDevices = lockers.filter((l) => l.isLocked !== false).length;

  return (
    <div className="space-y-8 pt-6 pb-20">
      {/* Header Section */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8"
        data-aos="fade-down"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            IoT Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Monitor and control your SmartLocker fleet geographically. Real-time
            status updates and physical access control.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchLockers}
            variant="outline"
            className="h-11 px-6 shadow-sm"
          >
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Sync Status
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3" data-aos="fade-up">
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDevices} Units</div>
            <p className="text-xs text-muted-foreground">
              Connected to IoT Gateway
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Online
            </div>
            <p className="text-xs text-muted-foreground">
              Latency: {Math.floor(Math.random() * 20 + 10)}ms
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <ShieldCheck className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lockedDevices}/{activeDevices} Locked
            </div>
            <p className="text-xs text-muted-foreground">
              Physical security active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <h2
          className="text-xl font-semibold tracking-tight"
          data-aos="fade-right"
        >
          Device Control
        </h2>

        {loading && lockers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 bg-muted/20 rounded-xl border border-dashed">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">
              Scanning network for devices...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {lockers.map((locker, index) => (
              <div
                key={locker.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <IoTLockerCard locker={locker} onUpdate={fetchLockers} />
              </div>
            ))}

            {lockers.length === 0 && !loading && (
              <div
                className="col-span-full flex flex-col items-center justify-center py-16 bg-muted/20 rounded-3xl border border-dashed space-y-6"
                data-aos="zoom-in"
              >
                <div className="p-4 bg-background rounded-full shadow-sm">
                  <Server className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">No Devices Found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    The system database appears to be empty or connection was
                    lost.
                  </p>
                </div>
                <Button
                  onClick={handleInitialize}
                  disabled={isSeeding}
                  size="lg"
                  className="px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  {isSeeding && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Initialize Demo Data
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
