import { redirect } from "next/navigation";
import { CloudTrekLogo } from "@/components/brand/cloudtrek-logo";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  if (!isSupabaseConfigured) redirect("/admin"); // demo mode needs no sign-in
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm border border-line bg-white p-8">
        <CloudTrekLogo variant="full" className="mx-auto h-28" sizes="400px" priority />
        <h1 className="mt-8 text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Authorised Cloud Trek administrators only.</p>
        <LoginForm />
      </div>
    </div>
  );
}
