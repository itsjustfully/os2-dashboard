/**
 * READ-ONLY: verify Trello API key + token. No board writes.
 */
import { loadEnv } from "./lib/load-env.mjs";

loadEnv();

const key = process.env.TRELLO_API_KEY?.trim();
const token = process.env.TRELLO_TOKEN?.trim();
const boardId = process.env.TRELLO_BOARD_ID?.trim();

console.log("=== Trello credential check (read-only) ===\n");

if (!key || !token || !boardId) {
  console.log("Missing TRELLO_API_KEY, TRELLO_TOKEN, or TRELLO_BOARD_ID in .env");
  process.exit(1);
}

console.log(`API key length:  ${key.length} (expect ~32)`);
console.log(`Token length:    ${token.length} (expect ~64–74 after authorize)`);
console.log(`Board ID:        ${boardId}\n`);

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
  console.log("On trello.com/power-ups/admin:");
  console.log("  TRELLO_API_KEY = the short API Key (NOT the Secret)");
  console.log("  TRELLO_TOKEN   = Token link → Allow → copy token");
  process.exit(1);
}

if (me.status === 401) {
  console.log("FAIL: token rejected:", me.body.slice(0, 80), "\n");
  console.log("TRELLO_TOKEN must come from the Token authorize flow, NOT the OAuth Secret.");
  process.exit(1);
}

if (me.status !== 200) {
  console.log("Unexpected:", me.status, me.body);
  process.exit(1);
}

const member = JSON.parse(me.body);
console.log(`OK: authenticated as @${member.username} (${member.fullName})\n`);

const board = await get(`/boards/${boardId}`, { fields: "id,name,url,shortLink" }, key, token);
if (board.status !== 200) {
  console.log("Board access failed:", board.status, board.body.slice(0, 120));
  console.log("Token user may not have access to this board.");
  process.exit(1);
}

const b = JSON.parse(board.body);
console.log(`OK: board "${b.name}"`);
console.log(`    short link: ${b.shortLink}`);
console.log(`    full id:    ${b.id}`);
console.log(`    url:        ${b.url}`);
console.log("\nCredentials are valid.");
