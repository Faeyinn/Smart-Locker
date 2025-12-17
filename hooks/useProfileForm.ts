"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateUser } from "@/lib/data";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function useProfileForm() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // 1. Update Firestore Data (Name)
      if (formData.name !== user.name) {
        await updateUser(user.id, { name: formData.name });
        await updateProfile(auth.currentUser, { displayName: formData.name });
      }

      // 2. Update Password (if provided)
      if (formData.password) {
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await updatePassword(auth.currentUser, formData.password);
      }

      setSuccess("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" })); // Clear password field
    } catch (err: unknown) {
      console.error(err);
      const firebaseError = err as { code?: string; message: string };
      if (firebaseError.code === "auth/requires-recent-login") {
        setError("To change sensitive info, please logout and login again.");
      } else {
        setError(firebaseError.message || "Failed to update profile");
      }
    }
    setLoading(false);
  };

  // Logout flow
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // 1. Close confirm dialog
    setShowLogoutConfirm(false);

    // 2. Show Success Toast
    toast({
      title: "Logout Successful",
      description: "You have been securely logged out. Redirecting...",
      duration: 3000,
      className: "bg-green-500 text-white border-none",
    });

    // 3. Delay then actual logout
    setTimeout(async () => {
      await logout();
      router.push("/login"); // Explicit redirect in case logout() doesn't
    }, 3000);
  };

  return {
    user,
    formData,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
    logout, // Keep original available
    showLogoutConfirm,
    setShowLogoutConfirm,
    handleLogout,
  };
}
