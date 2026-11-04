"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn, type ActionState } from "../actions";
import { adminInput, Notice, primaryBtn } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      {state?.error && <Notice kind="error">{state.error}</Notice>}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-[13px] font-medium text-navy">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={adminInput} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-[13px] font-medium text-navy">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={adminInput} />
      </div>
      <button type="submit" disabled={pending} className={`${primaryBtn} w-full`}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Sign in
      </button>
    </form>
  );
}
