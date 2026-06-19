import { cn } from "@/lib/utils";

type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  loading?: boolean;
};

export function GlassButton({
  className,
  variant = "primary",
  loading,
  children,
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={cn(
        "btn",
        variant === "primary" ? "btn-primary" : "btn-secondary",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className={cn(
            "h-3.5 w-3.5 animate-spin rounded-full border-2",
            variant === "primary"
              ? "border-white/30 border-t-white"
              : "border-[var(--border)] border-t-[var(--navy)]"
          )}
        />
      ) : null}
      {children}
    </button>
  );
}
