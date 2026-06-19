import { cn } from "@/lib/utils";

type GlassInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function GlassInput({ label, className, id, ...props }: GlassInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block space-y-2">
      <span className="text-[0.733rem] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </span>
      <input id={inputId} className={cn("input", className)} {...props} />
    </label>
  );
}
