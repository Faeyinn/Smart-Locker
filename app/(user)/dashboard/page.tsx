import { LockerGrid } from "@/components/locker/LockerGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Select Locker</h1>
        <p className="text-neutral-500">Choose an available locker to start.</p>
      </div>

      <LockerGrid />
    </div>
  );
}
