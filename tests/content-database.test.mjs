import assert from "node:assert/strict";
import test from "node:test";
import pg from "pg";

test("keeps content cohort-scoped and protects referenced cohorts", { skip: !process.env.DATABASE_URL }, async () => {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("BEGIN");
  try {
    const first = await client.query("INSERT INTO cohorts (batch) VALUES (97) RETURNING id");
    const second = await client.query("INSERT INTO cohorts (batch) VALUES (98) RETURNING id");
    await client.query("INSERT INTO students (nim, name, cohort_id) VALUES ('9999999999', 'Test Student', $1)", [first.rows[0].id]);
    const managedStudent = await client.query("INSERT INTO students (nim, name, cohort_id) VALUES ('9999999998', 'Managed Student', $1) RETURNING id", [first.rows[0].id]);
    const reassigned = await client.query("UPDATE students SET cohort_id = $1, name = 'Updated Student' WHERE id = $2", [second.rows[0].id, managedStudent.rows[0].id]);
    assert.equal(reassigned.rowCount, 1);
    const removed = await client.query("DELETE FROM students WHERE id = $1", [managedStudent.rows[0].id]);
    assert.equal(removed.rowCount, 1);
    const created = await client.query("INSERT INTO lesson_summaries (cohort_id, majors, title, description, image_url, resource_url) VALUES ($1, ARRAY['Computer Science', 'Data Science'], 'Visible', 'Test', 'https://example.com/a.png', 'https://example.com/a') RETURNING id", [first.rows[0].id]);
    const hidden = await client.query("INSERT INTO lesson_summaries (cohort_id, majors, title, description, image_url, resource_url) VALUES ($1, ARRAY['Computer Science'], 'Hidden', 'Test', 'https://example.com/b.png', 'https://example.com/b') RETURNING id", [second.rows[0].id]);

    const visible = await client.query("SELECT title FROM lesson_summaries WHERE cohort_id = $1 AND 'Data Science' = ANY(majors)", [first.rows[0].id]);
    assert.deepEqual(visible.rows, [{ title: "Visible" }]);
    const crossCohortUpdate = await client.query("UPDATE lesson_summaries SET title = 'Leaked' WHERE id = $1 AND cohort_id = $2", [hidden.rows[0].id, first.rows[0].id]);
    assert.equal(crossCohortUpdate.rowCount, 0);
    const updated = await client.query("UPDATE lesson_summaries SET description = 'Updated' WHERE id = $1 AND cohort_id = $2", [created.rows[0].id, first.rows[0].id]);
    assert.equal(updated.rowCount, 1);
    const deleted = await client.query("DELETE FROM lesson_summaries WHERE id = $1 AND cohort_id = $2", [created.rows[0].id, first.rows[0].id]);
    assert.equal(deleted.rowCount, 1);
    await assert.rejects(client.query("DELETE FROM cohorts WHERE id = $1", [first.rows[0].id]), (error) => error.code === "23503");
  } finally {
    await client.query("ROLLBACK");
    await client.end();
  }
});
