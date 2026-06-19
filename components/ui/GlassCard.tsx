import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
};

export function GlassCard({ children, className }: GlassCardProps) {
  return <div className={cn("card", className)}>{children}</div>;
}
