// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://bnuyroedxjtxfnzgwmcx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__pSnKxDYu-2ikGZSRl2hjA_KbwuOKE-";

function initSupabase() {
  if (typeof supabase !== "undefined") {
    return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  console.error("Supabase library not loaded");
  return null;
}

const supabaseClient = initSupabase();

console.log("✅ Supabase Config Loaded");
