"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string };

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function studentLogin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const nim = formData.get("nim")?.toString().trim() ?? "";
  if (nim === "0000000000") redirect("/admin/login");
  if (!/^\d{10}$/.test(nim)) return { error: "Enter a valid 10-digit Student ID (NIM)." };

  const result = await db.query<{ id: string; name: string; cohort_id: string; nim: string }>(
    "SELECT id::text, name, cohort_id::text, nim FROM students WHERE nim = $1",
    [nim],
  );
  const student = result.rows[0];
  if (!student) return { error: "Student ID was not found." };

  await createSession({ role: "student", studentId: student.id, cohortId: student.cohort_id, name: student.name, nim: student.nim });
  redirect("/student/course");
}

export async function adminLogin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return { error: "Admin credentials are not configured." };
  if (!equal(username, expectedUsername) || !equal(password, expectedPassword)) return { error: "Invalid admin credentials." };

  await createSession({ role: "admin" });
  const cohorts = await db.query<{ exists: boolean }>("SELECT EXISTS (SELECT 1 FROM cohorts)");
  redirect(cohorts.rows[0]?.exists ? "/admin/course" : "/admin/cohorts");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
