import Link from "next/link";
import AdminRecords from "./records";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { ContentRecord, ContentType } from "@/lib/content";
import { formatCohortName } from "@/lib/cohorts";

type CohortRow = { id: string; batch: number };
type RecordRow = { id: string; title: string; description: string; image_url: string; resource_url: string; majors?: ContentRecord["majors"] };

export default async function AdminContentPage({ searchParams, type }: { searchParams: Promise<{ cohort?: string; status?: string }>; type: ContentType }) {
  await requireAdmin();
  const cohortRows = (await db.query<CohortRow>("SELECT id::text, batch FROM cohorts ORDER BY batch")).rows;
  const cohorts = cohortRows.map((cohort) => ({ id: cohort.id, name: formatCohortName(cohort.batch) }));
  if (cohorts.length === 0) return <div className="rounded-2xl border border-white/10 bg-[#111b38]/95 p-8"><h2 className="text-2xl font-semibold">Create a cohort first</h2><p className="mt-3 font-sans text-sm text-[#c9d2ea]">Resources must belong to a cohort.</p><Link className="mt-6 inline-block rounded-full bg-[#22d8e5] px-5 py-3 font-semibold text-[#071127]" href="/admin/cohorts">Manage cohorts</Link></div>;

  const params = await searchParams;
  const selectedCohort = cohorts.some((cohort) => cohort.id === params.cohort) ? params.cohort! : cohorts[0].id;
  const query = type === "course"
    ? "SELECT id::text, title, description, image_url, resource_url, majors FROM lesson_summaries WHERE cohort_id = $1 ORDER BY title"
    : "SELECT id::text, title, description, image_url, resource_url FROM software_resources WHERE cohort_id = $1 ORDER BY title";
  const rows = (await db.query<RecordRow>(query, [selectedCohort])).rows;
  const records: ContentRecord[] = rows.map((row) => ({ id: row.id, title: row.title, description: row.description, imageUrl: row.image_url, resourceUrl: row.resource_url, majors: row.majors }));
  return <AdminRecords cohorts={cohorts} records={records} selectedCohort={selectedCohort} status={params.status} type={type} />;
}
