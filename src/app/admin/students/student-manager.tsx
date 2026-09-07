"use client";

import { useRef, useState } from "react";
import { deleteStudent, importStudents, saveStudent } from "@/app/actions/students";
import type { StudentRecord } from "@/lib/students";

export default function StudentManager({ students, status }: { students: StudentRecord[]; status?: string }) {
  const editDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<StudentRecord | null>(null);

  function edit(student: StudentRecord | null) {
    setSelected(student);
    editDialog.current?.showModal();
  }

  function remove(student: StudentRecord) {
    setSelected(student);
    deleteDialog.current?.showModal();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111b38]/95 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs tracking-[0.24em] text-[#22d8e5]">STUDENT ACCESS</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Manage student allowlist</h2><p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#c9d2ea]">Only listed NIMs can sign in. The matching cohort must exist before a student is added or imported.</p></div><button className="shrink-0 rounded-full bg-[#22d8e5] px-5 py-3 font-semibold text-[#071127] hover:bg-white" onClick={() => edit(null)} type="button">Add student</button></div>
      <form action={importStudents} className="mt-7 rounded-xl border border-white/10 bg-[#071127]/70 p-4 sm:p-5"><label className="block text-sm font-semibold" htmlFor="student-csv">Import CSV allowlist</label><p className="mt-1 font-sans text-xs leading-relaxed text-[#aeb9d2]">Upload a CSV up to 1 MB with the exact header <code>name,nim</code>. Existing NIMs are updated; invalid files make no changes.</p><pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/25 p-3 font-mono text-xs leading-relaxed text-[#8fe9f0]"><code>{"name,nim\nJane Student,2800000000\nJohn Student,2900000000"}</code></pre><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input accept=".csv,text/csv" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-sans text-sm file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-[#071127]" id="student-csv" name="csv" required type="file" /><button className="rounded-full bg-white px-5 py-3 font-semibold text-[#071127] hover:bg-[#22d8e5]" type="submit">Import students</button></div></form>
      <p aria-live="polite" className="mt-4 min-h-6 font-sans text-sm text-[#f0a6de]">{status}</p>
      {students.length === 0 ? <div className="mt-3 rounded-xl border border-dashed border-white/20 p-6 text-center font-sans text-sm text-[#c9d2ea]">No students are currently allowlisted.</div> : <div className="mt-3 space-y-3">{students.map((student) => <article className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#071127]/80 p-4 sm:flex-row sm:items-center" key={student.id}><div><h3 className="font-semibold">{student.name}</h3><p className="mt-1 font-sans text-sm text-[#8fe9f0]">{student.nim}</p><p className="mt-1 font-sans text-xs text-[#aeb9d2]">{student.cohortName}</p></div><div className="flex gap-3"><button className="rounded-full bg-[#f0a6de] px-4 py-2 text-sm font-semibold text-[#071127] hover:bg-white" onClick={() => edit(student)} type="button">Edit</button><button className="rounded-full border border-[#ff8fa9] px-4 py-2 text-sm font-semibold text-[#ffb1c2] hover:bg-[#7b203b]" onClick={() => remove(student)} type="button">Remove</button></div></article>)}</div>}

      <dialog aria-labelledby="student-dialog-title" className="m-auto w-[min(92vw,540px)] rounded-2xl border border-[#22d8e5]/40 bg-[#111b38] p-0 text-white backdrop:bg-[#020617]/80" ref={editDialog}><form action={saveStudent} className="p-7 sm:p-9" key={selected?.id ?? "new"}>{selected && <input name="id" type="hidden" value={selected.id} />}<p className="text-xs tracking-[0.2em] text-[#22d8e5]">{selected ? "EDIT ACCESS" : "NEW ACCESS"}</p><h2 className="mt-3 text-2xl font-semibold" id="student-dialog-title">{selected ? `Edit ${selected.name}` : "Add student"}</h2><div className="mt-6 space-y-4"><label className="block text-sm">NIM<input className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a]" defaultValue={selected?.nim} inputMode="numeric" maxLength={10} minLength={10} name="nim" pattern="[0-9]{10}" required /></label><label className="block text-sm">Student name<input className="mt-2 h-11 w-full rounded-xl bg-white px-4 text-[#15192a]" defaultValue={selected?.name} maxLength={120} name="name" required /></label><p className="font-sans text-xs text-[#aeb9d2]">The cohort is inferred from the first two NIM digits and must already exist.</p></div><div className="mt-7 flex justify-end gap-3"><button className="rounded-full border border-white/25 px-5 py-2.5" onClick={() => editDialog.current?.close()} type="button">Cancel</button><button className="rounded-full bg-[#f0a6de] px-5 py-2.5 font-semibold text-[#071127]" type="submit">Save</button></div></form></dialog>
      <dialog aria-labelledby="student-delete-title" className="m-auto w-[min(92vw,480px)] rounded-2xl border border-[#ff8fa9]/50 bg-[#111b38] p-0 text-white backdrop:bg-[#020617]/80" ref={deleteDialog}><form action={deleteStudent} className="p-7 sm:p-9"><input name="id" type="hidden" value={selected?.id ?? ""} /><p className="text-xs tracking-[0.2em] text-[#ffb1c2]">CONFIRM REMOVAL</p><h2 className="mt-3 text-2xl font-semibold" id="student-delete-title">Remove {selected?.name}?</h2><p className="mt-3 font-sans text-sm text-[#c9d2ea]">The student will no longer be able to sign in with NIM {selected?.nim}.</p><div className="mt-7 flex justify-end gap-3"><button className="rounded-full border border-white/25 px-5 py-2.5" onClick={() => deleteDialog.current?.close()} type="button">Cancel</button><button className="rounded-full bg-[#ff8fa9] px-5 py-2.5 font-semibold text-[#071127]" type="submit">Confirm removal</button></div></form></dialog>
    </section>
  );
}
