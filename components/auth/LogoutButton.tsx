"use client";

import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/ui/GlassButton";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <GlassButton
      variant="ghost"
      onClick={handleLogout}
      className="!border-white/20 !bg-white/10 !px-5 !text-white hover:!border-white/35 hover:!bg-white/15 hover:!text-white"
    >
      Sign out
    </GlassButton>
  );
}
