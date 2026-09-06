"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, {});

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111b38]/95 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.32)] sm:p-10">
      <p className="text-xs tracking-[0.24em] text-[#22d8e5]">SECURE ADMIN ENTRY</p>
      <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Admin sign in</h2>
      <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#c9d2ea]">
        The Student ID trigger only opened this separate flow. Enter the configured administrator credentials to continue.
      </p>

      <form action={action} className="mt-8 space-y-5" aria-describedby="admin-status">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="username">Username</label>
          <input autoComplete="username" className="h-12 w-full rounded-xl bg-[#eef0f5] px-4 text-[#202338]" id="username" name="username" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">Password</label>
          <input autoComplete="current-password" className="h-12 w-full rounded-xl bg-[#eef0f5] px-4 text-[#202338]" id="password" name="password" required type="password" />
        </div>
        <button className="h-12 rounded-full bg-[#22d8e5] px-7 font-semibold text-[#071127] disabled:cursor-not-allowed disabled:opacity-50" disabled={pending} type="submit">{pending ? "Signing in..." : "Sign in"}</button>
      </form>

      <p aria-live="polite" className="mt-5 min-h-5 text-sm text-[#f0a6de]" id="admin-status">{state.error}</p>
    </section>
  );
}
