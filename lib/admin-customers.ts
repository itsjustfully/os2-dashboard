import { createSupabaseAdmin } from "./supabase";
import { fetchBoardCards } from "./trello";
import { parseOrderTitle, slugifyCustomer } from "./parsers";
import bcrypt from "bcryptjs";

export type AdminCustomer = {
  matchValue: string;
  displayName: string;
  customerId: string | null;
  orderCount: number;
  samplePos: string[];
  allPos: string[];
  hasAccount: boolean;
  hasPin: boolean;
  createdAt: string | null;
};

export type PinGenerationResult = {
  matchValue: string;
  customerId: string;
  displayName: string;
  pin: string;
};

function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function listAdminCustomers(): Promise<AdminCustomer[]> {
  const [cards, supabase] = await Promise.all([
    fetchBoardCards(),
    Promise.resolve(createSupabaseAdmin()),
  ]);

  const { data: dbCustomers, error } = await supabase.from("customers").select("*");
  if (error) {
    if (error.message.includes("schema cache") || error.message.includes("does not exist")) {
      throw new Error(
        "Supabase table 'customers' is missing. Run: npm run db:setup"
      );
    }
    throw new Error(error.message);
  }

  const byMatch = new Map<
    string,
    { displayName: string; orderCount: number; pos: string[] }
  >();

  for (const card of cards) {
    const parsed = parseOrderTitle(card.name);
    if (!parsed) continue;

    const key = parsed.customerText.toLowerCase();
    const existing = byMatch.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.pos.push(parsed.poNumber);
    } else {
      byMatch.set(key, {
        displayName: parsed.customerText,
        orderCount: 1,
        pos: [parsed.poNumber],
      });
    }
  }

  const dbByMatch = new Map(
    (dbCustomers ?? []).map((c) => [c.match_value.toLowerCase(), c])
  );

  const merged: AdminCustomer[] = [];

  for (const [matchValue, trello] of byMatch) {
    const db = dbByMatch.get(matchValue);
    merged.push({
      matchValue,
      displayName: db?.display_name ?? trello.displayName,
      customerId: db?.customer_id ?? null,
      orderCount: trello.orderCount,
      samplePos: trello.pos.slice(0, 3),
      allPos: trello.pos,
      hasAccount: !!db,
      hasPin: !!db?.pin_hash,
      createdAt: db?.created_at ?? null,
    });
    dbByMatch.delete(matchValue);
  }

  for (const [, db] of dbByMatch) {
    merged.push({
      matchValue: db.match_value.toLowerCase(),
      displayName: db.display_name,
      customerId: db.customer_id,
      orderCount: 0,
      samplePos: [],
      allPos: [],
      hasAccount: true,
      hasPin: !!db.pin_hash,
      createdAt: db.created_at,
    });
  }

  return merged.sort((a, b) => b.orderCount - a.orderCount);
}

async function uniqueCustomerId(base: string): Promise<string> {
  const supabase = createSupabaseAdmin();
  let id = slugifyCustomer(base);
  if (!id) id = "CUSTOMER";

  for (let i = 0; i < 100; i++) {
    const candidate = i === 0 ? id : `${id}-${i}`;
    const { data } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("customer_id", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }

  throw new Error("Could not generate unique customer ID");
}

export async function generatePinForCustomer(
  matchValue: string
): Promise<PinGenerationResult> {
  const supabase = createSupabaseAdmin();
  const key = matchValue.toLowerCase();

  const customers = await listAdminCustomers();
  const target = customers.find((c) => c.matchValue === key);
  if (!target) throw new Error("Customer not found");

  const pin = generatePin();
  const pinHash = await bcrypt.hash(pin, 10);
  const now = new Date().toISOString();

  if (target.hasAccount && target.customerId) {
    const { error } = await supabase
      .from("customers")
      .update({ pin_hash: pinHash, updated_at: now })
      .eq("customer_id", target.customerId);

    if (error) throw new Error(error.message);

    return {
      matchValue: key,
      customerId: target.customerId,
      displayName: target.displayName,
      pin,
    };
  }

  const customerId = await uniqueCustomerId(target.displayName);
  const { error } = await supabase.from("customers").insert({
    customer_id: customerId,
    display_name: target.displayName,
    match_value: key,
    pin_hash: pinHash,
    updated_at: now,
  });

  if (error) throw new Error(error.message);

  return { matchValue: key, customerId, displayName: target.displayName, pin };
}

export async function bulkGeneratePins(): Promise<PinGenerationResult[]> {
  const customers = await listAdminCustomers();
  const withoutPin = customers.filter((c) => !c.hasPin);
  const results: PinGenerationResult[] = [];

  for (const customer of withoutPin) {
    const result = await generatePinForCustomer(customer.matchValue);
    results.push(result);
  }

  return results;
}
