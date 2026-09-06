"use client";

import { useActionState } from "react";
import { studentLogin } from "@/app/actions/auth";

export default function Home() {
  const [state, action, pending] = useActionState(studentLogin, {});

  return (
    <main className="relative isolate flex min-h-svh overflow-hidden bg-[#071127] bg-[url('/bg.png')] bg-cover bg-center font-mono text-white">
      <div className="absolute inset-0 -z-10 bg-[#071127]/10" aria-hidden="true" />

      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pt-[18svh] text-center sm:px-8 sm:pt-[22svh] lg:pt-[24svh]">
        <h1 className="text-3xl font-medium tracking-[0.12em] text-balance sm:text-5xl">
          HIMTI KIT
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-pretty text-white sm:text-lg sm:leading-relaxed">
          HIMTI KIT is a learning kit for students in the School of Computer
          Science at Bina Nusantara University. Access your study materials
          online in one place.
        </p>

        <form
          action={action}
          className="mt-7 w-full max-w-2xl text-left sm:mt-8"
        >
          <label className="sr-only" htmlFor="nim">
            Student ID (NIM)
          </label>
          <div className="flex h-14 overflow-hidden rounded-full bg-[#f0f1f4] text-[#11131b] shadow-[0_0_24px_rgba(65,218,255,0.12)] sm:h-16">
            <input
              autoComplete="username"
              className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-[#393b43] focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#14d5e5] sm:px-7 sm:text-base"
              id="nim"
              inputMode="numeric"
              name="nim"
              placeholder="Insert your Student ID (NIM)"
              required
            />
            <button
              aria-label="Continue"
              className="flex w-16 shrink-0 items-center justify-center bg-[#9ea1ad] transition-colors hover:bg-[#b3b6c0] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#14d5e5] sm:w-20"
              disabled={pending}
              type="submit"
            >
              <svg
                aria-hidden="true"
                className="h-7 w-7 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M8 24h30m-11-11 11 11-11 11"
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="4"
                />
              </svg>
            </button>
          </div>
          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-sm font-sans text-white"
          >
            {pending ? "Checking Student ID..." : state.error}
          </p>
        </form>
      </section>
    </main>
  );
}
