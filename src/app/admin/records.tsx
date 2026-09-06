"use client";

import { useRef, useState } from "react";
import { deleteContent, saveContent } from "@/app/actions/content";
import { MAJORS, type ContentRecord, type ContentType } from "@/lib/content";

type Cohort = { id: string; name: string };

export default function AdminRecords({ cohorts, records, selectedCohort, status, type }: { cohorts: Cohort[]; records: ContentRecord[]; selectedCohort: string; status?: string; type: ContentType }) {
  const editDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ContentRecord | null>(null);
  const label = type === "course" ? "Course" : "Software";

  function openEdit(record: ContentRecord | null) {
    setSelected(record);
    editDialog.current?.showModal();
  }

  function openDelete(record: ContentRecord) {
    setSelected(record);
    deleteDialog.current?.showModal();
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#111b38]/95 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" method="get">
            <div><label className="text-xs tracking-[0.2em] text-[#22d8e5]" htmlFor="managed-cohort">MANAGED COHORT</label><select className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a] sm:w-64" defaultValue={selectedCohort} id="managed-cohort" name="cohort">{cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</select></div>
            <button className="h-11 rounded-full border border-white/25 px-5 text-sm font-semibold hover:bg-white/10" type="submit">Switch</button>
          </form>
          <button className="rounded-full bg-[#22d8e5] px-5 py-3 font-semibold text-[#071127] hover:bg-white" onClick={() => openEdit(null)} type="button">Add {label}</button>
        </div>
        <p aria-live="polite" className="mt-4 min-h-5 font-sans text-sm text-[#f0a6de]">{status}</p>
      </div>

      {records.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-[#111b38]/80 p-8 text-center"><h2 className="text-xl font-semibold">No {label.toLowerCase()} resources</h2><p className="mt-2 font-sans text-sm text-[#c9d2ea]">Add the first resource for this cohort.</p></div> : <div className="mt-5 space-y-4">{records.map((record) => <article className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#111b38]/95 sm:grid-cols-[190px_1fr]" key={record.id}><div aria-label={`${record.title} image`} className="min-h-44 bg-[#eef4f8] bg-contain bg-center bg-no-repeat" role="img" style={{ backgroundImage: `url("${record.imageUrl}")` }} /><div className="flex flex-col justify-between p-5 sm:p-6"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold">{record.title}</h2>{record.major && <span className="rounded-full bg-[#22d8e5]/15 px-3 py-1 text-xs text-[#8fe9f0]">{record.major}</span>}</div><p className="mt-2 font-sans text-sm leading-relaxed text-[#c9d2ea]">{record.description}</p></div><div className="mt-6 flex flex-wrap gap-3"><button className="rounded-full bg-[#f0a6de] px-5 py-2.5 font-semibold text-[#071127] hover:bg-white" onClick={() => openEdit(record)} type="button">Edit</button><button className="rounded-full border border-[#ff8fa9] px-5 py-2.5 font-semibold text-[#ffb1c2] hover:bg-[#7b203b]" onClick={() => openDelete(record)} type="button">Delete</button><a className="rounded-full border border-white/25 px-5 py-2.5 font-semibold hover:bg-white/10" href={record.resourceUrl} rel="noreferrer" target="_blank">Open link</a></div></div></article>)}</div>}

      <dialog aria-labelledby="record-dialog-title" className="m-auto w-[min(92vw,560px)] rounded-2xl border border-[#22d8e5]/40 bg-[#111b38] p-0 text-white backdrop:bg-[#020617]/80" ref={editDialog}>
        <form action={saveContent} className="p-7 sm:p-9" key={selected?.id ?? "new"}>
          <input name="type" type="hidden" value={type} /><input name="cohortId" type="hidden" value={selectedCohort} />{selected && <input name="id" type="hidden" value={selected.id} />}
          <p className="text-xs tracking-[0.2em] text-[#22d8e5]">{selected ? "EDIT RESOURCE" : "NEW RESOURCE"}</p><h2 className="mt-3 text-2xl font-semibold" id="record-dialog-title">{selected ? `Edit ${selected.title}` : `Add ${label}`}</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm">Title<input className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a]" defaultValue={selected?.title} maxLength={120} name="title" required /></label>
            {type === "course" && <label className="block text-sm">Major<select className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a]" defaultValue={selected?.major ?? MAJORS[0]} name="major">{MAJORS.map((major) => <option key={major}>{major}</option>)}</select></label>}
            <label className="block text-sm">Description<textarea className="mt-2 min-h-24 w-full rounded-xl bg-white p-4 font-sans text-[#15192a]" defaultValue={selected?.description} maxLength={1000} name="description" required /></label>
            <label className="block text-sm">External image URL<input className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a]" defaultValue={selected?.imageUrl} maxLength={2048} name="imageUrl" required type="url" /></label>
            <label className="block text-sm">External resource URL<input className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a]" defaultValue={selected?.resourceUrl} maxLength={2048} name="resourceUrl" required type="url" /></label>
          </div>
          <div className="mt-7 flex justify-end gap-3"><button className="rounded-full border border-white/25 px-5 py-2.5" onClick={() => editDialog.current?.close()} type="button">Cancel</button><button className="rounded-full bg-[#f0a6de] px-5 py-2.5 font-semibold text-[#071127]" type="submit">Save</button></div>
        </form>
      </dialog>

      <dialog aria-labelledby="delete-dialog-title" className="m-auto w-[min(92vw,480px)] rounded-2xl border border-[#ff8fa9]/50 bg-[#111b38] p-0 text-white backdrop:bg-[#020617]/80" ref={deleteDialog}>
        <form action={deleteContent} className="p-7 sm:p-9"><input name="type" type="hidden" value={type} /><input name="cohortId" type="hidden" value={selectedCohort} /><input name="id" type="hidden" value={selected?.id ?? ""} /><p className="text-xs tracking-[0.2em] text-[#ffb1c2]">CONFIRM DELETE</p><h2 className="mt-3 text-2xl font-semibold" id="delete-dialog-title">Delete {selected?.title}?</h2><p className="mt-3 font-sans text-sm text-[#c9d2ea]">This permanently removes the resource from this cohort.</p><div className="mt-7 flex justify-end gap-3"><button className="rounded-full border border-white/25 px-5 py-2.5" onClick={() => deleteDialog.current?.close()} type="button">Cancel</button><button className="rounded-full bg-[#ff8fa9] px-5 py-2.5 font-semibold text-[#071127]" type="submit">Confirm delete</button></div></form>
      </dialog>
    </>
  );
}
