import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "YOUR_URL",
  process.env.VITE_SUPABASE_ANON_KEY || "YOUR_KEY"
);
async function test() {
  const { data } = await supabase.from("candidates").select("*");
  console.log(JSON.stringify(data, null, 2));
}
test();
