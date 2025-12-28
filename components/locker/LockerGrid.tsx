"use client";

import { useState, useEffect } from "react";
import { Locker, getLockers } from "@/lib/data";
import { UserLockerCard } from "./UserLockerCard";
import { Loader2 } from "lucide-react";

export function LockerGrid() {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadLockers = async () => {
    setLoading(true);
    try {
      const data = await getLockers();
      setLockers([...data]);
    } catch (error) {
      console.error("Failed to reload lockers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getLockers();
        setLockers([...data]);
      } catch (error) {
        console.error("Failed to load lockers:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 pb-24">
      {lockers.map((locker) => (
        <UserLockerCard
          key={locker.id}
          locker={locker}
          onUpdate={reloadLockers}
        />
      ))}
    </div>
  );
}
