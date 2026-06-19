import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listAdminCustomers } from "@/lib/admin-customers";
import { AdminCustomerTable } from "@/components/admin/AdminCustomerTable";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";

export default async function AdminPage() {
  if (!(await requireAdmin())) redirect("/admin/login");

  const customers = await listAdminCustomers();
  const stats = {
    total: customers.length,
    withPin: customers.filter((c) => c.hasPin).length,
    withoutPin: customers.filter((c) => !c.hasPin).length,
    noAccount: customers.filter((c) => !c.hasAccount).length,
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        eyebrow="OS2 Staff"
        title="Customer accounts"
        subtitle={`From Trello · ${stats.total} customers`}
        actions={
          <>
            <Link
              href="/login"
              className="text-[0.8rem] text-white/55 transition-colors hover:text-white"
            >
              Customer portal →
            </Link>
            <AdminLogoutButton />
          </>
        }
      />

      <PageShell>
        <AdminCustomerTable initialCustomers={customers} initialStats={stats} />
      </PageShell>
    </div>
  );
}
