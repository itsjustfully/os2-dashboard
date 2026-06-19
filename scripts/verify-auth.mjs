/**
 * READ-ONLY: verify Trello API key + token. No board writes.
 */
import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const key = process.env.TRELLO_API_KEY?.trim();
const token = process.env.TRELLO_TOKEN?.trim();

console.log("=== Trello credential check (read-only) ===\n");

if (!key || !token) {
  console.log("Missing TRELLO_API_KEY or TRELLO_TOKEN in .env");
  process.exit(1);
}

console.log(`API key length:  ${key.length} (expect ~32)`);
console.log(`Token length:    ${token.length} (expect ~64–74 after authorize)\n`);

async function get(path, params, k, t) {
  const url = new URL(`https://api.trello.com/1${path}`);
  url.searchParams.set("key", k);
  url.searchParams.set("token", t);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }
  const res = await fetch(url);
  return { status: res.status, body: await res.text() };
}

const me = await get("/members/me", { fields: "fullName,username" }, key, token);

if (me.status === 401 && me.body.includes("invalid key")) {
  console.log("FAIL: invalid API key\n");
  process.exit(1);
}

if (me.status === 401) {
  console.log("FAIL: token rejected:", me.body.slice(0, 80), "\n");
  process.exit(1);
}

if (me.status !== 200) {
  console.log("Unexpected:", me.status, me.body);
  process.exit(1);
}

const member = JSON.parse(me.body);
console.log(`OK: authenticated as @${member.username} (${member.fullName})\n`);

const boardsRes = await get(
  "/members/me/boards",
  { fields: "id,name,shortLink,url", filter: "open" },
  key,
  token
);

if (boardsRes.status !== 200) {
  console.log("Board list failed:", boardsRes.status, boardsRes.body.slice(0, 120));
  process.exit(1);
}

const boards = JSON.parse(boardsRes.body);
console.log(`OK: ${boards.length} open board(s) accessible:\n`);
for (const board of boards) {
  console.log(`  - ${board.name} (${board.shortLink ?? board.id})`);
}

console.log("\nCredentials are valid. Boards are chosen in the admin panel.");
