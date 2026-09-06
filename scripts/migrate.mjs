import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

try {
  await client.query("BEGIN");
  await client.query("CREATE TABLE IF NOT EXISTS migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  const files = (await readdir("db/migrations")).filter((file) => file.endsWith(".sql")).sort();

  for (const file of files) {
    const applied = await client.query("SELECT 1 FROM migrations WHERE name = $1", [file]);
    if (applied.rowCount) continue;
    await client.query(await readFile(join("db/migrations", file), "utf8"));
    await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
    console.log(`Applied ${file}`);
  }

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
