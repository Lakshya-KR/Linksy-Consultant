import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getSession } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        variant="admin"
        user={{
          name: session.profile.full_name,
          email: session.profile.email,
          role: session.profile.role,
        }}
      />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-10 md:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
