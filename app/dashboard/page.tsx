import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { fetchCustomerOrders } from "@/lib/trello";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";
import { OrdersTable } from "@/components/orders/OrdersTable";

export default async function DashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const orders = await fetchCustomerOrders(session.matchValue!, session.boardId!);

  return (
    <div className="min-h-screen">
      <AppHeader
        eyebrow="OS2 Performance Apparel"
        title={session.displayName ?? "Orders"}
        subtitle={`${orders.length} ${orders.length === 1 ? "order" : "orders"} in production`}
        actions={<LogoutButton />}
      />

      <PageShell>
        {orders.length === 0 ? (
          <div className="card card-padded text-center">
            <p className="text-base font-medium text-[var(--text-primary)]">No orders found</p>
            <p className="mt-2 text-[0.867rem] text-[var(--text-muted)]">
              Contact OS2 if you believe this is an error.
            </p>
          </div>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </PageShell>
    </div>
  );
}
