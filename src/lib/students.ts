import { parse } from "csv-parse/sync";

export type StudentRecord = { id: string; nim: string; name: string; cohortId: string; cohortName: string };
export type StudentInput = { nim: string; name: string; cohortBatch: number };

type StudentValidation =
  | { ok: false; error: string }
  | { ok: true; data: StudentInput };

export function inferCohortBatch(nim: string) {
  return Number(nim.slice(0, 2));
}

export function validateStudentData(name: string, nim: string): StudentValidation {
  const cleanName = name.trim();
  const cleanNim = nim.trim();
  if (!/^\d{10}$/.test(cleanNim)) return { ok: false, error: "NIM must contain exactly 10 digits." };
  if (cleanNim === "0000000000") return { ok: false, error: "That NIM is reserved for the admin login trigger." };
  if (cleanNim.startsWith("00")) return { ok: false, error: "The NIM batch must be between 01 and 99." };
  if (!cleanName || cleanName.length > 120) return { ok: false, error: "Name must be between 1 and 120 characters." };
  return { ok: true, data: { nim: cleanNim, name: cleanName, cohortBatch: inferCohortBatch(cleanNim) } };
}

export function validateStudent(formData: FormData) {
  return validateStudentData(formData.get("name")?.toString() ?? "", formData.get("nim")?.toString() ?? "");
}

export function parseStudentCsv(contents: string): { ok: true; data: StudentInput[] } | { ok: false; error: string } {
  let records: string[][];
  try {
    records = parse(contents, { bom: true, skip_empty_lines: true, trim: true });
  } catch {
    return { ok: false, error: "The CSV is malformed. Check quotes, commas, and line endings." };
  }

  if (records.length === 0 || records[0].length !== 2 || records[0][0].toLowerCase() !== "name" || records[0][1].toLowerCase() !== "nim") {
    return { ok: false, error: "The CSV header must be exactly: name,nim." };
  }
  if (records.length === 1) return { ok: false, error: "The CSV does not contain any students." };

  const students: StudentInput[] = [];
  const nims = new Set<string>();
  for (const [index, row] of records.slice(1).entries()) {
    if (row.length !== 2) return { ok: false, error: `Row ${index + 2}: expected exactly two columns.` };
    const parsed = validateStudentData(row[0], row[1]);
    if (!parsed.ok) return { ok: false, error: `Row ${index + 2}: ${parsed.error}` };
    if (nims.has(parsed.data.nim)) return { ok: false, error: `Row ${index + 2}: NIM ${parsed.data.nim} appears more than once.` };
    nims.add(parsed.data.nim);
    students.push(parsed.data);
  }
  return { ok: true, data: students };
}
