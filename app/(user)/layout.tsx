import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">{children}</div>
      </main>
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
