import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { postOrderAttachment } from "@/lib/trello";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }

  const { id } = await params;

  try {
    await postOrderAttachment(id, session.matchValue!, file);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
