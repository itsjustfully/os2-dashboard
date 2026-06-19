import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchMemberBoards } from "@/lib/trello";
import { pickDefaultBoard } from "@/lib/board";

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  try {
    const boards = await fetchMemberBoards();
    const session = await getSession();
    session.isAdmin = true;
    session.isLoggedIn = false;
    session.adminBoardId = pickDefaultBoard(boards);
    delete session.customerId;
    delete session.displayName;
    delete session.matchValue;
    delete session.boardId;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to reach Trello" },
      { status: 500 }
    );
  }
}
