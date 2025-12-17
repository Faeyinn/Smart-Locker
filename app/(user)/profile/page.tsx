"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/user/ProfileForm";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 pb-24">
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 pt-12">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-neutral-500">Manage your account settings</p>
      </div>
      
      <div className="p-6 max-w-md mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
}
