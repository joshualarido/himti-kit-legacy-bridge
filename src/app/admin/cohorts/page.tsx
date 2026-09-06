import CohortManager from "./cohort-manager";
import { db } from "@/lib/db";

type Cohort = { id: string; name: string; references: number };

export default async function AdminCohortsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const cohorts = (await db.query<Cohort>(`
    SELECT c.id::text, c.name,
      (SELECT count(*)::int FROM students s WHERE s.cohort_id = c.id) +
      (SELECT count(*)::int FROM lesson_summaries l WHERE l.cohort_id = c.id) +
      (SELECT count(*)::int FROM software_resources r WHERE r.cohort_id = c.id) AS references
    FROM cohorts c ORDER BY c.name
  `)).rows;
  return <CohortManager cohorts={cohorts} status={(await searchParams).status} />;
}
