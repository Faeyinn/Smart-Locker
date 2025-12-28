"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/data";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isRegistering = React.useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore to get role and name
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || "User",
              email: firebaseUser.email!,
              role: userData.role || "user",
            });
          } else {
            // Fallback if doc doesn't exist yet (shouldn't happen if registered correctly)
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email!,
              role: "user",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle protected routes and redirects
  useEffect(() => {
    if (loading) return;

    // Public paths that don't require authentication
    const publicPaths = [
      "/login",
      "/register",
      "/",
      "/features",
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms-of-service",
      "/cookie-policy",
    ];
    const authRedirectPaths = ["/login", "/register"]; // Only redirect from these if logged in
    const isPublicPath = publicPaths.includes(pathname);
    const shouldRedirectIfAuth = authRedirectPaths.includes(pathname);

    if (user && shouldRedirectIfAuth && !isRegistering.current) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else if (!user && !isPublicPath) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation is handled by the component calling login or by a separate effect if needed.
      // But typically we wait for onAuthStateChanged.
      // For smoother UX, we can let the caller handle redirect on success.
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      isRegistering.current = true; // Set flag to prevent auto-redirect
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create user document in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        name,
        email,
        role: "user",
      });
      // Sign out immediately so they have to log in manually
      await signOut(auth);
      isRegistering.current = false; // Reset flag
    } catch (error) {
      console.error("Registration failed", error);
      isRegistering.current = false; // Reset flag on error
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-black dark:border-white"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
