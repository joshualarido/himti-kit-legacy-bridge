import StudentManager from "./student-manager";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import type { StudentRecord } from "@/lib/students";

type StudentRow = { id: string; nim: string; name: string; cohort_id: string; cohort_name: string };

export default async function AdminStudentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const [students, params] = await Promise.all([
    db.query<StudentRow>("SELECT s.id::text, s.nim, s.name, s.cohort_id::text, c.name AS cohort_name FROM students s JOIN cohorts c ON c.id = s.cohort_id ORDER BY s.nim"),
    searchParams,
  ]);
  const records: StudentRecord[] = students.rows.map((student) => ({ id: student.id, nim: student.nim, name: student.name, cohortId: student.cohort_id, cohortName: student.cohort_name }));
  return <StudentManager students={records} status={params.status} />;
}
