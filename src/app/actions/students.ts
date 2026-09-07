"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { parseStudentCsv, validateStudent } from "@/lib/students";

function destination(status: string) {
  return `/admin/students?status=${encodeURIComponent(status)}`;
}

export async function saveStudent(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id")?.toString() ?? "";
  if (id && !/^[1-9]\d*$/.test(id)) redirect(destination("Invalid student."));
  const parsed = validateStudent(formData);
  if (!parsed.ok) redirect(destination(parsed.error));

  const { nim, name, cohortBatch } = parsed.data;
  let status = id ? "Student updated." : "Student added to the allowlist.";
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const cohort = await client.query<{ id: string }>("SELECT id::text FROM cohorts WHERE batch = $1 FOR KEY SHARE", [cohortBatch]);
    if (!cohort.rows[0]) {
      await client.query("ROLLBACK");
      status = `Binusian ${cohortBatch.toString().padStart(2, "0")} does not exist. Create the cohort first.`;
    } else {
      const result = id
        ? await client.query("UPDATE students SET nim = $1, name = $2, cohort_id = $3 WHERE id = $4", [nim, name, cohort.rows[0].id, id])
        : await client.query("INSERT INTO students (nim, name, cohort_id) VALUES ($1, $2, $3)", [nim, name, cohort.rows[0].id]);
      if (id && result.rowCount === 0) status = "Student was not found.";
      await client.query("COMMIT");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    if (code === "23505") status = "That NIM is already allowlisted.";
    else {
      console.error("Student save failed", error);
      status = "The student could not be saved. Please try again.";
    }
  } finally {
    client.release();
  }

  revalidatePath("/admin", "layout");
  redirect(destination(status));
}

export async function importStudents(formData: FormData) {
  await requireAdmin();
  const file = formData.get("csv");
  if (!(file instanceof File) || file.size === 0) redirect(destination("Choose a non-empty CSV file."));
  if (file.size > 1_000_000) redirect(destination("CSV files must be 1 MB or smaller."));
  const parsed = parseStudentCsv(await file.text());
  if (!parsed.ok) redirect(destination(parsed.error));

  const nims = parsed.data.map((student) => student.nim);
  const names = parsed.data.map((student) => student.name);
  const cohortBatches = parsed.data.map((student) => student.cohortBatch);
  const batches = [...new Set(cohortBatches)];
  const client = await db.connect();
  let status: string;
  try {
    await client.query("BEGIN");
    const cohorts = await client.query<{ batch: number }>("SELECT batch FROM cohorts WHERE batch = ANY($1::smallint[]) FOR KEY SHARE", [batches]);
    const existingBatches = new Set(cohorts.rows.map((cohort) => cohort.batch));
    const missing = batches.filter((batch) => !existingBatches.has(batch));
    if (missing.length) {
      await client.query("ROLLBACK");
      status = `Create these cohorts before importing: ${missing.map((batch) => `Binusian ${batch.toString().padStart(2, "0")}`).join(", ")}.`;
    } else {
      const existing = await client.query<{ count: number }>("SELECT count(*)::int AS count FROM students WHERE nim = ANY($1::varchar[])", [nims]);
      const imported = await client.query(`
        INSERT INTO students (nim, name, cohort_id)
        SELECT imported.nim, imported.name, cohort.id
        FROM unnest($1::text[], $2::text[], $3::smallint[]) AS imported(nim, name, cohort_batch)
        JOIN cohorts AS cohort ON cohort.batch = imported.cohort_batch
        ON CONFLICT (nim) DO UPDATE SET name = EXCLUDED.name, cohort_id = EXCLUDED.cohort_id
      `, [nims, names, cohortBatches]);
      if (imported.rowCount !== parsed.data.length) throw new Error("Not every imported student matched a cohort.");
      await client.query("COMMIT");
      const updated = existing.rows[0].count;
      status = `Imported ${parsed.data.length} students: ${parsed.data.length - updated} added, ${updated} updated.`;
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Student CSV import failed", error);
    status = "The CSV could not be imported. No students were changed.";
  } finally {
    client.release();
  }

  revalidatePath("/admin", "layout");
  redirect(destination(status));
}

export async function deleteStudent(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id")?.toString() ?? "";
  if (!/^[1-9]\d*$/.test(id)) redirect(destination("Invalid student."));
  const result = await db.query("DELETE FROM students WHERE id = $1", [id]);
  revalidatePath("/admin", "layout");
  redirect(destination(result.rowCount ? "Student removed from the allowlist." : "Student was not found."));
}
