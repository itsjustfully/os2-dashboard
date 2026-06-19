import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";

export default async function AdminLoginPage() {
  if (await requireAdmin()) redirect("/admin");

  return (
    <div className="min-h-screen">
      <AppHeader eyebrow="OS2 Staff" title="Admin" subtitle="Authorized access only" />
      <PageShell className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center">
        <AdminLoginForm />
      </PageShell>
    </div>
  );
}
