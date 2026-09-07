"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCohortName, parseCohortBatch } from "@/lib/cohorts";
import { requireAdmin } from "@/lib/session";

export async function createCohort(formData: FormData) {
  await requireAdmin();
  const batch = parseCohortBatch(formData.get("batch")?.toString().trim() ?? "");
  if (batch === null) redirect("/admin/cohorts?status=Batch+must+contain+exactly+two+digits+from+01+to+99.");

  let status = `${formatCohortName(batch)} added.`;
  try {
    await db.query("INSERT INTO cohorts (batch) VALUES ($1)", [batch]);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    status = code === "23505" ? "That cohort already exists." : "The cohort could not be added. Please try again.";
  }
  revalidatePath("/admin", "layout");
  redirect(`/admin/cohorts?status=${encodeURIComponent(status)}`);
}

export async function deleteCohort(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id")?.toString() ?? "";
  if (!/^[1-9]\d*$/.test(id)) redirect("/admin/cohorts?status=Invalid+cohort.");

  let status = "Cohort removed.";
  try {
    const result = await db.query("DELETE FROM cohorts WHERE id = $1", [id]);
    if (!result.rowCount) status = "Cohort was not found.";
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    status = code === "23503"
      ? "This cohort cannot be removed because students or content still reference it."
      : "The cohort could not be removed. Please try again.";
  }
  revalidatePath("/admin", "layout");
  redirect(`/admin/cohorts?status=${encodeURIComponent(status)}`);
}
