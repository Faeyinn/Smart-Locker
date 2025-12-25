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
    <div className="space-y-6 pt-6">
      <div className="space-y-0.5" data-aos="fade-down" data-aos-duration="800">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
        <ProfileForm />
      </div>
    </div>
  );
}
