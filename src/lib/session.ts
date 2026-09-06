import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { decodeSession, encodeSession, type Session } from "@/lib/session-token";

const COOKIE_NAME = "himti_session";
const MAX_AGE = 60 * 60 * 8;

type SessionInput =
  | { role: "admin" }
  | { role: "student"; studentId: string; cohortId: string; name: string; nim: string };

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return value;
}

export async function createSession(session: SessionInput) {
  const expires = Date.now() + MAX_AGE * 1000;
  (await cookies()).set(COOKIE_NAME, encodeSession({ ...session, expires } as Session, secret()), {
    httpOnly: true,
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession() {
  return decodeSession((await cookies()).get(COOKIE_NAME)?.value, secret());
}

export async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/admin/login");
  return session;
}

export const requireStudent = cache(async function requireStudent() {
  const session = await getSession();
  if (session?.role !== "student") redirect("/");
  const result = await db.query<{ studentId: string; cohortId: string; name: string; nim: string }>(
    'SELECT id::text AS "studentId", cohort_id::text AS "cohortId", name, nim FROM students WHERE id = $1',
    [session.studentId],
  );
  if (!result.rows[0]) redirect("/");
  return { role: "student" as const, expires: session.expires, ...result.rows[0] };
});
