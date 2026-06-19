import { createClient } from "@supabase/supabase-js";

export type CustomerRow = {
  id: string;
  customer_id: string;
  display_name: string;
  pin_hash: string | null;
  match_value: string;
  board_id: string;
  created_at: string;
  updated_at: string;
};

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
