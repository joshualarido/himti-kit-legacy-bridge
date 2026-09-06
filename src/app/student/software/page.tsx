import { db } from "@/lib/db";
import { requireStudent } from "@/lib/session";

type Software = { id: string; title: string; description: string; image_url: string; resource_url: string };

export default async function StudentSoftwarePage() {
  const student = await requireStudent();
  const result = await db.query<Software>(
    "SELECT id::text, title, description, image_url, resource_url FROM software_resources WHERE cohort_id = $1 ORDER BY title",
    [student.cohortId],
  );

  return (
    <>
      <div className="flex items-end justify-between gap-4"><div><p className="text-xs tracking-[0.24em] text-[#22d8e5]">SOFTWARE LIBRARY</p><h2 className="mt-2 text-2xl font-medium sm:text-3xl">Tools for your studies</h2></div><p className="hidden text-sm text-[#c9d2ea] sm:block">{result.rowCount} resources</p></div>
      {result.rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-[#151f3c]/80 p-8 text-center"><h3 className="text-lg font-semibold">No software yet</h3><p className="mt-2 font-sans text-sm text-[#c9d2ea]">There are no software resources for your cohort.</p></div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.rows.map((item) => <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151f3c] shadow-[0_14px_40px_rgba(1,5,20,0.28)]" key={item.id}><div className="flex h-44 items-center justify-center bg-[#eef4f8] p-8 sm:h-52"><div aria-label={`${item.title} logo`} className="h-full w-full bg-contain bg-center bg-no-repeat transition duration-300 group-hover:scale-105 motion-reduce:transition-none" role="img" style={{ backgroundImage: `url("${item.image_url}")` }} /></div><div className="p-5"><h3 className="text-lg font-semibold leading-snug">{item.title}</h3><p className="mt-2 min-h-15 font-sans text-sm leading-relaxed text-[#c9d2ea]">{item.description}</p><a className="mt-5 block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#071127] transition hover:bg-[#f0a6de]" href={item.resource_url} rel="noreferrer" target="_blank">Download</a></div></article>)}
        </div>
      )}
    </>
  );
}
