/* ============================================================
   SYDF — SIMPLE ACTIVITY LOGGER (No Interceptor)
   ============================================================ */
   
async function logActivity(opts) {
  if (typeof supabaseClient === "undefined" || !supabaseClient) return;
  if (!opts || !opts.action) return;

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session || !session.user) return;

    const { data: member } = await supabaseClient
      .from("members")
      .select("name, role, email")
      .eq("user_id", session.user.id)
      .single();

    const adminName = member ? member.name : session.user.email;
    const adminRole = member ? member.role : "Admin";

    // Check karein ke table bani hui hai ya nahi
    await supabaseClient.from("activity_logs").insert([{
      admin_email: session.user.email,
      admin_name: adminName,
      admin_role: adminRole,
      action: opts.action,
      action_label: opts.actionLabel || opts.action,
      target_type: opts.targetType || null,
      target_id: opts.targetId != null ? String(opts.targetId) : null,
      target_name: opts.targetName || null,
      details: opts.details || null
    }]);
  } catch (err) {
    console.log("Log skipped (Table missing or other error)");
  }
}

window.logActivity = logActivity;
window.ActivityLog = {
  custom: (opts) => logActivity(opts)
};
