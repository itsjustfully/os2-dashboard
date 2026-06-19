import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";

export default async function LoginPage() {
  const session = await getSession();
  if (session.isLoggedIn) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <AppHeader
        eyebrow="OS2 Performance Apparel"
        title="Order tracker"
        subtitle="Customer sign in"
      />
      <PageShell className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center">
        <LoginForm />
      </PageShell>
    </div>
  );
}
