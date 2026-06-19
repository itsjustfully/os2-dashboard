"use client";

import { PORTAL_STAGES, getStageIndex, READY_FOR_SHIPPING_ID } from "@/lib/stages";
import { cn } from "@/lib/utils";

export function StageProgress({ currentListId }: { currentListId: string }) {
  const currentIndex = getStageIndex(currentListId);
  const isReadyToShip = currentListId === READY_FOR_SHIPPING_ID;
  const effectiveIndex = isReadyToShip ? 5 : currentIndex;

  return (
    <div className="space-y-5">
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between px-2">
          <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-[var(--border)]" />
          {PORTAL_STAGES.map((stage, i) => {
            const done = effectiveIndex > i;
            const active = effectiveIndex === i || (isReadyToShip && i === 5);
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-[0.8rem] font-semibold transition-colors",
                    done && "border-[var(--navy)] bg-[var(--surface-muted)] text-[var(--navy)]",
                    active && "border-[var(--navy)] bg-[var(--navy)] text-white shadow-[0_4px_14px_rgba(12,35,64,0.2)]",
                    !done && !active && "border-[var(--border)] bg-white text-[var(--text-muted)]"
                  )}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "max-w-[5rem] text-center text-[0.733rem] font-medium leading-tight",
                    active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {stage.shortName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5 md:hidden">
        {PORTAL_STAGES.map((stage, i) => {
          const done = effectiveIndex > i;
          const active = effectiveIndex === i || (isReadyToShip && i === 5);
          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-3.5 rounded-[var(--radius-xl)] border px-4 py-3",
                active && "border-[var(--navy)] bg-[var(--surface-muted)]",
                done && !active && "border-[var(--border)] bg-white",
                !done && !active && "border-[var(--border)] bg-white"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-semibold",
                  done && "bg-[var(--surface-muted)] text-[var(--navy)]",
                  active && "bg-[var(--navy)] text-white",
                  !done && !active && "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <div>
                <p
                  className={cn(
                    "text-[0.867rem] font-medium",
                    active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {stage.name}
                </p>
                {active && (
                  <p className="text-[0.8rem] text-[var(--text-muted)]">Current stage</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
