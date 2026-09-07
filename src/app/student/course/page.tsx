import { db } from "@/lib/db";
import { isMajor, MAJORS } from "@/lib/content";
import { requireStudent } from "@/lib/session";
import MajorSelector from "./major-selector";

type Summary = { id: string; title: string; description: string; image_url: string; resource_url: string };

export default async function StudentCoursePage({ searchParams }: { searchParams: Promise<{ major?: string }> }) {
  const student = await requireStudent();
  const requestedMajor = (await searchParams).major ?? "";
  const major = isMajor(requestedMajor) ? requestedMajor : MAJORS[0];
  const result = await db.query<Summary>(
    "SELECT id::text, title, description, image_url, resource_url FROM lesson_summaries WHERE cohort_id = $1 AND $2 = ANY(majors) ORDER BY title",
    [student.cohortId, major],
  );

  return (
    <>
      <MajorSelector major={major} />

      <div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-xs tracking-[0.24em] text-[#22d8e5]">COURSE LIBRARY</p><h2 className="mt-2 text-2xl font-medium sm:text-3xl">Lesson summaries</h2></div><p className="hidden text-sm text-[#c9d2ea] sm:block">{result.rowCount} resources</p></div>
      {result.rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/20 bg-[#151f3c]/80 p-8 text-center"><h3 className="text-lg font-semibold">No summaries yet</h3><p className="mt-2 font-sans text-sm text-[#c9d2ea]">There are no {major} resources for your cohort.</p></div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.rows.map((summary) => <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151f3c] shadow-[0_14px_40px_rgba(1,5,20,0.28)]" key={summary.id}><div aria-label={`${summary.title} cover`} className="h-44 bg-[#d9dbe2] bg-cover bg-center transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none sm:h-52" role="img" style={{ backgroundImage: `url("${summary.image_url}")` }} /><div className="p-5"><h3 className="min-h-12 text-lg font-semibold leading-snug">{summary.title}</h3><p className="mt-2 min-h-15 font-sans text-sm leading-relaxed text-[#c9d2ea]">{summary.description}</p><a className="mt-5 block w-full rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#071127] transition hover:bg-[#f0a6de]" href={summary.resource_url} rel="noreferrer" target="_blank">Open summary</a></div></article>)}
        </div>
      )}
    </>
  );
}
