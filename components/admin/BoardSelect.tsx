"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TrelloBoardSummary } from "@/lib/trello";

export function BoardSelect({
  boards,
  selectedBoardId,
}: {
  boards: TrelloBoardSummary[];
  selectedBoardId: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(selectedBoardId);
  const [loading, setLoading] = useState(false);

  async function onChange(next: string) {
    if (next === value || loading) return;
    setLoading(true);
    setValue(next);
    const res = await fetch("/api/admin/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId: next }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setValue(selectedBoardId);
    }
    setLoading(false);
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-[0.75rem] font-medium text-[var(--text-muted)]">Board</span>
      <select
        value={value}
        disabled={loading || boards.length === 0}
        onChange={(e) => onChange(e.target.value)}
        className="input min-w-[12rem] py-1.5 text-[0.8rem]"
      >
        {boards.map((board) => (
          <option key={board.ref} value={board.ref}>
            {board.name}
          </option>
        ))}
      </select>
    </label>
  );
}
