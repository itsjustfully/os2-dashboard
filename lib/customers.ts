import { createSupabaseAdmin } from "./supabase";
import bcrypt from "bcryptjs";

function toAuthResult(data: {
  customer_id: string;
  display_name: string;
  match_value: string;
  board_id: string;
}) {
  return {
    customerId: data.customer_id,
    displayName: data.display_name,
    matchValue: data.match_value,
    boardId: data.board_id,
  };
}

export async function authenticateCustomer(customerId: string, pin: string) {
  const supabase = createSupabaseAdmin();
  const { data: rows, error } = await supabase
    .from("customers")
    .select("*")
    .eq("customer_id", customerId.toUpperCase());

  if (error || !rows?.length) return null;

  const masterPassword = process.env.ADMIN_PASSWORD;
  if (masterPassword && pin === masterPassword) {
    return toAuthResult(rows[0]);
  }

  for (const row of rows) {
    if (!row.pin_hash) continue;
    const valid = await bcrypt.compare(pin, row.pin_hash);
    if (valid) return toAuthResult(row);
  }

  return null;
}

export async function getCustomerById(customerId: string) {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("customers")
    .select("customer_id, display_name, match_value, board_id")
    .eq("customer_id", customerId.toUpperCase())
    .limit(1)
    .maybeSingle();

  return data;
}
