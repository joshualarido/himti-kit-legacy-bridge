"use client";

import { MAJORS, type Major } from "@/lib/content";

export default function MajorSelector({ major }: { major: Major }) {
  return (
    <form method="get">
      <label className="text-sm tracking-wider text-[#dbe3f5] sm:text-base" htmlFor="major">CHOOSE YOUR MAJOR</label>
      <select className="mt-4 h-13 w-full rounded-full bg-white px-5 text-sm text-[#14182a] outline-none focus-visible:ring-4 focus-visible:ring-[#22d8e5] sm:px-6 sm:text-base" defaultValue={major} id="major" name="major" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
        {MAJORS.map((item) => <option key={item}>{item}</option>)}
      </select>
    </form>
  );
}
