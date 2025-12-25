"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, History, Ticket, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Home",
      icon: LayoutGrid,
    },
    {
      href: "/ticket",
      label: "Ticket",
      icon: Ticket,
    },
    {
      href: "/history",
      label: "History",
      icon: History,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pb-safe pb-2 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive
                  ? "text-black dark:text-white"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              )}
            >
              <item.icon
                className={cn("w-6 h-6", isActive && "fill-current")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
