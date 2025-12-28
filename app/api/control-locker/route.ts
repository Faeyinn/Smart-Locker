import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lockerId, action, userId } = body; // action: "open" | "close"

    if (!lockerId || !action) {
      return NextResponse.json(
        { error: "lockerId and action are required" },
        { status: 400 }
      );
    }

    if (!["open", "close"].includes(action)) {
      return NextResponse.json(
        { error: "action must be 'open' or 'close'" },
        { status: 400 }
      );
    }

    // Get locker information
    const lockerRef = doc(db, "lockers", lockerId);

    await runTransaction(db, async (transaction) => {
      const lockerDoc = await transaction.get(lockerRef);

      if (!lockerDoc.exists()) {
        throw new Error("Locker not found");
      }

      const lockerData = lockerDoc.data();

      // Verify user owns the locker if userId is provided
      if (userId && lockerData.currentUserId !== userId) {
        throw new Error("User does not own this locker");
      }

      // Update locker lock status
      // Update locker lock status and set pending command
      const isLocked = action === "close";
      const command = action.toUpperCase(); // "OPEN" or "CLOSE"

      transaction.update(lockerRef, {
        isLocked,
        pendingCommand: command,
      });
    });

    const lockerDoc = await getDoc(lockerRef);
    const lockerData = lockerDoc.data();
    const lockerNumber = lockerData?.number;

    // Return response for ESP32 (if needed) or just success
    return NextResponse.json({
      success: true,
      action: action.toUpperCase(),
      lockerId: lockerNumber,
      message: `Locker ${lockerNumber} ${
        action === "open" ? "opened" : "closed"
      }`,
    });
  } catch (error: any) {
    console.error("Control locker error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      {
        status:
          error.message === "Locker not found" ||
          error.message === "User does not own this locker"
            ? 404
            : 500,
      }
    );
  }
}
