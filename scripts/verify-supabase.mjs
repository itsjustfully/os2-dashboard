/**
 * Tests Supabase connection + SESSION_SECRET presence (read-only checks).
 */
import { loadEnv } from "./lib/load-env.mjs";
import { createClient } from "@supabase/supabase-js";

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sessionSecret = process.env.SESSION_SECRET;

console.log("=== Environment check ===\n");

console.log("NEXT_PUBLIC_SUPABASE_URL:", url ? "set" : "MISSING");
console.log("SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? `set (${serviceKey.length} chars)` : "MISSING");
console.log("SESSION_SECRET:", sessionSecret ? `set (${sessionSecret.length} chars)` : "MISSING");

if (sessionSecret && sessionSecret.length < 32) {
  console.log("\n⚠ SESSION_SECRET should be at least 32 characters for iron-session security.");
} else if (sessionSecret) {
  console.log("✓ SESSION_SECRET length looks good.");
}

if (!url || !serviceKey) {
  console.log("\nFAIL: Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("\n=== Supabase connection ===\n");

const { count, error: countError } = await supabase
  .from("customers")
  .select("*", { count: "exact", head: true });

const { error: selectError } = await supabase
  .from("customers")
  .select("id")
  .limit(1);

const tableError = countError || selectError;

if (tableError) {
  console.log("FAIL:", tableError.message);
  if (
    tableError.message.includes("schema cache") ||
    tableError.message.includes("does not exist")
  ) {
    console.log("\n→ Run from this project:");
    console.log("   1. Add SUPABASE_ACCESS_TOKEN to .env");
    console.log("      https://supabase.com/dashboard/account/tokens");
    console.log("   2. npm run db:setup");
  }
  process.exit(1);
}

console.log(`OK: Connected to Supabase`);
console.log(`    customers table exists`);
console.log(`    row count: ${count ?? 0}`);
console.log("\n=== All checks passed ===");
