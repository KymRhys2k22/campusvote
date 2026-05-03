import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ngwyczzqsquzuwcehbia.supabase.co";
const supabaseAnonKey = "sb_publishable_qqKzPHGvtssbzFEADexIMA_rDltNS_6";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const { data, error } = await supabase
    .from("partylist")
    .select("*");
  console.log("Partylist Result:", JSON.stringify({ data, error }, null, 2));
}

testQuery();
