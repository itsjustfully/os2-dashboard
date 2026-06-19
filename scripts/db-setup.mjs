/**
 * Push SQL migrations to Supabase via the Management API.
 * No Postgres connection string needed.
 *
 * One-time: create a token at https://supabase.com/dashboard/account/tokens
 * Add to .env: SUPABASE_ACCESS_TOKEN=...
 *
 * Usage:
 *   npm run db:setup
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./lib/load-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(__dirname, "..", "supabase", "migrations");

loadEnv();

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef =
  process.env.SUPABASE_PROJECT_REF ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/
  )?.[1];

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN in .env\n");
  console.error("Create one (free, takes 30 seconds):");
  console.error("  1. https://supabase.com/dashboard/account/tokens");
  console.error("  2. Generate new token");
  console.error("  3. Add to .env: SUPABASE_ACCESS_TOKEN=sbp_...");
  process.exit(1);
}

if (!projectRef) {
  console.error("Missing project ref. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_PROJECT_REF");
  process.exit(1);
}

async function runSql(query, name) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${name}: ${res.status} ${body}`);
  }
}

function listMigrations() {
  return readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

console.log(`Supabase setup → project ${projectRef}\n`);

const files = listMigrations();
if (files.length === 0) {
  console.error("No SQL files in supabase/migrations/");
  process.exit(1);
}

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  process.stdout.write(`  → ${file} ... `);
  await runSql(sql, file);
  console.log("done");
}

// Reload PostgREST schema cache
await runSql("notify pgrst, 'reload schema'", "reload schema");

console.log("\nDatabase ready. Run: npm run verify-supabase");
