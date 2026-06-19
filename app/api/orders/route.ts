import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { fetchCustomerOrders } from "@/lib/trello";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await fetchCustomerOrders(session.matchValue!, session.boardId!);
  return NextResponse.json({ orders });
}
