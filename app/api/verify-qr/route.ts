import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    console.log("[API] Received verify-qr request with token:", token);

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Find booking by qrCode (token)
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("qrCode", "==", token));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("[API] No booking found for token:", token);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    const bookingDocInitial = snapshot.docs[0];
    const bookingDataInitial = bookingDocInitial.data();

    // Check if booking is pending or active
    if (
      bookingDataInitial.status !== "pending" &&
      bookingDataInitial.status !== "active"
    ) {
      console.log(
        "[API] Booking status not allowed:",
        bookingDataInitial.status
      );
      return NextResponse.json(
        { error: `Booking is ${bookingDataInitial.status}` },
        { status: 400 }
      );
    }

    const lockerId = bookingDataInitial.lockerId;
    if (!lockerId) {
      return NextResponse.json(
        { error: "Booking missing lockerId" },
        { status: 500 }
      );
    }

    let lockerNumber = 0;

    // Correct Transaction Pattern: Fetch inside the transaction
    await runTransaction(db, async (transaction) => {
      const bookingRef = doc(db, "bookings", bookingDocInitial.id);
      const lockerRef = doc(db, "lockers", lockerId);

      const bDoc = await transaction.get(bookingRef);
      const lDoc = await transaction.get(lockerRef);

      if (!bDoc.exists() || !lDoc.exists()) {
        throw new Error(
          "Booking or Locker document missing during transaction"
        );
      }

      const bData = bDoc.data();
      const lData = lDoc.data();
      lockerNumber = lData.number;

      if (bData.status === "pending") {
        console.log(
          "[API] Activating booking for locker number:",
          lockerNumber
        );
        transaction.update(bookingRef, { status: "active" });
        transaction.update(lockerRef, {
          status: "booked",
          isLocked: false, // Unlock initially on first scan
        });
      } else {
        console.log("[API] Unlocking already active locker:", lockerNumber);
        // Just unlock if already active (subsequent scans)
        transaction.update(lockerRef, { isLocked: false });
      }
    });

    console.log("[API] Verification successful for locker:", lockerNumber);

    // Return response in format expected by ESP32
    return NextResponse.json({
      action: "OPEN",
      lockerId: lockerNumber,
    });
  } catch (error: any) {
    console.error("[API] Verify QR error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
