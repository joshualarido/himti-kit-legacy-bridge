import CohortManager from "./cohort-manager";
import { db } from "@/lib/db";
import { formatCohortName } from "@/lib/cohorts";

type CohortRow = { id: string; batch: number; references: number };

export default async function AdminCohortsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const rows = (await db.query<CohortRow>(`
    SELECT c.id::text, c.batch,
      (SELECT count(*)::int FROM students s WHERE s.cohort_id = c.id) +
      (SELECT count(*)::int FROM lesson_summaries l WHERE l.cohort_id = c.id) +
      (SELECT count(*)::int FROM software_resources r WHERE r.cohort_id = c.id) AS references
    FROM cohorts c ORDER BY c.batch
  `)).rows;
  const cohorts = rows.map((cohort) => ({ ...cohort, name: formatCohortName(cohort.batch) }));
  return <CohortManager cohorts={cohorts} status={(await searchParams).status} />;
}
