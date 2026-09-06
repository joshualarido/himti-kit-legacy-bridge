import type { ReactNode } from "react";
import StudentShell from "./student-shell";
import { requireStudent } from "@/lib/session";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const student = await requireStudent();
  return <StudentShell name={student.name} nim={student.nim}>{children}</StudentShell>;
}
