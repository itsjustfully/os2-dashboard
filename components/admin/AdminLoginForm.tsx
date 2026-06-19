"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Access denied");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md">
      <GlassCard className="card-padded shadow-[var(--shadow-md)]">
        <div className="mb-8 text-center">
          <p className="text-[0.733rem] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Staff only
          </p>
          <h1 className="mt-3 text-[1.2rem] font-semibold tracking-tight text-[var(--text-primary)]">
            Admin
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <GlassInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-4 py-2.5 text-[0.867rem] text-red-700">
              {error}
            </p>
          )}
          <GlassButton type="submit" className="w-full !py-3" loading={loading}>
            Sign in
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
}
