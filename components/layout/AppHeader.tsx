import { cn } from "@/lib/utils";

type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function AppHeader({ eyebrow, title, subtitle, actions, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-white/10 bg-[var(--navy)] text-white shadow-[0_4px_24px_rgba(12,35,64,0.18)]",
        className
      )}
    >
      <div className="header-inner flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[0.733rem] font-medium uppercase tracking-[0.14em] text-white/50">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[1.2rem] font-semibold tracking-tight text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-[0.867rem] text-white/60">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
