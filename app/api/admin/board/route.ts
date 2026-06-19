import { NextResponse } from "next/server";
import { requireAdmin, getSession } from "@/lib/auth";
import { fetchMemberBoards } from "@/lib/trello";
import { findBoardRef } from "@/lib/board";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const boards = await fetchMemberBoards();
    const session = await getSession();
    return NextResponse.json({
      boards,
      selectedBoardId: session.adminBoardId ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load boards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await request.json();
  if (!boardId || typeof boardId !== "string") {
    return NextResponse.json({ error: "boardId required" }, { status: 400 });
  }

  try {
    const boards = await fetchMemberBoards();
    const board = findBoardRef(boards, boardId);
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const session = await getSession();
    session.adminBoardId = board.ref;
    await session.save();

    return NextResponse.json({
      ok: true,
      boardId: board.ref,
      boardName: board.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to switch board" },
      { status: 500 }
    );
  }
}
