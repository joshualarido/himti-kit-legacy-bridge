"use client";

import { useRef, useState } from "react";
import { createCohort, deleteCohort } from "@/app/actions/cohorts";

type Cohort = { id: string; name: string; references: number };

export default function CohortManager({ cohorts, status }: { cohorts: Cohort[]; status?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Cohort | null>(null);

  function confirm(cohort: Cohort) {
    setSelected(cohort);
    dialog.current?.showModal();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111b38]/95 p-6 sm:p-8">
      <p className="text-xs tracking-[0.24em] text-[#22d8e5]">COHORT SETTINGS</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Manage Binusian cohorts</h2><p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#c9d2ea]">Create each required batch before adding its students and resources. Referenced cohorts are protected from removal.</p>
      <form action={createCohort} className="mt-7 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="new-cohort">Two-digit Binusian batch</label><input className="h-12 min-w-0 flex-1 rounded-full bg-white px-5 text-[#15192a] outline-none focus-visible:ring-4 focus-visible:ring-[#22d8e5]" id="new-cohort" inputMode="numeric" maxLength={2} minLength={2} name="batch" pattern="(0[1-9]|[1-9][0-9])" placeholder="Example: 30" required /><button className="h-12 rounded-full bg-[#22d8e5] px-6 font-semibold text-[#071127] hover:bg-white" type="submit">Add cohort</button></form>
      <p aria-live="polite" className="mt-4 min-h-6 font-sans text-sm text-[#f0a6de]">{status}</p>
      {cohorts.length === 0 ? <div className="mt-3 rounded-xl border border-dashed border-white/20 p-6 text-center font-sans text-sm text-[#c9d2ea]">No cohorts yet. Add the first cohort above.</div> : <div className="mt-3 space-y-3">{cohorts.map((cohort) => <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#071127]/80 p-4 sm:flex-row sm:items-center" key={cohort.id}><div><h3 className="font-semibold">{cohort.name}</h3><p className="mt-1 font-sans text-xs text-[#aeb9d2]">{cohort.references ? `${cohort.references} student or content references` : "No references"}</p></div><button className="rounded-full border border-[#ff8fa9] px-4 py-2 text-sm font-semibold text-[#ffb1c2] hover:bg-[#7b203b]" onClick={() => confirm(cohort)} type="button">Remove</button></div>)}</div>}
      <dialog aria-labelledby="cohort-delete-title" className="m-auto w-[min(92vw,480px)] rounded-2xl border border-[#ff8fa9]/50 bg-[#111b38] p-0 text-white backdrop:bg-[#020617]/80" ref={dialog}><form action={deleteCohort} className="p-7 sm:p-9"><input name="id" type="hidden" value={selected?.id ?? ""} /><p className="text-xs tracking-[0.2em] text-[#ffb1c2]">CONFIRM REMOVAL</p><h2 className="mt-3 text-2xl font-semibold" id="cohort-delete-title">Remove {selected?.name}?</h2><p className="mt-3 font-sans text-sm text-[#c9d2ea]">{selected?.references ? "This cohort is referenced and the server will preserve it." : "This permanently removes the empty cohort."}</p><div className="mt-7 flex justify-end gap-3"><button className="rounded-full border border-white/25 px-5 py-2.5" onClick={() => dialog.current?.close()} type="button">Cancel</button><button className="rounded-full bg-[#ff8fa9] px-5 py-2.5 font-semibold text-[#071127]" type="submit">Confirm removal</button></div></form></dialog>
    </section>
  );
}
