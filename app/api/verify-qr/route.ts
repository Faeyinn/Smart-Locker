import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find booking by qrCode (token)
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("qrCode", "==", token),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    const bookingDoc = snapshot.docs[0];
    const bookingData = bookingDoc.data();
    const bookingId = bookingDoc.id;

    // Get locker information
    const lockerRef = doc(db, "lockers", bookingData.lockerId);
    const lockerDoc = await getDoc(lockerRef);

    if (!lockerDoc.exists()) {
      return NextResponse.json(
        { error: "Locker not found" },
        { status: 404 }
      );
    }

    const lockerData = lockerDoc.data();
    const lockerNumber = lockerData.number;

    // Verify and update booking status
    await runTransaction(db, async (transaction) => {
      // Mark booking as completed
      const bookingRef = doc(db, "bookings", bookingId);
      transaction.update(bookingRef, { status: "completed" });

      // Update locker status
      transaction.update(lockerRef, {
        status: "available",
        currentUserId: null,
        activeBookingId: null,
      });
    });

    // Return response in format expected by ESP32
    return NextResponse.json({
      action: "OPEN",
      lockerId: lockerNumber, // ESP32 expects locker number (1 or 2)
    });
  } catch (error: any) {
    console.error("Verify QR error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

