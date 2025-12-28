"use client";

import { useEffect, useState } from "react";
import { Locker, getLockers, seedLockers } from "@/lib/data";
import { UserLockerCard } from "@/components/locker/UserLockerCard";
import {
  Loader2,
  RefreshCcw,
  Box,
  Lock,
  Package,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      setLockers([...data]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const availableLockers = lockers.filter((l) => l.status === "available").length;
  const bookedLockers = lockers.filter((l) => l.status === "booked").length;
  const lockedLockers = lockers.filter((l) => l.isLocked !== false).length;

  return (
    <div className="space-y-8 pt-6 pb-20">
      {/* Header Section */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8"
        data-aos="fade-down"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Kelola loker Anda dengan mudah. Generate QR code untuk akses atau kontrol langsung dari web.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchLockers}
            variant="outline"
            className="h-11 px-6 shadow-sm hover:shadow-md transition-all"
            disabled={loading}
          >
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow duration-300 bg-white dark:bg-neutral-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Total Loker</CardTitle>
            <Package className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{lockers.length}</div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Semua unit loker
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow duration-300 bg-white dark:bg-neutral-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Tersedia</CardTitle>
            <Box className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {availableLockers}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Siap digunakan
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow duration-300 bg-white dark:bg-neutral-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Terpakai</CardTitle>
            <Users className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {bookedLockers}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Sedang digunakan
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow duration-300 bg-white dark:bg-neutral-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Terkunci</CardTitle>
            <Lock className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {lockedLockers}/{lockers.length}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Status keamanan aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Locker Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight"
              data-aos="fade-right"
            >
              Daftar Loker
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih loker untuk melihat detail dan kelola akses
            </p>
          </div>
        </div>

        {loading && lockers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">
                Memuat daftar loker...
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {lockers.map((locker, index) => (
              <div
                key={locker.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="transition-transform duration-300 hover:scale-[1.02]"
              >
                <UserLockerCard locker={locker} onUpdate={fetchLockers} />
              </div>
            ))}

            {lockers.length === 0 && !loading && (
              <Card className="col-span-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
                  <div className="p-4 bg-muted/50 rounded-full">
                    <Box className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Tidak Ada Loker</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Database loker masih kosong. Inisialisasi data demo untuk memulai.
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
                    Inisialisasi Data Demo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
