import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdminCustomers } from "@/lib/admin-customers";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await listAdminCustomers();
    const stats = {
      total: customers.length,
      withPin: customers.filter((c) => c.hasPin).length,
      withoutPin: customers.filter((c) => !c.hasPin).length,
      noAccount: customers.filter((c) => !c.hasAccount).length,
    };
    return NextResponse.json({ customers, stats });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load" },
      { status: 500 }
    );
  }
}
