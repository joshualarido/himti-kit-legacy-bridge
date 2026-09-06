"use client";

export default function StudentError({ reset }: { reset: () => void }) {
  return <div className="rounded-2xl border border-[#ff8fa9]/40 bg-[#151f3c] p-8 text-center"><h2 className="text-xl font-semibold">Resources could not be loaded</h2><p className="mt-2 font-sans text-sm text-[#c9d2ea]">Check your connection and try again.</p><button className="mt-5 rounded-full bg-white px-5 py-3 font-semibold text-[#071127] hover:bg-[#f0a6de]" onClick={reset} type="button">Try again</button></div>;
}
