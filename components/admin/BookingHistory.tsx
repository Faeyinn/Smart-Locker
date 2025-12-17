import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking } from "@/lib/data";

export function BookingHistory({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Locker</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium font-mono text-xs">
                {booking.id}
              </TableCell>
              <TableCell className="text-xs">{booking.userId}</TableCell>
              <TableCell>{booking.lockerId}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    booking.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {new Date(booking.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
