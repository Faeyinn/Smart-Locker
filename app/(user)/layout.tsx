import MobileNav from "@/components/layout/MobileNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
      <main className="container max-w-md mx-auto p-4">{children}</main>
      <MobileNav />
    </div>
  );
}
