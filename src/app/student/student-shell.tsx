"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { logout } from "@/app/actions/auth";

const navigation = [
  { href: "/student/course", label: "Course" },
  { href: "/student/software", label: "Software" },
];

export default function StudentShell({ children, name, nim }: { children: ReactNode; name: string; nim: string }) {
  const pathname = usePathname();
  const logoutDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = logoutDialog.current;
    if (!dialog) return;
    function closeOnBackdrop(event: MouseEvent) {
      if (event.target === event.currentTarget) (event.currentTarget as HTMLDialogElement).close();
    }
    dialog.addEventListener("click", closeOnBackdrop);
    return () => dialog.removeEventListener("click", closeOnBackdrop);
  }, []);

  return (
    <main className="min-h-svh bg-[#071127] font-mono text-white">
      <header className="flex min-h-24 items-center justify-between gap-4 border-b border-white/10 bg-[#030a1d]/95 px-5 py-4 sm:px-8">
        <div><h1 className="text-xl tracking-[0.08em] sm:text-3xl">Welcome to HIMTI KIT</h1><p className="mt-1 text-xs text-[#c9d2ea] sm:text-base">The perfect starter kit for your day-to-day study</p></div>
        <button className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wider text-[#071127] transition hover:bg-[#22d8e5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d8e5] sm:text-sm" onClick={() => logoutDialog.current?.showModal()} type="button">LOG OUT</button>
      </header>
      <div className="grid min-h-[calc(100svh-6rem)] lg:grid-cols-[270px_1fr]">
        <aside className="border-b border-white/10 bg-[#202943]/95 p-4 lg:border-r lg:border-b-0 lg:p-6">
          <div className="rounded-2xl bg-[#02091c] px-5 py-4 lg:py-6"><p className="text-sm text-[#aeb9d2]">Hello,</p><p className="mt-1 font-semibold">{name}</p><p className="mt-3 text-sm text-[#8fe9f0]">{nim}</p></div>
          <nav aria-label="Student navigation" className="mt-4 grid grid-cols-2 gap-3 lg:mt-7 lg:grid-cols-1">
            {navigation.map((item) => <Link aria-current={pathname === item.href ? "page" : undefined} className={`rounded-full px-5 py-3 text-center font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${pathname === item.href ? "bg-[#22d8e5] text-[#071127] shadow-[0_0_20px_rgba(34,216,229,0.2)]" : "bg-white/90 text-[#373d51] transition hover:bg-[#f0a6de]"}`} href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
        </aside>
        <section className="relative isolate overflow-hidden bg-[url('/bg.png')] bg-cover bg-center px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="absolute inset-0 -z-10 bg-[#071127]/48" aria-hidden="true" />
          <div className="mx-auto max-w-7xl">{children}<footer className="mt-10 border-t border-white/15 pt-5 text-xs text-[#aeb9d2]">HIMTI KIT ©2026</footer></div>
        </section>
      </div>
      <dialog aria-labelledby="logout-title" className="m-auto w-[min(90vw,430px)] rounded-2xl border border-[#22d8e5]/40 bg-[#111b38] p-0 text-white shadow-[0_24px_90px_rgba(0,0,0,0.7)] backdrop:bg-[#020617]/75" ref={logoutDialog}>
        <div className="p-7 text-center sm:p-9"><p className="text-xs tracking-[0.24em] text-[#22d8e5]">END SESSION</p><h2 className="mt-3 text-xl font-semibold" id="logout-title">Log out of HIMTI KIT?</h2><p className="mt-3 font-sans text-sm leading-relaxed text-[#c9d2ea]">You will return to the Student ID entry screen.</p><div className="mt-7 grid grid-cols-2 gap-3"><button className="rounded-full border border-white/25 px-5 py-3 font-semibold hover:bg-white/10" onClick={() => logoutDialog.current?.close()} type="button">Cancel</button><form action={logout}><button className="w-full rounded-full bg-[#f0a6de] px-5 py-3 font-semibold text-[#071127] hover:bg-white" type="submit">Log out</button></form></div></div>
      </dialog>
    </main>
  );
}
