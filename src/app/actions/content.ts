"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { validateContent, type ContentType } from "@/lib/content";

function value(formData: FormData, name: string) {
  return formData.get(name)?.toString() ?? "";
}

function validId(id: string) {
  return /^[1-9]\d*$/.test(id);
}

function destination(type: ContentType, cohortId: string, status: string) {
  return `/admin/${type}?cohort=${cohortId}&status=${encodeURIComponent(status)}`;
}

function databaseMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
  if (code === "23503") return "The selected cohort no longer exists.";
  if (code === "23505") return "A resource with this title already exists in that cohort and major.";
  return "The resource could not be saved. Please try again.";
}

export async function saveContent(formData: FormData) {
  await requireAdmin();
  const type = value(formData, "type") as ContentType;
  const cohortId = value(formData, "cohortId");
  const id = value(formData, "id");
  if ((type !== "course" && type !== "software") || !validId(cohortId) || (id && !validId(id))) redirect("/admin/course?status=Invalid+request.");

  const parsed = validateContent(formData, type);
  if (!parsed.ok) redirect(destination(type, cohortId, parsed.error));

  const { title, description, imageUrl, resourceUrl, major } = parsed.data;
  let status = id ? "Resource updated." : "Resource added.";
  try {
    if (type === "course") {
      const result = id
        ? await db.query(
            "UPDATE lesson_summaries SET title = $1, description = $2, image_url = $3, resource_url = $4, major = $5 WHERE id = $6 AND cohort_id = $7",
            [title, description, imageUrl, resourceUrl, major, id, cohortId],
          )
        : await db.query(
            "INSERT INTO lesson_summaries (cohort_id, title, description, image_url, resource_url, major) VALUES ($1, $2, $3, $4, $5, $6)",
            [cohortId, title, description, imageUrl, resourceUrl, major],
          );
      if (id && result.rowCount === 0) status = "Resource was not found in the selected cohort.";
    } else {
      const result = id
        ? await db.query(
            "UPDATE software_resources SET title = $1, description = $2, image_url = $3, resource_url = $4 WHERE id = $5 AND cohort_id = $6",
            [title, description, imageUrl, resourceUrl, id, cohortId],
          )
        : await db.query(
            "INSERT INTO software_resources (cohort_id, title, description, image_url, resource_url) VALUES ($1, $2, $3, $4, $5)",
            [cohortId, title, description, imageUrl, resourceUrl],
          );
      if (id && result.rowCount === 0) status = "Resource was not found in the selected cohort.";
    }
  } catch (error) {
    status = databaseMessage(error);
  }

  revalidatePath(`/admin/${type}`);
  revalidatePath(type === "course" ? "/student/course" : "/student/software");
  redirect(destination(type, cohortId, status));
}

export async function deleteContent(formData: FormData) {
  await requireAdmin();
  const type = value(formData, "type") as ContentType;
  const cohortId = value(formData, "cohortId");
  const id = value(formData, "id");
  if ((type !== "course" && type !== "software") || !validId(cohortId) || !validId(id)) redirect("/admin/course?status=Invalid+request.");

  const table = type === "course" ? "lesson_summaries" : "software_resources";
  const result = await db.query(`DELETE FROM ${table} WHERE id = $1 AND cohort_id = $2`, [id, cohortId]);
  const status = result.rowCount ? "Resource deleted." : "Resource was not found in the selected cohort.";
  revalidatePath(`/admin/${type}`);
  revalidatePath(type === "course" ? "/student/course" : "/student/software");
  redirect(destination(type, cohortId, status));
}
