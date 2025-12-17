"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Locker,
  User,
  Booking,
  getLockers,
  getUsers,
  getAllBookings,
  adminForceOpen,
  seedLockers,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { RefreshCw, Unlock, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/AdminStats";
import { UserManagement } from "@/components/admin/UserManagement";
import { BookingHistory } from "@/components/admin/BookingHistory";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const initData = async () => {
      const lockersData = await getLockers();
      const usersData = await getUsers();
      const bookingsData = await getAllBookings();

      setLockers([...lockersData]);
      setUsers([...usersData]);
      setBookings([...bookingsData]);
      setLoading(false);
    };

    initData();
  }, [user, router]);

  const handleRefresh = async () => {
    setLoading(true);
    const lockersData = await getLockers();
    const usersData = await getUsers();
    const bookingsData = await getAllBookings();

    setLockers([...lockersData]);
    setUsers([...usersData]);
    setBookings([...bookingsData]);
    setLoading(false);
  };

  const handleForceOpen = async (lockerId: string) => {
    if (confirm("Are you sure you want to FORCE OPEN this locker?")) {
      await adminForceOpen(lockerId);
      handleRefresh();
    }
  };

  const handleSeed = async () => {
    if (confirm("This will create 20 lockers in the database. Continue?")) {
      setLoading(true);
      await seedLockers();
      await handleRefresh();
      alert("Lockers seeded successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-neutral-500">
              Monitor and manage all system resources.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSeed} className="gap-2">
              <Database className="w-4 h-4" /> Seed DB
            </Button>
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="history">Booking History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminStats
              totalLockers={lockers.length}
              totalUsers={users.length}
              totalBookings={bookings.length}
              activeBookings={
                bookings.filter((b) => b.status === "active").length
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lockers.map((locker) => (
                <Card
                  key={locker.id}
                  className={
                    locker.status === "available"
                      ? "border-neutral-200"
                      : "border-red-200 bg-red-50 dark:bg-red-950/20"
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">
                        Locker #{locker.number}
                      </CardTitle>
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                          locker.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {locker.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {locker.status === "booked" && (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          <p>User: {locker.currentUserId}</p>
                          <p>Booking: {locker.activeBookingId}</p>
                        </div>
                      )}
                      {locker.status === "available" && (
                        <p className="text-sm text-neutral-400 italic">
                          No active booking
                        </p>
                      )}

                      {locker.status !== "available" && (
                        <Button
                          className="w-full mt-2"
                          variant="outline"
                          onClick={() => handleForceOpen(locker.id)}
                        >
                          <Unlock className="w-4 h-4 mr-2" /> Force Open
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} />
          </TabsContent>

          <TabsContent value="history">
            <BookingHistory bookings={bookings} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
