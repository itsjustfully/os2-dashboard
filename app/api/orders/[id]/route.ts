import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { fetchOrderDetail } from "@/lib/trello";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await fetchOrderDetail(id, session.matchValue!, session.boardId!);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
