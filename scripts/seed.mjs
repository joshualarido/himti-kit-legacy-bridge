import { readFile } from "node:fs/promises";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
try {
  await client.query(await readFile("db/seed.sql", "utf8"));
  console.log("Development seed applied");
} finally {
  await client.end();
}
