import assert from "node:assert/strict";
import test from "node:test";
import { inferCohortBatch, parseStudentCsv, validateStudent } from "../src/lib/students.ts";
import { formatCohortName, parseCohortBatch } from "../src/lib/cohorts.ts";

function studentForm(nim = "2500000001") {
  const form = new FormData();
  form.set("nim", nim);
  form.set("name", "Test Student");
  form.set("cohortId", "1");
  return form;
}

test("validates student allowlist entries", () => {
  assert.equal(validateStudent(studentForm()).ok, true);
  assert.equal(inferCohortBatch("2800000000"), 28);
  assert.equal(formatCohortName(8), "Binusian 08");
  assert.equal(parseCohortBatch("30"), 30);
  assert.equal(parseCohortBatch("3"), null);
  assert.deepEqual(validateStudent(studentForm("123")), { ok: false, error: "NIM must contain exactly 10 digits." });
  assert.deepEqual(validateStudent(studentForm("0000000000")), { ok: false, error: "That NIM is reserved for the admin login trigger." });
  assert.deepEqual(validateStudent(studentForm("0012345678")), { ok: false, error: "The NIM batch must be between 01 and 99." });
});

test("parses quoted CSV rows and infers cohorts", () => {
  assert.deepEqual(parseStudentCsv('name,nim\r\n"Doe, Jane",2800000000\r\nJohn,2900000000'), {
    ok: true,
    data: [
      { name: "Doe, Jane", nim: "2800000000", cohortBatch: 28 },
      { name: "John", nim: "2900000000", cohortBatch: 29 },
    ],
  });
});

test("rejects malformed headers and duplicate NIMs", () => {
  assert.deepEqual(parseStudentCsv("nim,name\n2800000000,Jane"), { ok: false, error: "The CSV header must be exactly: name,nim." });
  assert.deepEqual(parseStudentCsv("name,nim\nJane,2800000000\nJohn,2800000000"), { ok: false, error: "Row 3: NIM 2800000000 appears more than once." });
});
