import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  runTransaction,
  writeBatch,
} from "firebase/firestore";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type LockerStatus = "available" | "booked" | "maintenance" | "reserved";

export interface Locker {
  id: string;
  number: number;
  status: LockerStatus;
  currentUserId?: string;
  activeBookingId?: string;
  isLocked?: boolean; // Physical lock status (true = locked, false = unlocked)
  pendingCommand?: "OPEN" | "CLOSE" | null;
}

export interface Booking {
  id: string;
  userId: string;
  lockerId: string;
  qrCode: string;
  status: "active" | "completed" | "pending";
  timestamp: string;
}

// Collection references
const lockersRef = collection(db, "lockers");
const bookingsRef = collection(db, "bookings");
const usersRef = collection(db, "users");

export const getLockers = async (): Promise<Locker[]> => {
  const snapshot = await getDocs(lockersRef);
  // Sort by number
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Locker))
    .sort((a, b) => a.number - b.number);
};

export const getLockerById = async (
  id: string
): Promise<Locker | undefined> => {
  const docSnap = await getDoc(doc(db, "lockers", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Locker;
  }
  return undefined;
};

export const bookLocker = async (
  userId: string,
  lockerId: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
  try {
    return await runTransaction(db, async (transaction) => {
      const lockerRef = doc(db, "lockers", lockerId);
      const lockerDoc = await transaction.get(lockerRef);

      if (!lockerDoc.exists()) {
        return { success: false, error: "Locker not found" };
      }

      const lockerData = lockerDoc.data() as Locker;
      if (lockerData.status !== "available") {
        return { success: false, error: "Locker not available" };
      }

      const bookingId = doc(bookingsRef).id; // Auto-gen ID
      // Use booking ID as QR token for security and uniqueness
      const booking: Booking = {
        id: bookingId,
        userId,
        lockerId,
        qrCode: bookingId, // Use booking ID as QR token
        status: "pending",
        timestamp: new Date().toISOString(),
      };

      transaction.update(lockerRef, {
        status: "booked",
        currentUserId: userId,
        activeBookingId: bookingId,
        isLocked: true,
      });

      transaction.set(doc(db, "bookings", bookingId), booking);

      return { success: true, booking };
    });
  } catch (e: any) {
    console.error("Booking failed: ", e);
    return { success: false, error: e.message };
  }
};

export const cancelBooking = async (
  lockerId: string,
  bookingId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await runTransaction(db, async (transaction) => {
      const lockerRef = doc(db, "lockers", lockerId);
      const bookingRef = doc(db, "bookings", bookingId);

      transaction.update(lockerRef, {
        status: "available",
        currentUserId: null,
        activeBookingId: null,
      });

      transaction.delete(bookingRef);
    });
    return { success: true };
  } catch (e: any) {
    console.error("Cancel booking failed:", e);
    return { success: false, error: e.message };
  }
};

export const verifyBooking = async (bookingId: string) => {
  try {
    await runTransaction(db, async (transaction) => {
      const bookingRef = doc(db, "bookings", bookingId);
      const bookingDoc = await transaction.get(bookingRef);

      if (!bookingDoc.exists()) throw "Booking not found";
      const bookingData = bookingDoc.data() as Booking;

      const lockerRef = doc(db, "lockers", bookingData.lockerId);

      transaction.update(bookingRef, { status: "active" });
      transaction.update(lockerRef, { status: "booked" });
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const completeBooking = async (bookingId: string) => {
  try {
    await runTransaction(db, async (transaction) => {
      const bookingRef = doc(db, "bookings", bookingId);
      const bookingDoc = await transaction.get(bookingRef);

      if (!bookingDoc.exists()) throw "Booking not found";

      const bookingData = bookingDoc.data() as Booking;
      if (bookingData.status === "completed") return; // Already completed

      const lockerRef = doc(db, "lockers", bookingData.lockerId);

      transaction.update(bookingRef, { status: "completed" });
      transaction.update(lockerRef, {
        status: "available",
        currentUserId: null,
        activeBookingId: null,
        isLocked: true,
        pendingCommand: "CLOSE",
      });
    });
    return true;
  } catch (e) {
    console.error("Error completing booking:", e);
    return false;
  }
};

export const adminForceOpen = async (lockerId: string) => {
  try {
    // Similar to completeBooking but starting from lockerId
    await runTransaction(db, async (transaction) => {
      const lockerRef = doc(db, "lockers", lockerId);
      const lockerDoc = await transaction.get(lockerRef);
      if (!lockerDoc.exists()) throw "Locker not found";

      const lockerData = lockerDoc.data() as Locker;

      // If there's an active booking, complete it
      if (lockerData.activeBookingId) {
        const bookingRef = doc(db, "bookings", lockerData.activeBookingId);
        transaction.update(bookingRef, { status: "completed" });
      }

      transaction.update(lockerRef, {
        status: "available",
        currentUserId: null,
        activeBookingId: null,
      });
    });
    return true;
  } catch (e) {
    console.error("Force open failed:", e);
    return false;
  }
};

export const getUserHistory = async (userId: string): Promise<Booking[]> => {
  const q = query(bookingsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Booking))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

export const getActiveBooking = async (
  userId: string
): Promise<Booking | undefined> => {
  const q = query(
    bookingsRef,
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Booking;
  }
  return undefined;
};

export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const snapshot = await getDocs(bookingsRef);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Booking))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
    const updated = await getDoc(userRef);
    return {
      success: true,
      user: { id: updated.id, ...updated.data() } as User,
    };
  } catch (e: unknown) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
};

export const toggleLockerLock = async (
  lockerId: string,
  isLocked: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const lockerRef = doc(db, "lockers", lockerId);
    await updateDoc(lockerRef, { isLocked });
    return { success: true };
  } catch (e: any) {
    console.error("Toggle lock failed:", e);
    return { success: false, error: e.message };
  }
};

// Control locker via HTTP API (for web control after QR validation)
export const controlLocker = async (
  lockerId: string,
  action: "open" | "close",
  userId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/control-locker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lockerId, action, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to control locker",
      };
    }

    return { success: true };
  } catch (e: any) {
    console.error("Control locker failed:", e);
    return { success: false, error: e.message };
  }
};

// Seed function for Admin
export const seedLockers = async () => {
  const batch = writeBatch(db);
  for (let i = 1; i <= 2; i++) {
    const lockerRef = doc(collection(db, "lockers")); // Auto-ID or specific? Let's use auto for now, or named.
    // Actually, named IDs like 'l-1' are easier to read but random is cleaner for DB.
    // Let's stick with auto-id but track number.
    batch.set(lockerRef, {
      number: i,
      status: "available",
      id: lockerRef.id, // Store ID in doc for easier retrieval if needed, or just rely on doc.id
    });
  }
  await batch.commit();
};
