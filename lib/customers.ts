import { createSupabaseAdmin } from "./supabase";
import bcrypt from "bcryptjs";

export async function authenticateCustomer(customerId: string, pin: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("customer_id", customerId.toUpperCase())
    .maybeSingle();

  if (error || !data) return null;

  const masterPassword = process.env.ADMIN_PASSWORD;
  if (masterPassword && pin === masterPassword) {
    return {
      customerId: data.customer_id,
      displayName: data.display_name,
      matchValue: data.match_value,
    };
  }

  if (!data.pin_hash) return null;

  const valid = await bcrypt.compare(pin, data.pin_hash);
  if (!valid) return null;

  return {
    customerId: data.customer_id,
    displayName: data.display_name,
    matchValue: data.match_value,
  };
}

export async function getCustomerById(customerId: string) {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("customers")
    .select("customer_id, display_name, match_value")
    .eq("customer_id", customerId.toUpperCase())
    .maybeSingle();

  return data;
}
