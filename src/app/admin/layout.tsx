"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";

const navigation = [
  { href: "/admin/course", label: "Manage Course" },
  { href: "/admin/software", label: "Manage Software" },
  { href: "/admin/students", label: "Manage Students" },
  { href: "/admin/cohorts", label: "Manage Cohorts" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-svh bg-[#071127] font-mono text-white">
      <header className="flex min-h-24 items-center justify-between gap-4 border-b border-white/10 bg-[#030a1d]/95 px-5 py-4 sm:px-8">
        <div>
          <p className="text-xs tracking-[0.24em] text-[#22d8e5]">ADMIN</p>
          <h1 className="mt-1 text-xl tracking-[0.08em] sm:text-3xl">Welcome to HIMTI KIT</h1>
        </div>
        <form action={logout}><button className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wider text-[#071127] transition hover:bg-[#22d8e5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d8e5] sm:text-sm" type="submit">LOG OUT</button></form>
      </header>

      <div className="grid min-h-[calc(100svh-6rem)] lg:grid-cols-[270px_1fr]">
        <aside className="border-b border-white/10 bg-[#202943]/95 p-4 lg:border-r lg:border-b-0 lg:p-6">
          <div className="rounded-2xl bg-[#02091c] px-5 py-4 lg:py-6">
            <p className="text-sm text-[#aeb9d2]">Hello,</p>
            <p className="mt-1 font-semibold">Administrator</p>
          </div>
          <nav aria-label="Admin navigation" className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-7 lg:grid-cols-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-3 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    active
                      ? "bg-[#f0a6de] text-[#071127] shadow-[0_0_20px_rgba(240,166,222,0.2)]"
                      : "bg-white/90 text-[#373d51] transition hover:bg-[#22d8e5]"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="relative isolate overflow-hidden bg-[url('/bg.png')] bg-cover bg-center px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="absolute inset-0 -z-10 bg-[#071127]/58" aria-hidden="true" />
          <div className="mx-auto max-w-7xl">{children}</div>
        </section>
      </div>
    </main>
  );
}
