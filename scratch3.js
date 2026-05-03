import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ngwyczzqsquzuwcehbia.supabase.co";
const supabaseAnonKey = "sb_publishable_qqKzPHGvtssbzFEADexIMA_rDltNS_6";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testToggle() {
  const { data, error } = await supabase
    .from("toggle")
    .select("*")
    .eq("id", 1)
    .single();
  console.log("Single Select Result:", JSON.stringify({ data, error }, null, 2));
}

testToggle();
