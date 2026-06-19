import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <AppHeader eyebrow="OS2" title="Not found" />
      <PageShell className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text-primary)]">Order not found</h2>
        <p className="mt-3 max-w-md text-[0.933rem] text-[var(--text-secondary)]">
          This order doesn&apos;t exist or isn&apos;t linked to your account.
        </p>
        <Link href="/dashboard" className="btn btn-secondary mt-8 !px-6 !py-3">
          Back to dashboard
        </Link>
      </PageShell>
    </div>
  );
}
