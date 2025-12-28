import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, runTransaction } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const lockersRef = collection(db, "lockers");
    const snapshot = await getDocs(lockersRef);

    let action = "NONE";
    let lockerId = 0;

    // Find first locker with a pending command
    for (const d of snapshot.docs) {
      const data = d.data();
      if (data.pendingCommand) {
        action = data.pendingCommand;
        lockerId = data.number;

        // Clear the command immediately (Pop)
        // Ideally we wait for ACK, but for simplicity we pop on read
        await runTransaction(db, async (t) => {
          // Verify it still has the command before clearing
          const currentDoc = await t.get(d.ref);
          if (
            currentDoc.exists() &&
            currentDoc.data().pendingCommand === action
          ) {
            t.update(d.ref, { pendingCommand: null });
          }
        });

        break; // Handle one command at a time
      }
    }

    const states: Record<string, { lock: string; usage: string }> = {};
    const sortedDocs = snapshot.docs.sort(
      (a, b) => a.data().number - b.data().number
    );

    sortedDocs.forEach((d) => {
      const data = d.data();
      states[data.number] = {
        lock: data.isLocked ? "CLOSED" : "OPEN",
        usage: data.status === "available" ? "AVAILABLE" : "USED",
      };
    });

    return NextResponse.json({
      action,
      lockerId,
      states,
    });
  } catch (error: any) {
    console.error("Check commands error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
