import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  generatePinForCustomer,
  bulkGeneratePins,
} from "@/lib/admin-customers";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    if (body.action === "bulk") {
      const results = await bulkGeneratePins();
      return NextResponse.json({ results });
    }

    if (body.action === "single" && body.matchValue) {
      const result = await generatePinForCustomer(body.matchValue);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
